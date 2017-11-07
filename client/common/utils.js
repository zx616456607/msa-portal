/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Site common tools
 *
 * 2017-08-16
 * @author zhangpc
 */

/**
 * get cookie by name
 *
 * @export
 * @param {string} cName cookie name
 * @return {string} cookie
 */

import { DEFAULT, DEFAULT_TIME_FORMAT } from '../constants'
import moment from 'moment'

moment.locale('zh-cn')

export function getCookie(cName) {
  if (document.cookie.length === 0) {
    return null
  }
  let cStart = document.cookie.indexOf(cName + '=')
  if (cStart === -1) {
    return null
  }
  cStart = cStart + cName.length + 1
  let cEnd = document.cookie.indexOf(';', cStart)
  if (cEnd === -1) {
    cEnd = document.cookie.length
  }
  return unescape(document.cookie.substring(cStart, cEnd))
}

export function numbers(num = 0) {
  if (num < 1000) {
    return num
  }
  let unit = ''
  let divisor = 1
  if (num >= 10000) {
    unit = 'w'
    divisor = 10000
  } else if (num >= 1000) {
    unit = 'k'
    divisor = 1000
  }
  num = Math.ceil(num / divisor * 10) / 10
  return `${num}${unit}`
}

/**
 * stringify query object
 *
 * @export
 * @param {object} obj query object
 * @param {string} sep '&'
 * @param {string} eq '-'
 * @return {string} query string
 */
export function toQuerystring(obj, sep, eq) {
  sep = sep || '&'
  eq = eq || '='
  if (!obj) {
    return ''
  }
  const stringifyPrimitive = v => {
    switch (typeof v) {
      case 'string':
        return v
      case 'boolean':
        return v ? 'true' : 'false'
      case 'number':
        return isFinite(v) ? v : ''
      default:
        return ''
    }
  }
  const queryString = Object.keys(obj)
    .sort()
    .map(k => {
      const ks = stringifyPrimitive(k) + eq
      if (Array.isArray(obj[k])) {
        return obj[k].map(v => {
          return ks + stringifyPrimitive(v)
        }).join(sep)
      }
      return ks + stringifyPrimitive(obj[k])
    })
    .join(sep)
  if (!queryString) {
    return ''
  }
  return queryString
}

export const getQueryKey = query => toQuerystring(query) || DEFAULT

/**
 * get default select keys
 *
 * @param {object} location the object of location from react-router
 * @param {array} menus menu list
 * @return {array} defaultSelectedKeys
 */
export const getDefaultSelectedKeys = (location, menus) => {
  const defaultSelectedKeys = []
  menus.every(menu => {
    if (menu.to === '/') {
      if (location.pathname === menu.to) {
        defaultSelectedKeys.push(menu.to)
        return false
      }
      return true
    }
    if (location.pathname === menu.to) {
      // if (location.pathname.indexOf(menu.to) === 0) {
      defaultSelectedKeys.push(menu.to)
      return false
    }
    return true
  })
  if (defaultSelectedKeys.length === 0) {
    defaultSelectedKeys.push(menus[0].to)
  }
  return defaultSelectedKeys
}

/**
 * Format date
 *
 * @export
 * @param {any} timestamp date
 * @param {any} format date format
 * @return {string} format date string
 */
export function formatDate(timestamp, format) {
  format = format || DEFAULT_TIME_FORMAT
  if (!timestamp || timestamp === '') {
    return moment(new Date()).format(format)
  }
  return moment(timestamp).format(format)
}

/**
 * Scroll to top
 *
 * @export
 * @param {string} selector date
 * @return {any} undefined
 */
export function scrollToTop(selector) {
  if (typeof window !== 'undefined') {
    if (!selector) {
      return window.scrollTo(0, 0)
    }
    // IE, Edge, UC not support `scrollTo` in other element except `window`
    const target = document.querySelector(selector)
    target && (target.scrollTop = 0)
  }
}
