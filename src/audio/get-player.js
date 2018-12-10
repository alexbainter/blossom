import { now } from 'tone';
import { Scale } from 'tonal';
import getInstrument from './get-instrument';

const tonicPc = 'D';
const octaves = [2, 3, 4, 5, 6];
const notes = octaves.reduce(
  (allNotes, octave) =>
    allNotes.concat(Scale.notes(`${tonicPc}${octave}`, 'major')),
  []
);

const getNoteAtHeight = yPct =>
  notes[
    Math.min(notes.length - 1, Math.floor(((100 - yPct) / 100) * notes.length))
  ];

const getPlayer = () =>
  getInstrument().then(instrument => () => ({ yPct, velocity }) => {
    const note = getNoteAtHeight(yPct);
    instrument.triggerAttack(note, now() + 0.01, velocity);
  });

export default getPlayer;
