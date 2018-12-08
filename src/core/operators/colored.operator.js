import shuffleArray from 'shuffle-array';
import { merge, of } from 'rxjs';
import {
  debounceTime,
  map,
  take,
  mergeMap,
  withLatestFrom,
  tap,
  startWith,
} from 'rxjs/operators';

const COLORS = ['#EDC9FF', '#FED4E7', '#F2B79F', '#E5B769', '#D8CC34'];
const COLOR_DEBOUNCE_TIME_MS = 3000;

function* makeRandomLoopGenerator(arr) {
  const shuffledArr = shuffleArray(arr);
  for (
    let i = 0;
    i < shuffledArr.length;
    i + 1 === shuffledArr.length - 1 ? (i = 0) : (i += 1)
  ) {
    yield shuffledArr[i];
  }
}

const colored = () => source => {
  const colorGenerator = makeRandomLoopGenerator(COLORS);
  const debouncedColors$ = merge(
    of(colorGenerator.next().value),
    source.pipe(
      debounceTime(COLOR_DEBOUNCE_TIME_MS),
      map(() => colorGenerator.next().value)
    )
  );
  return source.pipe(
    withLatestFrom(debouncedColors$),
    map(([o, color]) => Object.assign({}, o, { color }))
  );
};

export default colored;
