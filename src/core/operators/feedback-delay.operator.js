import { EMPTY, timer } from 'rxjs';
import { map, expand, filter } from 'rxjs/operators';

const MAX_NOTE_COUNT = 20;
const MAX_DELAY_FUDGE_MS = 250;

const feedbackDelay = baseDelay => source => {
  let maxCount = 0;

  return source.pipe(
    map(o => {
      maxCount += 1;
      return [maxCount, o];
    }),
    expand(([count, o]) =>
      maxCount <= MAX_NOTE_COUNT || count > maxCount - MAX_NOTE_COUNT
        ? timer(baseDelay + Math.random() * MAX_DELAY_FUDGE_MS).pipe(
            map(() => [
              count,
              Object.assign(o, {
                velocity:
                  (MAX_NOTE_COUNT - (maxCount - count)) / MAX_NOTE_COUNT,
              }),
            ]),
            filter(([, { velocity }]) => velocity > 0)
          )
        : EMPTY
    ),
    map(([, o]) => o)
  );
};

export default feedbackDelay;
