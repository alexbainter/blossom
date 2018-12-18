import { now } from 'tone';
import { Scale } from 'tonal';
import getInstrument from './get-instrument';

const ONE_HUNDRED = 100;
const NOTE_TIME_OFFSET_S = 0.01;

const tonicPc = 'D';
// eslint-disable-next-line no-magic-numbers
const octaves = [2, 3, 4, 5, 6];
const notes = octaves.reduce(
  (allNotes, octave) =>
    allNotes.concat(Scale.notes(`${tonicPc}${octave}`, 'major')),
  []
);

const getNoteAtHeight = yPct =>
  notes[
    Math.min(
      notes.length - 1,
      Math.floor(((ONE_HUNDRED - yPct) / ONE_HUNDRED) * notes.length)
    )
  ];

const getPlayer = () =>
  getInstrument().then(instrument => () => ({ yPct, velocity }) => {
    const note = getNoteAtHeight(yPct);
    instrument.triggerAttack(note, now() + NOTE_TIME_OFFSET_S, velocity);
  });

export default getPlayer;
