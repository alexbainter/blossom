import { fromEvent, merge } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import startAudioContext from 'startaudiocontext';
import { context } from 'tone';
import normalToPct from '../../normal-to-pct.js';

const mapInputToCoordinate = (containerEl, coordinateInput) => ({
  xPct: normalToPct(coordinateInput.clientX / containerEl.clientWidth),
  yPct: normalToPct(coordinateInput.clientY / containerEl.clientHeight),
  velocity: 1,
});

const makeClickSource = el =>
  fromEvent(el, 'click').pipe(
    map(clickEvent => mapInputToCoordinate(el, clickEvent))
  );

const makeTouchSource = el =>
  fromEvent(el, 'touchstart').pipe(
    mergeMap(({ changedTouches }) => Array.from(changedTouches)),
    map(touchEvent => mapInputToCoordinate(el, touchEvent))
  );

const makeInputSource = el => {
  startAudioContext(context, el);
  return merge(makeClickSource(el), makeTouchSource(el));
};

export default makeInputSource;
