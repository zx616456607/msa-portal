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

export const JWT_COOKIE_NAME = 'jwt'
export const SITE = 'tenxcloud.com'
export const API_PREFIX = '/api/v1'
export const API_PROTOCOL = isProd ? 'http' : 'http'
export const API_HOST = isProd ? '192.168.1.10:9092' : 'localhost:9092'
export const API_URL = `${API_PROTOCOL}://${API_HOST}${API_PREFIX}`
export const DEFAULT = 'default'
