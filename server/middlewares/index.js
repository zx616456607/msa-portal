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

// import uuid from 'uuid'
// import ms from 'ms'
// import { getJwt } from '../service/jwt'
import { jwtConfig } from '../../config'
import { JWT_COOKIE_NAME } from '../../client/constants'

export async function jwt(ctx, next) {
  const { expiresIn, errorTime } = jwtConfig
  if (ctx.cookies.get(JWT_COOKIE_NAME)) {
    ctx.log.info('ctx.cookies.get(JWT_COOKIE_NAME)--', ctx.cookies.get(JWT_COOKIE_NAME))
    return await next()
  }
  // const jwtid = uuid.v4()
  // const { data } = await getJwt({ jwtid, expiresIn: ms(expiresIn) })
  const data = {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqd3RpZCI6InRlc3QiLCJpYXQiOjE1MDI3OTAwNDQsImV4cCI6MTUwMjg3NjQ0NH0.NycCLWkdlVgLYaBlE5lW3xnSnlX5erC5rPPHxeit86A',
    expires: 1502876444746,
  }
  const { token } = data
  let expires = Date.now() + expiresIn - errorTime
  expires = new Date(expires)
  const cookieOpts = {
    signed: true,
    httpOnly: false,
    expires,
  }
  ctx.cookies.set(JWT_COOKIE_NAME, token, cookieOpts)
  ctx.state[JWT_COOKIE_NAME] = token
  ctx.log.info('[set]jwtInfo--', JSON.stringify(data))
  await next()
}

/**
 * Webpack middleware for dev and hot reload
 *
 * @return {Object} webpack middleware
 */
export function webpack() {
  const webpack = require('webpack')
  const webpackConfig = require('../../webpack_config/client')
  const compiler = webpack(webpackConfig)
  const koaWebpack = require('koa-webpack')
  return koaWebpack({
    compiler,
    dev: {
      // display no info to console (only warnings and errors)
      noInfo: true,

      // display nothing to the console
      // quiet: false,

      // switch into lazy mode
      // that means no watching, but recompilation on every request
      // lazy: true,

      // watch options (only lazy: false)
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },

      // public path to bind the middleware to
      // use the same as in webpack
      publicPath: webpackConfig.output.publicPath,

      // custom headers
      headers: { 'X-Custom-Header': 'yes' },

      // options for formating the statistics
      stats: {
        colors: true,
      },
    },
    hot: {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
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
export default { jwt, webpack }
