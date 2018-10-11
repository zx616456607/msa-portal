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

const { PAAS_API_URL, SERVICEMESH_API_URL } = API_CONFIG

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
          project: headers,
        },
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
          project: headers,
        },
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
export const SERVICE_MESH_GRAPH_REQUEST = 'SERVICE_MESH_GRAPH_REQUEST'
export const SERVICE_MESH_GRAPH_SUCCESS = 'SERVICE_MESH_GRAPH_SUCCESS'
export const SERVICE_MESH_GRAPH_FAILURE = 'SERVICE_MESH_GRAPH_FAILURE'
function fetchServiceMeshGraph(cluster, headers, query, callback) {
  return {
    [CALL_API]: {
      types: [ SERVICE_MESH_GRAPH_REQUEST, SERVICE_MESH_GRAPH_SUCCESS, SERVICE_MESH_GRAPH_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${cluster}/telemetry/servicegraph?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project: headers,
        },
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

// Get Component

export const COMPONENT_LIST_REQUEST = 'COMPONENT_LIST_REQUEST'
export const COMPONENT_LIST_SUCCESS = 'COMPONENT_LIST_SUCCESS'
export const COMPONENT_LIST_FAILURE = 'COMPONENT_LIST_FAILURE'

// Fetches component list from API.
const fetchComponentList = clusterID => {
  return {
    [CALL_API]: {
      types: [ COMPONENT_LIST_REQUEST, COMPONENT_LIST_SUCCESS, COMPONENT_LIST_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const loadComponent = clusterID => dispatch => {
  return dispatch(fetchComponentList(clusterID))
}

export const COMPONENT_ADD_REQUEST = 'COMPONENT_ADD_REQUEST'
export const COMPONENT_ADD_SUCCESS = 'COMPONENT_ADD_SUCCESS'
export const COMPONENT_ADD_FAILURE = 'COMPONENT_ADD_FAILURE'

const PostComponent = (clusterID, body) => {
  return {
    body,
    [CALL_API]: {
      types: [ COMPONENT_ADD_REQUEST, COMPONENT_ADD_SUCCESS, COMPONENT_ADD_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule`,
      schema: {},
      options: {
        body,
        method: 'POST',
      },
    },
  }
}

export const AddComponent = (clusterID, body) => dispatch => {
  return dispatch(PostComponent(clusterID, body))
}

export const COMPONENT_COMPONENT_REQUEST = 'COMPONENT_COMPONENT_REQUEST'
export const COMPONENT_COMPONENT_SUCCESS = 'COMPONENT_COMPONENT_SUCCESS'
export const COMPONENT_COMPONENT_FAILURE = 'COMPONENT_COMPONENT_FAILURE'

const fetchComponent = (clusterID, name) => {
  return {
    [CALL_API]: {
      types: [
        COMPONENT_COMPONENT_REQUEST,
        COMPONENT_COMPONENT_SUCCESS,
        COMPONENT_COMPONENT_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule/${name}`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getComponent = (clusterID, name) => dispatch => {
  return dispatch(fetchComponent(clusterID, name))
}

export const COMPONENT_DETAIL_REQUEST = 'COMPONENT_DETAIL_REQUEST'
export const COMPONENT_DETAIL_SUCCESS = 'COMPONENT_DETAIL_SUCCESS'
export const COMPONENT_DETAIL_FAILURE = 'COMPONENT_DETAIL_FAILURE'

const fetchComponentDetail = (clusterID, name) => {
  return {
    [CALL_API]: {
      types: [
        COMPONENT_DETAIL_REQUEST,
        COMPONENT_DETAIL_SUCCESS,
        COMPONENT_DETAIL_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking
        /destinationrule/${name}`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const componentDetail = (clusterID, name) => dispatch => {
  return dispatch(fetchComponentDetail(clusterID, name))
}

export const COMPONENT_DEL_REQUEST = 'COMPONENT_DEL_REQUEST'
export const COMPONENT_DEL_SUCCESS = 'COMPONENT_DEL_SUCCESS'
export const COMPONENT_DEL_FAILURE = 'COMPONENT_DEL_FAILURE'

const fetchDelComponent = (clusterID, name) => {
  return {
    [CALL_API]: {
      types: [
        COMPONENT_DEL_REQUEST,
        COMPONENT_DEL_SUCCESS,
        COMPONENT_DEL_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking
        /destinationrule/${name}`,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export const deleteComponent = (clusterID, name) => dispatch => {
  return dispatch(fetchDelComponent(clusterID, name))
}

export const COMPONENT_EDIT_REQUEST = 'COMPONENT_EDIT_REQUEST'
export const COMPONENT_EDIT_SUCCESS = 'COMPONENT_EDIT_SUCCESS'
export const COMPONENT_EDIT_FAILURE = 'COMPONENT_EDIT_FAILURE'

const fetchEditComponent = clusterID => {
  return {
    [CALL_API]: {
      types: [
        COMPONENT_EDIT_REQUEST,
        COMPONENT_EDIT_SUCCESS,
        COMPONENT_EDIT_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule`,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}

export const editComponent = clusterID => dispatch => {
  return dispatch(fetchEditComponent(clusterID))
}

// 项目集群列表
export const PROJECT_CLUSTER_LIST_REQUEST = 'PROJECT_CLUSTER_LIST_REQUEST'
export const PROJECT_CLUSTER_LIST_SUCCESS = 'PROJECT_CLUSTER_LIST_SUCCESS'
export const PROJECT_CLUSTER_LIST_FAILURE = 'PROJECT_CLUSTER_LIST_FAILURE'
function getProjectClusterList(callback) {
  return {
    [CALL_API]: {
      types: [ PROJECT_CLUSTER_LIST_REQUEST,
        PROJECT_CLUSTER_LIST_SUCCESS,
        PROJECT_CLUSTER_LIST_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/paas`,
      schema: {},
      options: {
      },
    },
    callback,
  }
}

export function loadProjectClusterList(callback) {
  return dispatch => {
    return dispatch(getProjectClusterList(callback))
  }
}
