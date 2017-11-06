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

// get config from env for prod
const { env } = process
const api = env.PAAS_API || 'http://192.168.1.103:48000'
const {
  protocol: PASS_API_PROTOCOL,
  host: PASS_API_HOST,
} = url.parse(api)
const PASS_API_PREFIX = env.PASS_API_PREFIX || '/api/v2'
const PASS_SPI_PREFIX = env.PASS_SPI_PREFIX || '/spi/v2'
const PASS_API_URL = `${PASS_API_PROTOCOL}//${PASS_API_HOST}${PASS_API_PREFIX}`
const PASS_SPI_URL = `${PASS_API_PROTOCOL}//${PASS_API_HOST}${PASS_SPI_PREFIX}`
const MSA_API = env.MSA_API || 'http://192.168.1.58:8000'
const MSA_API_PREFIX = env.MSA_API_PREFIX || '/api/v1'
const MSA_API_URL = MSA_API + MSA_API_PREFIX
const initialConfig = {
  PASS_API_PROTOCOL,
  PASS_API_HOST,
  PASS_API_PREFIX,
  PASS_SPI_PREFIX,
  PASS_API_URL,
  PASS_SPI_URL,
  MSA_API_PREFIX,
  MSA_API_URL,
}

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
  initialConfig,
}

module.exports = config
