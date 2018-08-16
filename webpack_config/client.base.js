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
const siteConfig = require('../config')
const { site } = siteConfig
const env = process.env
const analyze = !!process.env.ANALYZE_ENV
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const configBase = {
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
      },
    }),
    new SpriteLoaderPlugin(),
    new webpack.BannerPlugin({
      banner: `Licensed Materials - Property of ${site}\n(C) Copyright 2017~2018 ${site}. All Rights Reserved.\nhttp://${site}`,
      exclude: /\.svg$/,
    }),
  ],
}

if (analyze) {
  configBase.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = configBase
