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
import 'moment/locale/zh-cn'

moment.locale('zh-cn', {
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '%d 秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年',
  },
})

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
  for (const k in obj) {
    if (obj[k] === null || obj[k] === '' || obj[k] === undefined) {
      delete obj[k]
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
export const getMenuSelectedKeys = (location, menus) => {
  const defaultSelectedKeys = []
  const { pathname } = location
  menus.every(menu => {
    if (menu.to === '/') {
      if (pathname === menu.to) {
        defaultSelectedKeys.push(menu.to)
        return false
      }
      return true
    }
    if (menu.type === 'SubMenu') {
      const childrenMenus = menu.children
      let isFound = false
      childrenMenus.every(_menu => {
        if (_menu.includePaths && _menu.includePaths.indexOf(pathname) > -1) {
          defaultSelectedKeys.push(_menu.to)
          isFound = true
          return false
        }
        if (pathname === _menu.to) {
          defaultSelectedKeys.push(_menu.to)
          isFound = true
          return false
        }
        return true
      })
      // if found jump out of the loop
      return !isFound
    }
    if (pathname === menu.to) {
      // if (pathname.indexOf(menu.to) === 0) {
      defaultSelectedKeys.push(menu.to)
      return false
    }
    return true
  })
  if (defaultSelectedKeys.length === 0) {
    defaultSelectedKeys.push(menus[0].to || (menus.children && menus.children[0].to))
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

export function formatFromnow(begin) {
  const time = moment(begin).fromNow()
  return time
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

/**
 * Get the type of var
 *
 * @export
 * @param {any} param var
 * @return {string} type
 */
export function getType(param) {
  let type = Object.prototype.toString.call(param)
  type = type.replace(/\[object /, '')
  type = type.replace(/\]/, '')
  return type.toLowerCase()
}

/**
 * Check object if empty
 *
 * @param {object} obj the object
 * @return {bool} true or false
 */
export function isEmptyObj(obj) {
  for (const name in obj) {
    return false
  }
  return true
}

/**
 * Get role object by roleId
 *
 * @param {number} roleId id of role
 * @return {object} role object
 */
export const getInstanceRole = roleId => {
  const data = {
    subscribe: false,
    publish: false,
  }
  switch (roleId) {
    case 1:
      data.subscribe = true
      break
    case 2:
      data.publish = true
      break
    case 4:
      data.subscribe = true
      data.publish = true
      break
    default:
      break
  }
  return data
}

/**
 * render instance authorization status
 *
 * @param {number} role of instance
 * @return {string} role object
 */
export const renderInstanceRole = role => {
  switch (role) {
    case 1:
      return '仅订阅服务'
    case 2:
      return '仅发布服务'
    case 4:
      return '发布服务 & 订阅服务'
    default:
      return '-'
  }
}

/**
 * format instance filter by role
 *
 * @param {object} filters object
 * @return {string} filters conditions
 */
export const formatFilterConditions = filters => {
  const { role } = filters
  if (!role || !role.length || role.length === 3) {
    return []
  }
  if (role.length === 1) {
    return [ `role-eq-${role[0]}` ]
  }
  role.sort()
  if (role.length === 2) {
    const firstValue = role[0]
    const secondValue = role[1]
    if (firstValue === '1' && secondValue === '2') {
      return [ 'role-ne-4' ]
    }
    if (firstValue === '1' && secondValue === '4') {
      return [ 'role-ne-2' ]
    }
    if (firstValue === '2' && secondValue === '4') {
      return [ 'role-ne-1' ]
    }
    return []
  }
}

/**
 * format instance role by filter
 *
 * @param {string} filterString string
 * @return {array} filters conditions
 */
export const formatRole = filterString => {
  switch (filterString) {
    case 'role,eq,1':
      return [ '1' ]
    case 'role,eq,2':
      return [ '2' ]
    case 'role,eq,4':
      return [ '4' ]
    case 'role,ne,4':
      return [ '1', '2' ]
    case 'role,ne,2':
      return [ '1', '4' ]
    case 'role,ne,1':
      return [ '2', '4' ]
    default:
      return []
  }
}

/**
 * format instance service sorter query by sorter
 *
 * @param {object} sorter object
 * @return {string} order conditions
 */
export function parseOrderToQuery(sorter = {}) {
  const { columnKey, order } = sorter
  if (!columnKey) {
    return null
  }
  switch (order) {
    case 'descend':
      return `${columnKey},desc`
    case 'ascend':
      return `${columnKey},asc`
    default:
      return null
  }
}

/**
 * format instance service sortOrder by sortObj, query
 *
 * @param {object} sortObj object
 * @param {object} query object
 * @return {object} sortOrder object
 */
export function parseQueryToSortorder(sortObj = {}, query = {}) {
  const { sort = '' } = query
  const queryArray = sort.split(',')
  const columnName = queryArray[0]
  const sortValue = queryArray[1]
  let order = false
  switch (sortValue) {
    case 'desc': order = 'descend'; break
    case 'asc': order = 'ascend'; break
    default: order = false; break
  }
  sortObj[columnName] = order
  return sortObj
}

/**
 * is query equal
 *
 * @export
 * @param {object} q1 query
 * @param {object} q2 another query
 * @return {bool} is equal
 */
export function isQueryEqual(q1, q2) {
  return toQuerystring(q1) === toQuerystring(q2)
}

/**
 * handle history for loadData
 *
 * @export
 * @param {object} history history in container props
 * @param {object} mergedQuery merged query for loadData
 * @param {object} location location in container props
 * @param {bool} isFirstLoad if first loadData in componentWillMount or componentDidMount
 */
export function handleHistoryForLoadData(history, mergedQuery, location, isFirstLoad) {
  const { query, pathname } = location
  if (isQueryEqual(mergedQuery, query)) {
    return
  }
  const path = `${pathname}?${toQuerystring(mergedQuery)}`
  if (isFirstLoad) {
    history.replace(path)
    return
  }
  history.push(path)
}
