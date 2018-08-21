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
      index: 'index.debug.html',
      logLevel: 'info',
      lazy: false,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
      },
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
      },
      headers: { 'X-Custom-Header': 'yes' },
    },
    hotClient: {
      logLevel: 'info',
      allEntries: true,
      autoConfigure: true,
      hmr: true,
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
