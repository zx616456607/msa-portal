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

console.warn('Build webpack dll ...')

const vendors = [
  '@antv/g6',
  'antd',
  'classnames',
  'codemirror',
  'g2',
  'history',
  'isomorphic-fetch',
  'lodash',
  'normalizr',
  'query-string',
  'rc-queue-anim',
  'react',
  'react-codemirror2',
  'react-copy-to-clipboard',
  'react-dock',
  'react-dom',
  'react-helmet',
  'react-redux',
  'react-router-dom',
  'react-router-redux',
  'redux',
  'redux-devtools-extension',
  'redux-thunk',
  'reselect',
  'sockjs-client',
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
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
