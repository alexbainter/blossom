import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import normalToPct from '../../normal-to-pct.js';

const makeClickSource = el =>
  fromEvent(el, 'click').pipe(
    map(clickEvent => ({
      xPct: normalToPct(clickEvent.clientX / el.clientWidth),
      yPct: normalToPct(clickEvent.clientY / el.clientHeight),
    }))
  );

export default makeClickSource;
