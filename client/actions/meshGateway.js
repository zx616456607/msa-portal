/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * meshGateway
 *
 * 2018-09-19
 * @author songsz
 */
import { API_CONFIG } from '../constants'
import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'

const { SERVICEMESH_API_URL } = API_CONFIG

// 列取meshIngressGateway
export const MESH_I_GATEWAY_REQUEST = 'MESH_I_GATEWAY_REQUEST'
export const MESH_I_GATEWAY_SUCCESS = 'MESH_I_GATEWAY_SUCCESS'
export const MESH_I_GATEWAY_FAILURE = 'MESH_I_GATEWAY_FAILURE'

function fetchMeshIngressGateway(clusterId) {
  return {
    [CALL_API]: {
      types: [
        MESH_I_GATEWAY_REQUEST,
        MESH_I_GATEWAY_SUCCESS,
        MESH_I_GATEWAY_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/ingressgateway`,
      schema: Schemas.MESH_INGRESS_GATEWAY_LIST_DATA,
      options: {
        method: 'GET',
      },
    },
  }
}

export function getMeshIngressGateway(clusterId) {
  return dispatch => {
    return dispatch(fetchMeshIngressGateway(clusterId))
  }
}

// 列取 meshGateway
export const MESH_GATEWAY_REQUEST = 'MESH_GATEWAY_REQUEST'
export const MESH_GATEWAY_SUCCESS = 'MESH_GATEWAY_SUCCESS'
export const MESH_GATEWAY_FAILURE = 'MESH_GATEWAY_FAILURE'

function fetchMeshGateway(clusterId) {
  return {
    [CALL_API]: {
      types: [
        MESH_GATEWAY_REQUEST,
        MESH_GATEWAY_SUCCESS,
        MESH_GATEWAY_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/networking/gateway`,
      schema: Schemas.MESH_GATEWAY_LIST_DATA,
      options: {
        method: 'GET',
      },
    },
  }
}

export function getMeshGateway(clusterId) {
  return dispatch => {
    return dispatch(fetchMeshGateway(clusterId))
  }
}

// 创建 meshGateway
export const CREATE_MESH_GATEWAY_REQUEST = 'CREATE_MESH_GATEWAY_REQUEST'
export const CREATE_MESH_GATEWAY_SUCCESS = 'CREATE_MESH_GATEWAY_SUCCESS'
export const CREATE_MESH_GATEWAY_FAILURE = 'CREATE_MESH_GATEWAY_FAILURE'

function createMeshGateway(clusterId, body) {
  return {
    [CALL_API]: {
      types: [
        CREATE_MESH_GATEWAY_REQUEST,
        CREATE_MESH_GATEWAY_SUCCESS,
        CREATE_MESH_GATEWAY_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/networking/gateway`,
      schema: {},
      options: {
        method: 'POST',
        body,
      },
    },
  }
}

export function postMeshGateway(clusterId, body) {
  return dispatch => {
    return dispatch(createMeshGateway(clusterId, body))
  }
}

// 更新 meshGateway
export const UPDATE_MESH_GATEWAY_REQUEST = 'UPDATE_MESH_GATEWAY_REQUEST'
export const UPDATE_MESH_GATEWAY_SUCCESS = 'UPDATE_MESH_GATEWAY_SUCCESS'
export const UPDATE_MESH_GATEWAY_FAILURE = 'UPDATE_MESH_GATEWAY_FAILURE'

function fetchPutMeshGateway(clusterId, body) {
  return {
    [CALL_API]: {
      types: [
        UPDATE_MESH_GATEWAY_REQUEST,
        UPDATE_MESH_GATEWAY_SUCCESS,
        UPDATE_MESH_GATEWAY_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/networking/gateway`,
      schema: {},
      options: {
        method: 'PUT',
        body,
      },
    },
  }
}

export function putMeshGateway(clusterId, body) {
  return dispatch => {
    return dispatch(fetchPutMeshGateway(clusterId, body))
  }
}

// 删除 meshGateway
export const DELETE_MESH_GATEWAY_REQUEST = 'DELETE_MESH_GATEWAY_REQUEST'
export const DELETE_MESH_GATEWAY_SUCCESS = 'DELETE_MESH_GATEWAY_SUCCESS'
export const DELETE_MESH_GATEWAY_FAILURE = 'DELETE_MESH_GATEWAY_FAILURE'

function fetchDeleteMeshGateway(clusterId, name) {
  return {
    [CALL_API]: {
      types: [
        DELETE_MESH_GATEWAY_REQUEST,
        DELETE_MESH_GATEWAY_SUCCESS,
        DELETE_MESH_GATEWAY_FAILURE,
      ],
      endpoint: `${SERVICEMESH_API_URL}/servicemesh/clusters/${clusterId}/networking/gateway/${name}`,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export function deleteMeshGateway(clusterId, name) {
  return dispatch => {
    return dispatch(fetchDeleteMeshGateway(clusterId, name))
  }
}
