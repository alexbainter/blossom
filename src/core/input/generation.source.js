import { of } from 'rxjs';
import { concatMap, delay, repeat } from 'rxjs/operators';
import normalToPct from '../../normal-to-pct.js';

const MAX_DELAY_MS = 20000;

const randomNote = () => ({
  xPct: normalToPct(Math.random()),
  yPct: normalToPct(Math.random()),
  velocity: 1,
});

let callCounter = 0;
const getDelay = () => {
  if (callCounter < 2) {
    callCounter += 1;
    return 500;
  }
  return Math.random() * MAX_DELAY_MS;
};

const generation$ = of(null).pipe(
  concatMap(() => of(randomNote()).pipe(delay(getDelay()))),
  repeat()
);

export default generation$;
