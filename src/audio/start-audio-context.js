// "inspired by" https://github.com/tambien/StartAudioContext/blob/master/StartAudioContext.js
import { context } from 'tone';
import silentSoundUrl from './silence.mp3';

const startAudioContext = () => {
  // this accomplishes the iOS specific requirement
  const buffer = context.createBuffer(1, 1, context.sampleRate);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);

  // resume the audio context
  if (context.state && context.state !== 'running' && context.resume) {
    context.resume();
  }

  const tag = document.createElement('audio');
  if (tag.canPlayType('audio/mp3')) {
    // Play a silent sound via an HTML audio element to enable proper audio playback in iOS
    tag.controls = false;
    tag.preload = 'auto';
    tag.loop = false;
    tag.src = silentSoundUrl;
    tag.play();
  }
};

export default startAudioContext;
