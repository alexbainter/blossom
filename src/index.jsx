import { render } from 'react-dom';
import React from 'react';
import { install } from 'offline-plugin/runtime';
import Canvas from './canvas/canvas.component.jsx';
import WithPlayer from './with-player.component.jsx';
import './base-styles.scss';

//eslint-disable-next-line
if (process.env.NODE_ENV === 'production') {
  install();

  console.log('https://github.com/generative-music/blossom');
}

render(<WithPlayer Component={Canvas} />, document.getElementById('root'));
