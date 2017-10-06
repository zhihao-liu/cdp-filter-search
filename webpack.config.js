'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = { 
  entry: path.resolve(__dirname, 'client/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'client.bundle.js'
  },
  module: {
    loaders: [{
      test: [ /\.js$/, /\.jsx$/ ],
      include: [ /lib/, /client/ ],
      loader: 'babel-loader',
      query: {
        presets: [ 'react' ]
      }
    }]
  }
};