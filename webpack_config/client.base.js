/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * client.base.js page
 *
 * @author zhangtao
 * @date Monday August 13th 2018
 */
const path = require('path')
const webpack = require('webpack')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

console.warn('Use production webpack config ...')

module.exports = {
  entry: {
    vendor: [
      '@babel/polyfill',
      'g2',
      '@antv/g6',
      'moment',
      'codemirror',
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, '../client'),
      'node_modules',
    ],
    alias: {
      '@': path.join(__dirname, '..', 'client'),
    },
  },
  output: {
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.(jpe?g|png|gif|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 5192, // 5KB 以下图片自动转成 base64 码
          name: 'img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new SpriteLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
