/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceMesh.js page
 *
 * @author zhangtao
 * @date Friday July 27th 2018
 */
import { toQuerystring } from '../common/utils'
import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { Schemas } from '../middleware/schemas'

const { PAAS_API_URL } = API_CONFIG

export const APP_LIST_REQUEST = 'APP_LIST_REQUEST'
export const APP_LIST_SUCCESS = 'APP_LIST_SUCCESS'
export const APP_LIST_FAILURE = 'APP_LIST_FAILURE'
// Fetches app list from API.
// Relies on the custom API middleware defined in ../middleware/api.js.

function fetchAppList(cluster, query, pathname, callback) {
  // Front-end customization requirements
  let { customizeOpts, headers } = query || {}
  if (headers === 'default') {
    headers = ''
  }
  // const newQuery = Object.assign({}, query)
  let endpoint = `${PAAS_API_URL}/clusters/${cluster}/apps`
  if (query) {
    delete query.customizeOpts
    delete query.headers
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    cluster,
    customizeOpts,
    [CALL_API]: {
      types: [ APP_LIST_REQUEST, APP_LIST_SUCCESS, APP_LIST_FAILURE ],
      endpoint,
      schema: Schemas.APPS,
      options: {
        headers: {
          project: headers },
      },
    },
    callback,
  }
}

// Fetches apps list from API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadAppList(cluster, query, pathname, callback) {
  return dispatch => {
    return dispatch(fetchAppList(cluster, query, pathname, callback))
  }
}
