/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Middleware for koa
 *
 * @author zhangpc
 * @date 2017-08-15
 */

/**
 * Webpack middleware for dev and hot reload
 *
 * @return {Object} webpack middleware
 */
export function webpackMiddleware() {
  const webpack = require('webpack')
  const webpackConfig = require('../../webpack_config/client')
  const compiler = webpack(webpackConfig)
  const koaWebpack = require('koa-webpack')
  return koaWebpack({
    compiler,
    devMiddleware: {
      logLevel: 'info',
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
      },
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
      },
      headers: { 'X-Custom-Header': 'yes' },

      // display no info to console (only warnings and errors)
      // noInfo: true,

      // display nothing to the console
      // quiet: false,

      // switch into lazy mode
      // that means no watching, but recompilation on every request
      // lazy: true,

      // watch options (only lazy: false)
      // watchOptions: {
      //   aggregateTimeout: 300,
      //   poll: 1000,
      // },

      // public path to bind the middleware to
      // use the same as in webpack
      // publicPath: webpackConfig.output.publicPath,

      // custom headers
      // headers: { 'X-Custom-Header': 'yes' },

      // options for formating the statistics
      // stats: {
      //   colors: true,
      // },
    },
    hotClient: {
      logLevel: 'info',
      /* eslint-disable */
      // log: console.log,
      // path: '/__webpack_hmr',
      // heartbeat: 10 * 1000,
    },
  })
}

/**
 * without `export default`, you have to import like this :
 *
 * ```js
 * import * as middlewares from './middlewares'
 * // or
 * import { jwt, webpack } fom './middlewares'
 * ```
 */
export default { webpackMiddleware }
