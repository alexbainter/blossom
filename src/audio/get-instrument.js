import samples from '../samples.json';
import { Sampler, Filter, Master, Compressor } from 'tone';

const lowpass = new Filter({
  frequency: 2500,
  type: 'lowpass',
});
const lowshelf = new Filter({
  freqequency: 1500,
  type: 'lowshelf',
  rolloff: -96,
});
const compressor = new Compressor();

const getInstrument = () =>
  new Promise(resolve => {
    const instrument = new Sampler(samples['vsco2-piano-reverb'], {
      onload: () => resolve(instrument),
    }).chain(lowpass, lowshelf, compressor, Master);
  });

export default getInstrument;
