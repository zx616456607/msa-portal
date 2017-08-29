/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App webpack dev config
 *
 * https://webpack.js.org/guides/migrating/
 * v0.1 - 2017-08-15
 * @author Zhangpc
 */

const path = require('path')
const webpack = require('webpack')
const postcssConfig = require('./postcss')
// const nodeModulesPath = path.join(__dirname, '/node_modules/')
const hotMiddleWareConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

console.log('Use development webpack config ...')

module.exports = {
  devtool: '#cheap-module-eval-source-map',

  entry: {
    main: [
      hotMiddleWareConfig,
      'react-hot-loader/patch',
      './client/entry/index.js',
    ],
  },

  resolve: {
    modules: [
      path.join(__dirname, '../client'),
      'node_modules',
    ],
    extensions: [ '.js', '.jsx', '.json' ],
    alias: {
      '@': path.join(__dirname, '../client'),
    },
  },

  output: {
    path: path.join(__dirname, '../static/public'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/public/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              esModule: false,
            },
          },
          'svgo-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 5192, // 5KB 以下图片自动转成 base64 码
          name: 'img/[name].[hash:8].[ext]',
        },
      },
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
    }),
    new SpriteLoaderPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
