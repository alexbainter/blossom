import { merge, of } from 'rxjs';
import { debounceTime, map, withLatestFrom } from 'rxjs/operators';
import materialColors from 'material-colors';
import makeRandomLoopGenerator from '../../make-random-loop-generator';

const bannedColors = ['white', 'black', 'yellow'];
const bannedSuffixes = ['Text', 'Icons'];
const colorKeys = Reflect.ownKeys(materialColors).filter(
  name =>
    !bannedColors.includes(name) &&
    bannedSuffixes.every(suffix => !name.endsWith(suffix))
);

const colors = colorKeys.map(key => materialColors[key][300]);
const COLOR_DEBOUNCE_TIME_MS = 3000;

const colored = () => source => {
  const colorGenerator = makeRandomLoopGenerator(colors);
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
