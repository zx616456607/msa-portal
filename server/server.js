/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Main backend app file
 *
 * 2017-08-15
 * @author zhangpc
 */

// for webpack build backend files runtime
import '@babel/polyfill'
import http from 'http'
import path from 'path'
import Koa from 'koa'
import render from 'koa-ejs'
import Router from 'koa-router'
import koaBunyanLogger from 'koa-bunyan-logger'
import serveStatic from 'koa-static'
import config from '../config'
import packageJSON from '../package.json'
import middlewares from './middlewares'
import indexRoutes from './routes'
import { format as formatError } from './service/errors'
// set root dir to global
global.__root__dirname = __dirname
// repalce native Promise by bluebird
global.Promise = require('bluebird')
// disabled reject unauthorized
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const { env } = process
const { NODE_ENV } = env
const app = new Koa()
// const bunyan = koaBunyanLogger.bunyan
const isDebug = NODE_ENV !== 'production'
global.isDebug = isDebug
global.config = config

// set app config
const { name, version } = packageJSON
app.name = name
app.version = version

// use logging middleware
const bunyanLoggerOpts = {
  name,
  level: config.log.level,
}
/* if (!isDebug) {
  class MyRawStream {
    write(rec) {
      console.log('rec', rec)
      console.log('[%s] %s: %s',
        rec.time.toISOString(),
        bunyan.nameFromLevel[rec.level],
        rec.msg
      )
    }
  }
  bunyanLoggerOpts.streams = [{
    stream: new MyRawStream(),
    type: 'raw',
  }, {
    type: 'rotating-file',
    path: `/var/log/${name}/${name}-web.log`,
    period: '1d', // daily rotation
    count: 7, // keep 7 back copies at recent week
  }, {
    type: 'rotating-file',
    level: 'error',
    path: `/var/log/${name}/${name}-error.log`,
    period: '1d', // daily rotation
    count: 7, // keep 7 back copies at recent week
  }]
} */
app.use(koaBunyanLogger(bunyanLoggerOpts))
app.use(koaBunyanLogger.requestIdContext())
app.use(async (ctx, next) => {
  // ignore static file url
  if (config.log.ignoreUrlReg.test(ctx.url)) {
    ctx.log.info('ignore url', ctx.url)
    return await next()
  }
  return koaBunyanLogger.requestLogger().apply(this, [ ctx, next ])
})
// set signed cookie keys
app.keys = config.appKeys

// uses async arrow functions
app.use(async (ctx, next) => {
  try {
    await next() // next is now a function
  } catch (err) {
    ctx.log.error(err)
    ctx.log.info(err.stack)
    const error = formatError(err)
    const { status, message } = error
    ctx.status = status
    ctx.body = {
      status,
      message,
    }
  }
})

// render view with ejs
const viewOps = {
  root: __dirname,
  layout: false,
  viewExt: 'html',
  debug: false,
  cache: true,
}
if (isDebug) {
  viewOps.debug = true
  viewOps.cache = false
}
render(app, viewOps)

if (isDebug) {
  // webpack middleware for dev and hot reload
  app.use(middlewares.webpack())
}

// serve static files
const staticOpts = {}
// open cache in production mode
if (!isDebug) {
  staticOpts.maxage = 1000 * 60 * 60 * 24 * 7 // 静态文件一周的缓存
}
app.use(serveStatic(path.join(__dirname, '../static'), staticOpts))

// routes middleware
app.use(indexRoutes(Router))

// create http server
const { port, hostname } = config
const server = http.createServer(app.callback()).listen(port, hostname, () => {
  console.warn(`${app.name}@${app.version} is listening on port ${port}`)
  console.warn(`Open up http://${hostname}:${port}/ in your browser`)
  // Set server timeout to 5 mins
  const serverTimeOut = 1000 * 60 * 5
  console.warn('Set server timeout to ' + serverTimeOut + ' ms')
  server.setTimeout(serverTimeOut, () => {
    console.warn('Server timeout occurs')
  })
})

export default server
