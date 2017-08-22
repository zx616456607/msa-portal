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
export const API_HOST = isProd ? '192.168.0.8:8000' : '192.168.0.8:8000'
export const API_URL = `${API_PROTOCOL}://${API_HOST}${API_PREFIX}`
export const DEFAULT = 'default'
