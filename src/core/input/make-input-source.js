import { fromEvent, merge } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import normalToPct from '../../normal-to-pct.js';

const mapInputToCoordinate = (containerEl, coordinateInput) => ({
  xPct: normalToPct(coordinateInput.clientX / containerEl.clientWidth),
  yPct: normalToPct(coordinateInput.clientY / containerEl.clientHeight),
});

const makeClickSource = el =>
  fromEvent(el, 'click').pipe(
    map(clickEvent => mapInputToCoordinate(el, clickEvent))
  );

const makeTouchSource = el =>
  fromEvent(el, 'touchstart').pipe(
    tap(() => console.log('touched')),
    mergeMap(({ touches }) =>
      Array.from(touches).reduce(
        (distinctTouches, touch) =>
          distinctTouches.concat(
            distinctTouches.some(
              ({ clientX, clientY }) =>
                touch.clientX === clientX && touch.clientY === clientY
            )
              ? []
              : [touch]
          ),
        []
      )
    ),
    tap(arr => console.log(arr.clientX, arr.clientY)),
    map(touchEvent => mapInputToCoordinate(el, touchEvent))
  );

const makeInputSource = el => merge(makeClickSource(el), makeTouchSource(el));

export default makeInputSource;
