/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * client.dev.js page
 *
 * @author zhangtao
 * @date Monday August 13th 2018
 */
const path = require('path')
const merge = require('webpack-merge')
const common = require('./client.base.js')
const postcssConfig = require('./postcss')
const webpack = require('webpack')

module.exports = merge(common, {
  devtool: '#cheap-module-eval-source-map',
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    './client/entry/index.js',
  ],
  output: {
    path: path.join(__dirname, '../static/public'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },
  module: {
    rules: [
      /* {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            esModule: false,
            runtimeGenerator: require.resolve('./svg_runtime_generator'),
          },
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeTitle: true },
              { removeStyleElement: true },
              { removeAttrs: { attrs: 'path:fill' } },
            ],
          },
        },
      ],
      }, */
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: postcssConfig,
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: postcssConfig,
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../manifest.json'),
    }),
    // webpack-hot-client will auto add this plugin
    // new webpack.HotModuleReplacementPlugin(),
  ],
})
