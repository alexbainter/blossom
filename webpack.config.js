'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({ lastStyleLoader = 'style-loader' } = {}) => ({
  mode: 'development',
  entry: ['babel-polyfill', './src/index.jsx'],
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
  },
  devServer: {
    static: {
      directory: __dirname,
    },
  },
  module: {
    rules: [
      { test: /\.jsx?$/, include: path.resolve('./src'), use: 'babel-loader' },
      {
        test: /\.s?css$/,
        include: path.resolve('./src'),
        use: [lastStyleLoader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.mp3$/,
        include: path.resolve('./src'),
        use: 'file-loader',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.template.html' })],
});
