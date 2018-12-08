import uuid from 'uuid';
import shuffleArray from 'shuffle-array';
import { Observable } from 'rxjs';

const colors = shuffleArray([
  '#EDC9FF',
  '#FED4E7',
  '#F2B79F',
  '#E5B769',
  '#D8CC34',
]);

function* makeColorGenerator() {
  for (
    let i = 0;
    i < colors.length;
    i + 1 === colors.length - 1 ? (i = 0) : (i += 1)
  ) {
    yield colors[i];
  }
}

const colorSource = Observable.create(observer => {
  const colorGenerator = makeColorGenerator();
  observer.next(colorSource);
});

const note = ({ x, y }) => ({ x, y, velocity: 1, id: uuid(), color: 'blue' });

export default note;
