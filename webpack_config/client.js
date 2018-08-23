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

// const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const analyze = !!process.env.ANALYZE_ENV
const isDebug = !(process.env.NODE_ENV === 'production')
// let config

if (!isDebug) {
  console.warn('Use production webpack config ...')
  module.exports = require('./client.prod')
} else {
  console.warn('Use development webpack config ...')
  module.exports = require('./client.dev')
}

// for webpack build analyze
// if (analyze) {
//   config.plugins.push(new BundleAnalyzerPlugin())
// }

// // for define env
// const envDefinePlugin = new webpack.DefinePlugin({
//   'process.env': {
//     NODE_ENV: JSON.stringify(env.NODE_ENV),
//   },
// })
// config.plugins.unshift(envDefinePlugin)

// // for banner license
// const licenseBannerPlugin = new webpack.BannerPlugin({
//   banner: `Licensed Materials - Property of ${site}\n(C) Copyright 2017~2018 ${site}. All Rights Reserved.\nhttp://${site}`,
//   exclude: /\.svg$/,
// })
// config.plugins.push(licenseBannerPlugin)
