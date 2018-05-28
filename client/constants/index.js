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
// const PAAS_API_HOST = isProd ? '192.168.1.103:48000' : '192.168.1.103:48000'
const PAAS_API_HOST = isProd ? '192.168.1.103:48000' : '192.168.1.59:9001'
const PAAS_API_PREFIX = '/api/v2'
const PAAS_SPI_PREFIX = '/spi/v2'
const PAAS_API_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_API_PREFIX}`
const PAAS_SPI_URL = `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}${PAAS_SPI_PREFIX}`
const MSA_API = 'http://192.168.1.58:8080'
const MSA_API_PREFIX = '/api/v1'
const MSA_API_URL = MSA_API + MSA_API_PREFIX
const CSB_API = 'http://192.168.1.58:9090'
// const CSB_API = 'http://192.168.0.19:8081'
const CSB_API_PREFIX = '/api/v1'
const CSB_API_URL = CSB_API + CSB_API_PREFIX
const CLIENT_API = 'http://192.168.1.254:8080'
const CLIENT_API_PREFIX = '/uaa'
const CLIENT_API_URL = `${CLIENT_API}${CLIENT_API_PREFIX}`
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
  CSB_API,
  CSB_API_PREFIX,
  CSB_API_URL,
  CLIENT_API_URL,
}
// prod api config
if (isProd) {
  apiConfig = window.__INITIAL_STATE__.config
}
export const API_CONFIG = apiConfig

export const JWT = 'jwt'
export const AUTH_URL = 'auth_url'
export const DEFAULT = 'default'
export const ROLE_SYS_ADMIN = 2
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
export const ASYNC_VALIDATOR_TIMEOUT = 800
export const USER_CURRENT_CONFIG = 'msa_user_current_config'
export const MY_PORJECT = '我的个人项目'
export const MSA_TYPE_MAN = 'manual' // 手动注册
export const MSA_TYPE_AUTO = 'automatic' // 自动注册
export const MSA_TYPES_TEXT = {
  [MSA_TYPE_MAN]: '手动注册',
  [MSA_TYPE_AUTO]: '自动注册',
}
// RegExp
export const APP_NAME_REG = /^[a-zA-Z][a-zA-Z0-9\-]{1,48}[a-zA-Z0-9]$/
export const HOST_REG = /^[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-\.]*[a-zA-Z0-9_-]+(:\d+)?[a-zA-Z0-9_\-\/\?#]*$/
export const URL_REG = /^https?:\/\/[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-\.]*[a-zA-Z0-9_-]+(:\d+)?[a-zA-Z0-9_\-\/\?#]*$/
export const REDIRECT_URL_REG = /^https?:\/\/[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_,\-\.]*[a-zA-Z0-9_-]+(:\d+)?[a-zA-Z0-9_\-\/\?#]*$/

export const API_GATEWAY_LIMIT_TYPES = [
  {
    key: 'second',
    text: '秒',
  },
  {
    key: 'minute',
    text: '分钟',
  },
  {
    key: 'hour',
    text: '小时',
  },
  {
    key: 'day',
    text: '天',
  },
]

export const SECONDS_CONVERSION = {
  1: '秒',
  60: '分钟',
  [60 * 60]: '小时',
  [60 * 60 * 24]: '天',
}

export const CSB_PUBLIC_INSTANCES_FLAG = 0
export const CSB_AVAILABLE_INSTANCES_FLAG = 1
export const CSB_OM_INSTANCES_FLAG = 2
export const CSB_APPLY_FLAG = 0
export const CSB_APPROVAL_FLAG = 1
export const CSB_RELEASE_INSTANCES_SERVICE_FLAG = 1
export const CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG = 0
export const UNUSED_CLUSTER_ID = 'unused-cluster-id'
export const CANCEL_APPROVAL_TIMEOUT = 6 * 60 * 60 * 1000
export const CSB_INSTANCE_SERVICE_STATUS_RUNNING = 1
export const CSB_INSTANCE_SERVICE_STATUS_STOPPED = 2
export const CSB_INSTANCE_SERVICE_STATUS_LOGOUT = 4
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGESIZE = 10
export const CREATE_CSB_CASCADING_LINK_RLUE_DEFAULT_INSTANCE_QUERY = {
  page: 1,
  size: 1000,
  flag: CSB_OM_INSTANCES_FLAG,
}
export const INSTANCE_SERVICES = [
  'dsb-server',
  'dsb-server-elasticsearch',
  'dsb-server-mysql',
  'dsb-server-redis',
]
export const CLIENT_JWT = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiIyYTNmYjVhYjIwYzc0ZjU4OThhNDdmMTEyMGJkNGNhMS1yIiwic3ViIjoiZWRkYjk3NzgtMmE0ZS00NTBhLTgwM2ItMDg3NDUwZWNjMjZkIiwic2NvcGUiOlsidWFhLmFkbWluIiwiY2xpZW50cy5hZG1pbiIsInVhYS51c2VyIl0sImlhdCI6MTUyNjkwMDk2MiwiZXhwIjoxNTI5NDkyOTYyLCJjaWQiOiJhZG1pbiIsImNsaWVudF9pZCI6ImFkbWluIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS4yNTQ6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJ6aWQiOiJ1YWEiLCJncmFudF90eXBlIjoicGFzc3dvcmQiLCJ1c2VyX25hbWUiOiJ3ZWl3ZWkiLCJvcmlnaW4iOiJ1YWEiLCJ1c2VyX2lkIjoiZWRkYjk3NzgtMmE0ZS00NTBhLTgwM2ItMDg3NDUwZWNjMjZkIiwicmV2X3NpZyI6IjJjOGUyZWI3IiwiYXVkIjpbImNsaWVudHMiLCJ1YWEiLCJhZG1pbiJdfQ.HZ3XXTihHI43nMG3LwhanklapV5hjWqrkRPtwSuX2nY'
