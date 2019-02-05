'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({ lastStyleLoader = 'style-loader' } = {}) => ({
  mode: 'development',
  entry: ['babel-polyfill', './src/index.jsx'],
  devtool: 'sourcemap',
  output: {
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, include: path.resolve('./src'), use: 'babel-loader' },
      {
        test: /\.s?css$/,
        include: path.resolve('./src'),
        use: [lastStyleLoader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.template.html' })],
});
