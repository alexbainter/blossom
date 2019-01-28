'use strict';

const glob = require('glob');
const OfflinePlugin = require('offline-plugin');
const samples = require('./src/samples.json');
const config = require('./webpack.config');

const sampleFilenames = ['ogg', 'mp3'].reduce(
  (filenames, format) =>
    filenames.concat(Object.values(samples[`vsco2-piano-reverb-${format}`])),
  []
);

const iconFilenames = glob.sync('icons/**/*.png');

const otherFilenames = ['favicon.ico', 'manifest.json'];

const filenamesToCache = sampleFilenames
  .concat(iconFilenames)
  .concat(otherFilenames);

config.plugins.push(
  new OfflinePlugin({
    appShell: '/',
    externals: filenamesToCache,
    autoUpdate: true,
  })
);

config.mode = 'production';

module.exports = config;
