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
export const DEFAULT = 'default'
export const CONTENT_TYPE_JSON = 'application/json'
export const CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded'
export const PINPOINT_LIMIT = 5000
export const X_GROUP_UNIT = 284211
export const Y_GROUP_UNIT = 57
