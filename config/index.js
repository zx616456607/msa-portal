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
  protocol: PAAS_API_PROTOCOL,
  host: PAAS_API_HOST,
} = url.parse(api)
const PAAS_API_PREFIX = env.PAAS_API_PREFIX || '/api/v2'
const PAAS_SPI_PREFIX = env.PAAS_SPI_PREFIX || '/spi/v2'
const PAAS_API_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_API_PREFIX}`
const PAAS_SPI_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_SPI_PREFIX}`
const MSA_API = env.MSA_API || 'http://192.168.1.58:8080'
const MSA_API_PREFIX = env.MSA_API_PREFIX || '/api/v1'
const MSA_API_URL = MSA_API + MSA_API_PREFIX
const CSB_API = env.CSB_API || 'http://192.168.1.58:9090'
const CSB_API_PREFIX = env.CSB_API_PREFIX || '/api/v1'
const CSB_API_URL = CSB_API + CSB_API_PREFIX
const CLIENT_API = env.CLIENT_API || 'http://192.168.1.254:8080'
const CLIENT_API_PREFIX = env.CLIENT_API_PREFIX || '/uaa'
const ZIPKIN_API_PREFIX = env.ZIPKIN_API_PREFIX || '/api/v1'
const CLIENT_API_URL = `${CLIENT_API}${CLIENT_API_PREFIX}`
const ZIPKIN_API_URL = `${MSA_API}${ZIPKIN_API_PREFIX}`
const initialConfig = {
  PAAS_API_PROTOCOL,
  PAAS_API_HOST,
  PAAS_API_PREFIX,
  PAAS_SPI_PREFIX,
  PAAS_API_URL,
  PAAS_SPI_URL,
  MSA_API,
  MSA_API_PREFIX,
  MSA_API_URL,
  CSB_API,
  CSB_API_PREFIX,
  CSB_API_URL,
  CLIENT_API_URL,
  ZIPKIN_API_URL,
}

const config = {
  appKeys: [ 'tenxcloud.com', '5f4a73e9-0493-4c66-86a6-ffaf7a8b73c8' ],
  port: 8989,
  hostname: '0.0.0.0',
  site: 'tenxcloud.com',
  log: {
    level: 'debug' || env.LOG_LEVEL,
    ignoreUrlReg: /^\/(favicon\.ico|__webpack_hmr|img\/|public\/)/i,
  },
  initialConfig,
}

module.exports = config
