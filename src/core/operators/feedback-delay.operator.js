import { EMPTY, timer } from 'rxjs';
import { map, expand, filter } from 'rxjs/operators';

const MAX_NOTE_COUNT = 15;
const MAX_PLAYS_COUNT = 15;
const MAX_FUDGE_PER_PLAY_MS = 250;

const noteCountVelocity = ({ maxCount, count }) =>
  (MAX_NOTE_COUNT - (maxCount - count)) / MAX_NOTE_COUNT;
const notePlaysVelocity = ({ plays }) =>
  (MAX_PLAYS_COUNT - plays + 1) / MAX_PLAYS_COUNT;

const velocityFns = [noteCountVelocity, notePlaysVelocity];

const feedbackDelay = baseDelay => source => {
  let maxCount = 0;

  return source.pipe(
    map(o => {
      maxCount += 1;
      return [o, maxCount, 1];
    }),
    expand(([o, count, plays]) =>
      maxCount <= MAX_NOTE_COUNT || count > maxCount - MAX_NOTE_COUNT
        ? timer(
            baseDelay + (plays - 1) * Math.random() * MAX_FUDGE_PER_PLAY_MS
          ).pipe(
            map(() => [
              Object.assign(o, {
                velocity:
                  velocityFns.reduce(
                    (velocity, fn) => velocity + fn({ maxCount, count, plays }),
                    0
                  ) / velocityFns.length,
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
