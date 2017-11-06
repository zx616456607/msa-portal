/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Server config
 *
 * @author zhangpc
 * @date 2017-11-06
 */
const url = require('url')

const { env } = process
const api = env.API || 'http://192.168.1.103:48000'
const {
  protocol: API_PROTOCOL,
  host: API_HOST,
} = url.parse(api)
const API_PREFIX = env.API_PREFIX || '/api/v2'
const SPI_PREFIX = env.SPI_PREFIX || '/spi/v2'
const API_URL = `${API_PROTOCOL}//${API_HOST}${API_PREFIX}`
const SPI_URL = `${API_PROTOCOL}//${API_HOST}${SPI_PREFIX}`
const SPRING_CLOUD_API_URL = env.SPRING_CLOUD_API_URL || 'http://192.168.1.58:8000/api/v1'

const config = {
  port: 8989,
  hostname: '0.0.0.0',
  site: 'tenxcloud.com',
  jwtConfig: {
    expiresIn: 1000 * 60 * 30, // 30min
    errorTime: 1000 * 60 * 1.5, // 1.5min
  },
  log: {
    level: 'debug' || env.LOG_LEVEL,
    ignoreUrlReg: /^\/(favicon\.ico|__webpack_hmr|img\/|public\/)/i,
  },
  initialConfig: {
    API_PROTOCOL,
    API_HOST,
    API_PREFIX,
    SPI_PREFIX,
    API_URL,
    SPI_URL,
    SPRING_CLOUD_API_URL,
  },
}

module.exports = config
