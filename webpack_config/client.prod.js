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
// const WebpackMd5Hash = require('webpack-md5-hash')
const postcssConfig = require('./postcss')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

console.warn('Use production webpack config ...')

const publicPath = '/public/'
const svgHash = +new Date()

module.exports = {
  devtool: '#cheap-source-map',

  entry: {
    main: [
      './client/entry/index.js',
    ],
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
    path: path.join(__dirname, '../static/public'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].chunk.[chunkhash:8].js',
    publicPath,
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
              spriteFilename: `sprite.${svgHash}.svg`,
              runtimeGenerator: require.resolve('./svg_runtime_generator'),
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { removeStyleElement: true },
                { removeAttrs: { attrs: 'fill' } },
              ],
            },
          },
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
    // new WebpackMd5Hash(),
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
      filename: path.join(__dirname, '../index.html'),
      template: path.join(__dirname, '../client/index.html'),
      title: '<%= title %>',
      initialState: '<%- initialState %>',
      svgHash,
      publicPath,
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
      name: 'vendor',
      filename: 'vendor.[chunkhash:8].js',
      // (Give the chunk a different name)
      minChunks: Infinity,
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.[hash:8].js',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
