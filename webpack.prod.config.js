'use strict';

const OfflinePlugin = require('offline-plugin');
const samples = require('./src/samples.json');
const config = require('./webpack.config');

const sampleFilenames = ['ogg', 'mp3'].reduce(
  (filenames, format) =>
    filenames.concat(Object.values(samples[`vsco2-piano-reverb-${format}`])),
  []
);

config.plugins.push(
  new OfflinePlugin({
    appShell: '/',
    externals: sampleFilenames,
    autoUpdate: true,
  })
);

config.mode = 'production';

module.exports = config;
