import { Sampler, Filter, Master, Compressor } from 'tone';
import samples from '../samples.json';

const OGG_FORMAT = 'ogg';
const MP3_FORMAT = 'mp3';

const audio = document.createElement('audio');

const sampleFormat =
  audio.canPlayType('audio/ogg') !== '' ? OGG_FORMAT : MP3_FORMAT;

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
    const instrument = new Sampler(
      samples[`vsco2-piano-reverb-${sampleFormat}`],
      {
        onload: () => resolve(instrument),
      }
    ).chain(lowpass, lowshelf, compressor, Master);
  });

export default getInstrument;
