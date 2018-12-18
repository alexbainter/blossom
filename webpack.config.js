'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index.jsx'],
  devtool: 'sourcemap',
  module: {
    rules: [
      { test: /\.jsx?$/, include: path.resolve('./src'), use: 'babel-loader' },
      {
        test: /\.s?css$/,
        include: path.resolve('./src'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.template.html' })],
};
