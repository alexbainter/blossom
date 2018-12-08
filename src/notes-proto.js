import { fromEvent, timer, Observable, Subject } from 'rxjs';
import { map, filter, delayWhen } from 'rxjs/operators';

let noteId = 0;
const note = () => ({ id: noteId++, velocity: 1 });

const notesSubject = new Subject();

const clickSource = fromEvent(document, 'click').pipe(map(() => note()));
clickSource.subscribe(notesSubject);

const repeatedNotes = notesSubject.pipe(
  filter(({ velocity }) => velocity >= 0.1),
  delayWhen(() => timer(1000)),
  map(n => {
    n.velocity -= 0.1;
    return n;
  })
);
repeatedNotes.subscribe(notesSubject);

notesSubject.subscribe(n => {
  //play the note
  console.log(n);
});
