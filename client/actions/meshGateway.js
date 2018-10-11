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
