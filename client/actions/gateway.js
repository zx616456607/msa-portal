/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Gateway
 *
 * 2017-11-0
 * @author zhangcz
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { Schemas } from '../middleware/schemas'

const { MSA_API_URL } = API_CONFIG

export const GATEWAY_LIST_REQUEST = 'GATEWAY_LIST_REQUEST'
export const GATEWAY_LIST_SUCCESS = 'GATEWAY_LIST_SUCCESS'
export const GATEWAY_LIST_FAILURE = 'GATEWAY_LIST_FAILURE'

const fetchGatewayList = clusterID => {
  return {
    [CALL_API]: {
      types: [ GATEWAY_LIST_REQUEST, GATEWAY_LIST_SUCCESS, GATEWAY_LIST_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/policy/all`,
      options: {
        method: 'GET',
      },
      schema: Schemas.GATEWAY_LIST_DATA,
    },
  }
}

export function gatewayList(clusterID) {
  return dispatch => {
    return dispatch(fetchGatewayList(clusterID))
  }
}

export const CREATE_GATEWAY_POLICY_REQUEST = 'CREATE_GATEWAY_POLICY_REQUEST'
export const CREATE_GATEWAY_POLICY_SUCCESS = 'CREATE_GATEWAY_POLICY_SUCCESS'
export const CREATE_GATEWAY_POLICY_FALIURE = 'CREATE_GATEWAY_POLICY_FALIURE'

function fetchCreateGatewayPolicy(clusterID, body) {
  return {
    [CALL_API]: {
      types: [
        CREATE_GATEWAY_POLICY_REQUEST,
        CREATE_GATEWAY_POLICY_SUCCESS,
        CREATE_GATEWAY_POLICY_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/policy`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export function createGatewayPolicy(clusterID, body) {
  return dispatch => {
    return dispatch(fetchCreateGatewayPolicy(clusterID, body))
  }
}

export const DELETE_GATEWAY_POLICY_REQUEST = 'DELETE_GATEWAY_POLICY_REQUEST'
export const DELETE_GATEWAY_POLICY_SUCCESS = 'DELETE_GATEWAY_POLICY_SUCCESS'
export const DELETE_GATEWAY_POLICY_FALIURE = 'DELETE_GATEWAY_POLICY_FALIURE'

function fetchDeleteGatewatPolicy(clusterID, policyID) {
  return {
    [CALL_API]: {
      types: [
        DELETE_GATEWAY_POLICY_REQUEST,
        DELETE_GATEWAY_POLICY_SUCCESS,
        DELETE_GATEWAY_POLICY_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/policy/${policyID}`,
      options: {
        method: 'POST',
      },
      schema: {},
    },
  }
}

export function deleteGatewayPolicy(clusterID, policyID) {
  return dispatch => {
    return dispatch(fetchDeleteGatewatPolicy(clusterID, policyID))
  }
}
