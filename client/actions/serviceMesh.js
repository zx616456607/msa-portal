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
const fetchComponentList = (clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = project
  }
  return {
    [CALL_API]: {
      types: [ COMPONENT_LIST_REQUEST, COMPONENT_LIST_SUCCESS, COMPONENT_LIST_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule`,
      schema: {},
      options: {
        method: 'GET',
        headers: {
          project: headers,
        },
      },
    },
  }
}

export const loadComponent = (clusterID, project) => dispatch => {
  return dispatch(fetchComponentList(clusterID, project))
}

export const COMPONENT_ADD_REQUEST = 'COMPONENT_ADD_REQUEST'
export const COMPONENT_ADD_SUCCESS = 'COMPONENT_ADD_SUCCESS'
export const COMPONENT_ADD_FAILURE = 'COMPONENT_ADD_FAILURE'

const PostComponent = (clusterID, body, project) => {
  let headers
  if (project && project !== 'default') {
    headers = project
  }
  return {
    body,
    [CALL_API]: {
      types: [ COMPONENT_ADD_REQUEST, COMPONENT_ADD_SUCCESS, COMPONENT_ADD_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule`,
      schema: {},
      options: {
        body,
        method: 'POST',
        headers: {
          project: headers,
        },
      },
    },
  }
}

export const AddComponent = (clusterID, body, project) => dispatch => {
  return dispatch(PostComponent(clusterID, body, project))
}

export const COMPONENT_DETAIL_REQUEST = 'COMPONENT_DETAIL_REQUEST'
export const COMPONENT_DETAIL_SUCCESS = 'COMPONENT_DETAIL_SUCCESS'
export const COMPONENT_DETAIL_FAILURE = 'COMPONENT_DETAIL_FAILURE'

const getComponent = (clusterID, query) => {
  const { name, project } = query
  let headers
  if (project && project !== 'default') {
    headers = project
  }
  return {
    [CALL_API]: {
      types: [
        COMPONENT_DETAIL_REQUEST,
        COMPONENT_DETAIL_SUCCESS,
        COMPONENT_DETAIL_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule/${name}`,
      schema: {},
      options: {
        method: 'GET',
        headers: {
          project: headers,
        },
      },
    },
  }
}

export const fetchComponent = (clusterID, query) => dispatch => {
  return dispatch(getComponent(clusterID, query))
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
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/destinationrule/${name}`,
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

const fetchEditComponent = (clusterID, body, project) => {
  let headers
  if (project && project !== 'default') {
    headers = project
  }
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
        body,
        method: 'PUT',
        headers: {
          project: headers,
        },
      },
    },
  }
}

export const editComponent = (clusterID, body, project) => dispatch => {
  return dispatch(fetchEditComponent(clusterID, body, project))
}

export const SERVICES_LIST_REQUEST = 'SERVICES_LIST_REQUEST'
export const SERVICES_LIST_SUCCESS = 'SERVICES_LIST_SUCCESS'
export const SERVICES_LIST_FAILURE = 'SERVICES_LIST_FAILURE'

const fetchtServices = (clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = project
  }
  return {
    [CALL_API]: {
      types: [
        SERVICES_LIST_REQUEST,
        SERVICES_LIST_SUCCESS,
        SERVICES_LIST_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/paas/services`,
      schema: {},
      options: {
        method: 'GET',
        headers: {
          project: headers,
        },
      },
    },
  }
}
export const fetchServiceList = (clusterID, project) => dispatch => {
  return dispatch(fetchtServices(clusterID, project))
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

// 获取服务列表的istio状态
export const GET_SERVICE_LIST_SERVICE_MESH_REQUEST = 'GET_SERVICE_LIST_SERVICE_MESH_REQUEST'
export const GET_SERVICE_LIST_SERVICE_MESH_SUCCESS = 'GET_SERVICE_LIST_SERVICE_MESH_SUCCESS'
export const GET_SERVICE_LIST_SERVICE_MESH_FAILURE = 'GET_SERVICE_LIST_SERVICE_MESH_FAILURE'
function checkServiceListServiceMeshStatus(clusterId, serviceList, query = {}, callback) {
  const newQuery = toQuerystring({
    name: serviceList,
    ...query,
  })
  let endpoint = `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/paas/services`
  endpoint += `?${newQuery}`
  return {
    [CALL_API]: {
      types: [ GET_SERVICE_LIST_SERVICE_MESH_REQUEST, GET_SERVICE_LIST_SERVICE_MESH_SUCCESS,
        GET_SERVICE_LIST_SERVICE_MESH_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
    callback,
  }
}

export function getServiceListServiceMeshStatus(clusterId, serviceList, query, callback) {
  return dispatch => {
    return dispatch(checkServiceListServiceMeshStatus(clusterId, serviceList, query, callback))
  }
}
