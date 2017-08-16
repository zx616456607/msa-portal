/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App webpack config
 *
 * v0.1 - 2017-08-15
 * @author Zhangpc
 */
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const siteConfig = require('../config')
const { site } = siteConfig
const analyze = !!process.env.ANALYZE_ENV
const env = process.env
const isDebug = !(process.env.NODE_ENV === 'production')
let config

if (!isDebug) {
  config = require('./client.prod')
} else {
  config = require('./client.dev')
}

// for webpack build analyze
if (analyze) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

// for define env
const envDefinePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(env.NODE_ENV),
  },
})
config.plugins.unshift(envDefinePlugin)

// for banner license
const licenseBannerPlugin = new webpack.BannerPlugin({
  banner: `Licensed Materials - Property of ${site}\n(C) Copyright 2017~2018 ${site}. All Rights Reserved.\nhttp://${site}`,
})
config.plugins.push(licenseBannerPlugin)

// for html
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  // inject: false, // disabled inject
  // chunks: [ 'main', 'common' ],
  // minify: {
  //   collapseWhitespace: true,
  //   minifyJS: true,
  // },
  filename: path.join(__dirname, isDebug ? '../index.debug.html' : '../index.html'),
  template: path.join(__dirname, '../client/index.html'),
})
config.plugins.push(htmlWebpackPlugin)

module.exports = config
