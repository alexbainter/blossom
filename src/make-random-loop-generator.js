import shuffleArray from 'shuffle-array';

function* makeRandomLoopGenerator(arr) {
  let shuffledArr = shuffleArray(arr);
  let i = 0;
  while (1) {
    if (i < shuffledArr.length) {
      yield shuffledArr[i];
    } else {
      i = 0;
      shuffledArr = shuffleArray(shuffledArr);
      yield shuffledArr[i];
    }
    i += 1;
  }
}

export default makeRandomLoopGenerator;
