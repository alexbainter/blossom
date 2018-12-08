import './canvas/canvas.jsx';
// import './audio/player';
import './base-styles.scss';

// import { Observable, pipe, from, of, Subject } from 'rxjs';
// import { concatMap, delay, repeat } from 'rxjs/operators';
// import feedbackDelay from './core/operators/feedback-delay.operator';
//
// let id = 0;
// let inputId = 0;
// const makeRandomNote = inputId => () => {
//   id += 1;
//   return { id, inputId, velocity: 1 };
// };
//
// const makeInput = () =>
//   Observable.create(observer => {
//     inputId += 1;
//     const randomNote = makeRandomNote(inputId);
//     setInterval(() => {
//       observer.next(randomNote());
//     }, 2000);
//   });
//
// const inputDestination = new Subject();
// const outputSource = new Subject();
// const withFeedback = inputDestination.pipe(feedbackDelay(1000));
// withFeedback.subscribe(outputSource);
//
// const input1 = makeInput();
// input1.subscribe(inputDestination);
// const subscription1 = outputSource.subscribe(n => console.log(n));
// setTimeout(() => {
//   subscription1.unsubscribe();
//   console.log('unsubscribed');
// }, 5000);
//
// setTimeout(() => {
//   console.log('resubscribing');
//   outputSource.subscribe(n => console.log(n));
// }, 10000);
