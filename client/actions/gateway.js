/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Gateway
 *
 * 2017-11-09
 * @author zhangcz
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'

const { MSA_API_URL } = API_CONFIG

export const GET_GATEWAY_POLICIES_LIST_REQUEST = 'GET_GATEWAY_POLICIES_LIST_REQUEST'
export const GET_GATEWAY_POLICIES_LIST_SUCCESS = 'GET_GATEWAY_POLICIES_LIST_SUCCESS'
export const GET_GATEWAY_POLICIES_LIST_FAILURE = 'GET_GATEWAY_POLICIES_LIST_FAILURE'

const fetchGatewayPagePoliciesList = (clusterID, query) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/policy`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_POLICIES_LIST_REQUEST,
        GET_GATEWAY_POLICIES_LIST_SUCCESS,
        GET_GATEWAY_POLICIES_LIST_FAILURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.GATEWAY_POLICIES_LIST_DATA,
    },
  }
}

export function gatewayPagePoliciesList(clusterID, query) {
  return dispatch => {
    return dispatch(fetchGatewayPagePoliciesList(clusterID, query))
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

export const EDIT_GATEWAY_POLICY_REQUEST = 'EDIT_GATEWAY_POLICY_REQUEST'
export const EDIT_GATEWAY_POLICY_SUCCESS = 'EDIT_GATEWAY_POLICY_SUCCESS'
export const EDIT_GATEWAY_POLICY_FALIURE = 'EDIT_GATEWAY_POLICY_FALIURE'

function fetchEditGatewayPolicy(clusterID, policyID, body) {
  return {
    [CALL_API]: {
      types: [
        EDIT_GATEWAY_POLICY_REQUEST,
        EDIT_GATEWAY_POLICY_SUCCESS,
        EDIT_GATEWAY_POLICY_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/policy/${policyID}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export function editGatewayPolicy(clusterID, policyID, body) {
  return dispatch => {
    return dispatch(fetchEditGatewayPolicy(clusterID, policyID, body))
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
        method: 'DELETE',
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
