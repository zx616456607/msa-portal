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
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const postcssConfig = require('./postcss')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

console.log('Use production webpack config ...')

module.exports = {
  devtool: '#cheap-source-map',

  entry: {
    main: [
      './client/entry/index.js',
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
    path: path.join(__dirname, '../static/public'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].chunk.[chunkhash:8].js',
    publicPath: '/public/',
  },

  // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
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
              spriteFilename: 'sprite-[hash:6].svg',
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: postcssConfig,
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            'less-loader',
            {
              loader: 'postcss-loader',
              options: postcssConfig,
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    new WebpackMd5Hash(),
    new ExtractTextPlugin({
      filename: 'styles.[contenthash:8].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      // inject: false, // disabled inject
      minify: {
        collapseWhitespace: true,
        minifyJS: true,
      },
      title: '<%= title %>',
      filename: path.join(__dirname, '../index.html'),
      template: path.join(__dirname, '../client/index.html'),
    }),
    new SpriteLoaderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      unused: true,
      dead_code: true,
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.[chunkhash:8].js',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
