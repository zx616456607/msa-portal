/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * client.prod.js page
 *
 * @author zhangtao
 * @date Monday August 13th 2018
 */
const merge = require('webpack-merge')
const common = require('./client.base.js')
const path = require('path')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssConfig = require('./postcss')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const svgHash = +new Date()
const publicPath = '/public/'

module.exports = merge(common, {
  devtool: '#cheap-source-map',
  mode: 'production',
  entry: {
    main: [
      './client/entry/index.js',
    ],
    vendor: [
      '@babel/polyfill',
      'g2',
      'moment',
      'codemirror',
    ],
  },
  output: {
    path: path.join(__dirname, '../static/public'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].chunk.[chunkhash:8].js',
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
      }, */
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
    ],
  },
  plugins: [
    // new WebpackMd5Hash(),
    // new ExtractTextPlugin({
    //   filename: 'styles.[chunkhash:8].css',
    //   allChunks: true,
    // }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),
    new webpack.HashedModuleIdsPlugin(),
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   comments: false,
    //   unused: true,
    //   dead_code: true,
    // }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  optimization: {
    minimize: true,
  },
})
