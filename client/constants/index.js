/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Constants
 *
 * 2017-08-16
 * @author zhangpc
 */

const isProd = process.env.NODE_ENV === 'production'

/* api config */
// dev api config
const PAAS_API_PROTOCOL = isProd ? 'http:' : 'http:'
const PAAS_API_HOST = isProd ? '192.168.1.103:48000' : '192.168.1.103:48000'
const PAAS_API_PREFIX = '/api/v2'
const PAAS_SPI_PREFIX = '/spi/v2'
const PAAS_API_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_API_PREFIX}`
const PAAS_SPI_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_SPI_PREFIX}`
const MSA_API = 'http://192.168.1.58:8080'
const MSA_API_PREFIX = '/api/v1'
const MSA_API_URL = MSA_API + MSA_API_PREFIX
let apiConfig = {
  PAAS_API_PROTOCOL,
  PAAS_API_HOST,
  PAAS_API_PREFIX,
  PAAS_SPI_PREFIX,
  PAAS_API_URL,
  PAAS_SPI_URL,
  MSA_API,
  MSA_API_PREFIX,
  MSA_API_URL,
}
// prod api config
if (isProd) {
  apiConfig = window.__INITIAL_STATE__.config
}
export const API_CONFIG = apiConfig

export const JWT = 'jwt'
export const DEFAULT = 'default'
export const TIMES_WITHOUT_YEAR = 'MM-DD HH:mm:ss'
export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const CONTENT_TYPE_JSON = 'application/json'
export const CONTENT_TYPE_TEXT = 'text/plain'
export const CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded'
export const PINPOINT_LIMIT = 5000
export const X_GROUP_UNIT = 284211
export const Y_GROUP_UNIT = 57
export const ALL = 'all'
export const NORMAL = 0
export const ERROR = 1
export const USER_CURRENT_CONFIG = 'msa_user_current_config'
export const MY_PORJECT = '我的个人项目'
export const MSA_RULE_ADM = 'admission' // 手动注册
export const MSA_RULE_EXP = 'expulsion' // 手动剔除
// RegExp
export const APP_NAME_REG = /^[a-zA-Z][a-zA-Z0-9\-]{1,49}$/
export const HOST_REG = /^[0-9.\-A-Za-z]+$/
export const URL_REG = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
