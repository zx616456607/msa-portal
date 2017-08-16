/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

 /**
 * App webpack server config
 *
 * v0.1 - 2017-08-15
 * @author Zhangpc
 */

const path = require('path')
const webpack = require('webpack')

console.log('Build webpack dll ...')

const vendors = [
  'antd',
  'isomorphic-fetch',
  'lodash',
  'normalizr',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-thunk',
  'redux-devtools-extension',
  'redux-logger',
  // ...其它库
]

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '../static/public/webpack_dll'),
    filename: '[name].js',
    library: '[name]',
  },
  entry: {
    lib: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../manifest.json'),
      name: '[name]',
      context: __dirname,
    }),
    new webpack.NoErrorsPlugin(),
  ],
}
