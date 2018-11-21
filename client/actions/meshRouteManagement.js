/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * RouteManagement container
 *
 * 2018-10-12
 * @author zhouhaitao
 */

import { API_CONFIG } from '../constants'
import { CALL_API } from '../middleware/api'

const { SERVICEMESH_API_URL } = API_CONFIG

// 路由策略
export const MESH_ROUTE_LIST_REQUEST = 'MESH_ROUTE_LIST_REQUEST'
export const MESH_ROUTE_LIST_SUCCESS = 'MESH_ROUTE_LIST_SUCCESS'
export const MESH_ROUTE_LIST_FAILURE = 'MESH_ROUTE_LIST_FAILURE'
function getVirtualServiceList(query, callback) {
  return {
    [CALL_API]: {
      types: [ MESH_ROUTE_LIST_REQUEST,
        MESH_ROUTE_LIST_SUCCESS,
        MESH_ROUTE_LIST_FAILURE ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${query.clusterId}/networking/virtualservice`,
      schema: {},
      // schema: Schemas.MESH_GATEWAY_LIST_DATA,
    },
    callback,
  }
}

export function loadVirtualServiceList(query, callback) {
  return dispatch => {
    return dispatch(getVirtualServiceList(query, callback))
  }
}


export const NEW_MESH_ROUTE_REQUEST = 'NEW_MESH_ROUTE_REQUEST'
export const NEW_MESH_ROUTE_SUCCESS = 'NEW_MESH_ROUTE_SUCCESS'
export const NEW_MESH_ROUTE_FAILURE = 'NEW_MESH_ROUTE_FAILURE'

function postNewRoute(clusterID, body, callback) {
  const endpoint = `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/virtualservice`
  return {
    clusterID,
    [CALL_API]: {
      types: [ NEW_MESH_ROUTE_REQUEST, NEW_MESH_ROUTE_SUCCESS, NEW_MESH_ROUTE_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'POST',
        body,
      },
    },
    callback,
  }
}

export function createNewRoute(clusterID, body, callback) {
  return postNewRoute(clusterID, body, callback)
}

export const FETCH_MESH_ROUTE_DETAIL_REQUEST = 'FETCH_MESH_ROUTE_DETAIL_REQUEST'
export const FETCH_MESH_ROUTE_DETAIL_SUCCESS = 'FETCH_MESH_ROUTE_DETAIL_SUCCESS'
export const FETCH_MESH_ROUTE_DETAIL_FAILURE = 'FETCH_MESH_ROUTE_DETAIL_FAILURE'

function fetchMeshRouteDetail(clusterID, name, callback) {
  const endpoint = `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/virtualservice/${name}`
  return {
    clusterID,
    [CALL_API]: {
      types: [ FETCH_MESH_ROUTE_DETAIL_REQUEST,
        FETCH_MESH_ROUTE_DETAIL_SUCCESS,
        FETCH_MESH_ROUTE_DETAIL_FAILURE ],
      endpoint,
      schema: {},
    },
    callback,
  }
}

export function getMeshRouteDetail(clusterID, name, callback) {
  return fetchMeshRouteDetail(clusterID, name, callback)
}

export const UPDATE_MESH_ROUTE_REQUEST = 'UPDATE_MESH_ROUTE_REQUEST'
export const UPDATE_MESH_ROUTE_SUCCESS = 'UPDATE_MESH_ROUTE_SUCCESS'
export const UPDATE_MESH_ROUTE_FAILURE = 'UPDATE_MESH_ROUTE_FAILURE'

function putMeshRoute(clusterID, body, callback) {
  const endpoint = `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterID}/networking/virtualservice`
  return {
    clusterID,
    [CALL_API]: {
      types: [ UPDATE_MESH_ROUTE_REQUEST,
        UPDATE_MESH_ROUTE_SUCCESS,
        UPDATE_MESH_ROUTE_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'PUT',
        body,
      },
    },
    callback,
  }
}

export function updateMeshRoute(clusterID, body, callback) {
  return putMeshRoute(clusterID, body, callback)
}

export const MESH_ROUTE_DEL_REQUEST = 'MESH_ROUTE_DEL_REQUEST'
export const MESH_ROUTE_DEL_SUCCESS = 'MESH_ROUTE_DEL_SUCCESS'
export const MESH_ROUTE_DEL_FAILURE = 'MESH_ROUTE_DEL_FAILURE'

const fetchDelVirtualService = (clusterId, name) => {
  return {
    [CALL_API]: {
      types: [
        MESH_ROUTE_DEL_REQUEST,
        MESH_ROUTE_DEL_SUCCESS,
        MESH_ROUTE_DEL_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/networking/virtualservice/${name}`,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export const deleteVirtualService = (clusterId, name) => dispatch => {
  return dispatch(fetchDelVirtualService(clusterId, name))
}


export const VALIDATE_SERVICE_NAME_REQUEST = 'VALIDATE_SERVICE_NAME_REQUEST'
export const VALIDATE_SERVICE_NAME_SUCCESS = 'VALIDATE_SERVICE_NAME_SUCCESS'
export const VALIDATE_SERVICE_NAME_FAILURE = 'VALIDATE_SERVICE_NAME_FAILURE'

const alreadyExistServiceNameRequest = clusterId => {
  return {
    [CALL_API]: {
      types: [
        VALIDATE_SERVICE_NAME_REQUEST,
        VALIDATE_SERVICE_NAME_SUCCESS,
        VALIDATE_SERVICE_NAME_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/paas/discoverables`,
      schema: {},
    },
  }
}

export const getAllServiceName = clusterId => dispatch => {
  return dispatch(alreadyExistServiceNameRequest(clusterId))
}
