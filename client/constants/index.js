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

export const JWT = 'jwt'
export const API_PREFIX = '/api/v2'
export const API_PROTOCOL = isProd ? 'http' : 'http'
export const API_HOST = isProd ? '192.168.1.103:48000' : '192.168.1.103:48000'
export const API_URL = `${API_PROTOCOL}://${API_HOST}${API_PREFIX}`
export const SPI_PREFIX = '/spi/v2'
export const SPI_URL = `${API_PROTOCOL}://${API_HOST}${SPI_PREFIX}`
export const SPRING_CLOUD_URL = 'http://192.168.1.58:8000/api/v1'
export const DEFAULT = 'default'
export const TIMES_WITHOUT_YEAR = 'MM-DD HH:mm:ss'
export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const CONTENT_TYPE_JSON = 'application/json'
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
