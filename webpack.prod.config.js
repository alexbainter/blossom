'use strict';

const glob = require('glob');
const OfflinePlugin = require('offline-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const samples = require('./src/samples.json');
const makeConfig = require('./webpack.config');

const config = makeConfig({ lastStyleLoader: MiniCssExtractPlugin.loader });

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
  new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
  new OfflinePlugin({
    appShell: '/',
    externals: filenamesToCache,
    autoUpdate: true,
  })
);

config.mode = 'production';
delete config.devtool;

module.exports = config;
