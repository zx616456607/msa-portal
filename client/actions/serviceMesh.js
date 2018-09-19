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

// Get all service
export const SERVICE_GET_ALL_LIST_REQUEST = 'SERVICE_GET_ALL_LIST_REQUEST'
export const SERVICE_GET_ALL_LIST_SUCCESS = 'SERVICE_GET_ALL_LIST_SUCCESS'
export const SERVICE_GET_ALL_LIST_FAILURE = 'SERVICE_GET_ALL_LIST_FAILURE'

function fetchAllServices(cluster, query, callback) {
  let { customizeOpts, headers } = query || {}
  if (headers === 'default') {
    headers = ''
  }
  delete query.customizeOpts
  delete query.headers
  return {
    customizeOpts,
    [CALL_API]: {
      types: [ SERVICE_GET_ALL_LIST_REQUEST, SERVICE_GET_ALL_LIST_SUCCESS,
        SERVICE_GET_ALL_LIST_FAILURE ],
      endpoint: `${PAAS_API_URL}/clusters/${cluster}/services?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project: headers },
      },
    },
    callback,
  }
}

export function loadAllServices(cluster, query, callback) {
  return dispath => {
    return dispath(fetchAllServices(cluster, query, callback))
  }
}

// 获取拓扑图信息
// TODO: 后台目前还处于摸索期, 这个url的参数目前只能写死
export const SERVICE_MESH_GRAPH_REQUEST = 'SERVICE_MESH_GRAPH_REQUEST'
export const SERVICE_MESH_GRAPH_SUCCESS = 'SERVICE_MESH_GRAPH_SUCCESS'
export const SERVICE_MESH_GRAPH_FAILURE = 'SERVICE_MESH_GRAPH_FAILURE'
function fetchServiceMeshGraph(cluster, headers, query, callback) {
  cluster = 'CID-88553dfba3c8'
  return {
    [CALL_API]: {
      types: [ SERVICE_MESH_GRAPH_REQUEST, SERVICE_MESH_GRAPH_SUCCESS, SERVICE_MESH_GRAPH_FAILURE ],
      endpoint: `http://192.168.1.225:38574/api/v3/servicemesh/clusters/${cluster}/telemetry/servicegraph?service=productpage`,
      // ${toQuerystring(query)}`,
      schema: {},
      options: {
        // headers,
      },
    },
    callback,
  }
}

export function loadServiceMeshGraph(cluster, headers, query, callback) {
  return dispatch => {
    return dispatch(fetchServiceMeshGraph(cluster, headers, query, callback))
  }
}
