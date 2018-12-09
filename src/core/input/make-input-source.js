import { fromEvent, merge } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

const makeInputSource = el => merge(makeClickSource(el), makeTouchSource(el));

export default makeInputSource;
