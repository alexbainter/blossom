import { of } from 'rxjs';
import { concatMap, delay, repeat } from 'rxjs/operators';
import normalToPct from '../../normal-to-pct.js';

const MAX_DELAY_MS = 20000;

const randomNote = () => ({
  xPct: normalToPct(Math.random()),
  yPct: normalToPct(Math.random()),
});

const getDelay = () => Math.random() * MAX_DELAY_MS;

const generation$ = of(null).pipe(
  concatMap(() => of(randomNote()).pipe(delay(getDelay()))),
  repeat()
);

export default generation$;
