import { Sampler, Reverb, Filter, Master, Compressor, now } from 'tone';
import { Scale } from 'tonal';
import shuffleArray from 'shuffle-array';
import samples from './samples.json';

let colors = shuffleArray([
  '#EDC9FF',
  '#FED4E7',
  '#F2B79F',
  '#E5B769',
  '#D8CC34',
]);

function* makeColorGenerator() {
  for (
    let i = 0;
    i < colors.length;
    i + 1 === colors.length - 1 ? (i = 0) : (i += 1)
  ) {
    yield colors[i];
  }
}

const colorGenerator = makeColorGenerator();

const lowpass = new Filter({
  frequency: 2500,
  type: 'lowpass',
});
const lowshelf = new Filter({
  freqequency: 1500,
  type: 'lowshelf',
  rolloff: -96,
});
const compressor = new Compressor();

const glock = new Sampler(samples['vsco2-piano-reverb']).chain(
  lowpass,
  lowshelf,
  compressor,
  Master
);

const tonicPc = 'C';
const pentatonic = 'major';
const octaves = [2, 3, 4, 5, 6];
const notes = octaves.reduce(
  (allNotes, octave) =>
    allNotes.concat(Scale.notes(`${tonicPc}${octave}`, pentatonic)),
  []
);

console.log(pentatonic);

const getNoteAtHeight = (y, maxY) =>
  notes[
    Math.min(
      notes.length - 1,
      notes.length - 1 - Math.floor(y / (maxY / notes.length))
    )
  ];

const ticksPerSecond = 100;
const tickTimeMS = 1000 / ticksPerSecond;
const maxTicks = 7000 / tickTimeMS;

const clicks = new Map();
for (let i = 0; i <= maxTicks; i += 1) {
  clicks.set(i, []);
}

let tick = 0;
let ticksSinceLastClick = 0;

const triggerClick = click => {
  const { clickEvent, color, velocity } = click;
  const bodyHeight = document.body.clientHeight;
  const note = getNoteAtHeight(clickEvent.clientY, bodyHeight);
  glock.triggerAttack(note, now(), velocity);
  const circle = document.createElement('div');
  Object.assign(circle.style, {
    width: '0px',
    height: '0px',
    'background-color': color,
    'border-radius': '50%',
    position: 'fixed',
    left: `${clickEvent.clientX}px`,
    top: `${clickEvent.clientY}px`,
    transition: '6s linear',
  });
  document.body.appendChild(circle);
  setTimeout(() => {
    Object.assign(circle.style, {
      width: '500px',
      height: '500px',
      opacity: 0,
      left: `${clickEvent.clientX - 250}px`,
      top: `${clickEvent.clientY - 250}px`,
    });
  }, 30);
};

setInterval(() => {
  const updatedClicks = clicks
    .get(tick)
    .map(click => {
      click.velocity -= 0.1;
      return click;
    })
    .filter(({ velocity }) => velocity >= 0.1);
  updatedClicks.forEach(clickEvent => triggerClick(clickEvent));
  clicks.set(tick, updatedClicks);
  tick = tick + 1 >= maxTicks ? 0 : tick + 1;
  ticksSinceLastClick += 1;
}, tickTimeMS);

const makeGetClickColor = () => {
  let color = colorGenerator.next().value;
  return () => {
    if (ticksSinceLastClick > 3000 / tickTimeMS) {
      color = colorGenerator.next().value;
    }
    return color;
  };
};
const getClickColor = makeGetClickColor();
const click = clickEvent => ({
  clickEvent,
  color: getClickColor(),
  velocity: 1,
});

document.body.style.height = '100vh';
document.body.onclick = clickEvent => {
  const newClick = click(clickEvent);
  triggerClick(newClick);
  const clicksForCurrentTick = clicks.get(tick);
  clicks.set(tick, clicksForCurrentTick.concat([newClick]));
  ticksSinceLastClick = 0;
};
document.body.ontouchstart = touchEvent => {
  const newClicks = Array.from(touchEvent.touches).map(touch => {
    const newClick = click(touch);
    triggerClick(newClick);
    return newClick;
  });
  const clicksForCurrentTick = clicks.get(tick);
  clicks.set(tick, clicksForCurrentTick.concat(newClicks));
  ticksSinceLastClick = 0;
};
document.body.ontouchend = event => event.preventDefault();

const randomClick = () => {
  const { clientHeight, clientWidth } = document.body;
  return click({
    clientX: Math.random() * clientWidth,
    clientY: Math.random() * clientHeight,
  });
};

const queueRandomNote = () => {
  setTimeout(() => {
    const newClicks = [randomClick()];
    if (Math.random() < 0.3) {
      newClicks.push(randomClick());
    }
    newClicks.forEach(newClick => triggerClick(newClick));
    const clicksForCurrentTick = clicks.get(tick);
    clicks.set(tick, clicksForCurrentTick.concat(newClicks));
    ticksSinceLastClick = 0;
    queueRandomNote();
  }, Math.random() * 20000 + 1000);
};

queueRandomNote();
