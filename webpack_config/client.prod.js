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
const CleanWebpackPlugin = require('clean-webpack-plugin')

const svgHash = +new Date()
const publicPath = '/public/'
const outputPath = path.join(__dirname, '../static/public')
module.exports = merge(common, {
  devtool: '#cheap-source-map',
  mode: 'production',
  entry: './client/entry/index.js',
  output: {
    path: outputPath,
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
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
    new CleanWebpackPlugin([
      '../static/public',
      '../dist',
    ]),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css',
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
      includeSiblingChunks: true,
      // chunksSortMode: 'none',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'all',
          priority: 10,
          minChunks: 2,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
        },
      },
    },
  },
})
