import { EMPTY, timer } from 'rxjs';
import { map, expand, filter } from 'rxjs/operators';

const MAX_NOTE_COUNT = 30;
const MAX_DELAY_FUDGE_MS = 250;
const MAX_PLAYS_COUNT = 30;

const noteCountVelocity = (maxCount, count) =>
  (MAX_NOTE_COUNT - (maxCount - count)) / MAX_NOTE_COUNT;
const notePlaysVelocity = plays =>
  Math.max((MAX_PLAYS_COUNT - plays + 1) / MAX_PLAYS_COUNT, 0);

const feedbackDelay = baseDelay => source => {
  let maxCount = 0;

  return source.pipe(
    map(o => {
      maxCount += 1;
      return [o, maxCount, 1];
    }),
    expand(([o, count, plays]) =>
      maxCount <= MAX_NOTE_COUNT || count > maxCount - MAX_NOTE_COUNT
        ? timer(baseDelay + Math.random() * MAX_DELAY_FUDGE_MS).pipe(
            map(() => [
              Object.assign(o, {
                velocity:
                  (noteCountVelocity(maxCount, count) +
                    notePlaysVelocity(plays)) /
                  2,
              }),
              count,
              plays + 1,
            ]),
            filter(([{ velocity }]) => velocity > 0)
          )
        : EMPTY
    ),
    map(([o]) => o)
  );
};

export default feedbackDelay;
