import { of, merge } from 'rxjs';
import { concatMap, delay, repeat, map } from 'rxjs/operators';
import normalToPct from '../../normal-to-pct.js';

const MAX_DELAY_MS = 20000;

const randomNote = () => ({
  xPct: normalToPct(Math.random()),
  yPct: normalToPct(Math.random()),
  velocity: 1,
});

const getDelay = () => Math.random() * MAX_DELAY_MS;

const generation$ = merge(
  of(null).pipe(
    concatMap(() => of(randomNote()).pipe(delay(getDelay()))),
    repeat()
  ),
  of(null).pipe(map(() => randomNote()))
);

export default generation$;
