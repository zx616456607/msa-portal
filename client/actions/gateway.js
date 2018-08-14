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

export const GET_GATEWAY_HAS_OPEN_POLICY_REQUEST = 'GET_GATEWAY_HAS_OPEN_POLICY_REQUEST'
export const GET_GATEWAY_HAS_OPEN_POLICY_SUCCESS = 'GET_GATEWAY_HAS_OPEN_POLICY_SUCCESS'
export const GET_GATEWAY_HAS_OPEN_POLICY_FAILURE = 'GET_GATEWAY_HAS_OPEN_POLICY_FAILURE'

const fetchGatewayHasOpenPolicy = (clusterID, query) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/policy`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_HAS_OPEN_POLICY_REQUEST,
        GET_GATEWAY_HAS_OPEN_POLICY_SUCCESS,
        GET_GATEWAY_HAS_OPEN_POLICY_FAILURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.GATEWAY_HAS_OPEN_POLICY_DATA,
      // schema: {},
    },
  }
}

export function gatewayHasOpenPolicy(clusterID, query) {
  return dispatch => {
    return dispatch(fetchGatewayHasOpenPolicy(clusterID, query))
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

export const GET_GATEWAY_ROUTES_LIST_REQUEST = 'GET_GATEWAY_ROUTES_LIST_REQUEST'
export const GET_GATEWAY_ROUTES_LIST_SUCCESS = 'GET_GATEWAY_ROUTES_LIST_SUCCESS'
export const GET_GATEWAY_ROUTES_LIST_FAILURE = 'GET_GATEWAY_ROUTES_LIST_FAILURE'

const fetchGatewayRoutes = (clusterID, query) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_ROUTES_LIST_REQUEST,
        GET_GATEWAY_ROUTES_LIST_SUCCESS,
        GET_GATEWAY_ROUTES_LIST_FAILURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.GATEWAY_ROUTES_LIST_DATA,
    },
  }
}

export function getGatewayRoutes(clusterID, query) {
  return dispatch => {
    return dispatch(fetchGatewayRoutes(clusterID, query))
  }
}

export const ADD_GATEWAY_ROUTE_REQUEST = 'ADD_GATEWAY_ROUTE_REQUEST'
export const ADD_GATEWAY_ROUTE_SUCCESS = 'ADD_GATEWAY_ROUTE_SUCCESS'
export const ADD_GATEWAY_ROUTE_FAILURE = 'ADD_GATEWAY_ROUTE_FAILURE'

const fetchAddGatewayRoute = (clusterID, body) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route`
  return {
    [CALL_API]: {
      types: [
        ADD_GATEWAY_ROUTE_REQUEST,
        ADD_GATEWAY_ROUTE_SUCCESS,
        ADD_GATEWAY_ROUTE_FAILURE,
      ],
      endpoint,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export function addGatewayRoute(clusterID, body) {
  return dispatch => {
    return dispatch(fetchAddGatewayRoute(clusterID, body))
  }
}

export const DELETE_GATEWAY_ROUTE_REQUEST = 'DELETE_GATEWAY_ROUTE_REQUEST'
export const DELETE_GATEWAY_ROUTE_SUCCESS = 'DELETE_GATEWAY_ROUTE_SUCCESS'
export const DELETE_GATEWAY_ROUTE_FAILURE = 'DELETE_GATEWAY_ROUTE_FAILURE'

const fetchDeleteGatewayRoute = (clusterID, routeID) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route/${routeID}`
  return {
    [CALL_API]: {
      types: [
        DELETE_GATEWAY_ROUTE_REQUEST,
        DELETE_GATEWAY_ROUTE_SUCCESS,
        DELETE_GATEWAY_ROUTE_FAILURE,
      ],
      endpoint,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export function delGatewayRoute(clusterID, routeID) {
  return dispatch => {
    return dispatch(fetchDeleteGatewayRoute(clusterID, routeID))
  }
}

export const UPDATE_GATEWAY_ROUTE_REQUEST = 'UPDATE_GATEWAY_ROUTE_REQUEST'
export const UPDATE_GATEWAY_ROUTE_SUCCESS = 'UPDATE_GATEWAY_ROUTE_SUCCESS'
export const UPDATE_GATEWAY_ROUTE_FAILURE = 'UPDATE_GATEWAY_ROUTE_FAILURE'

const fetchUpdateGatewayRoute = (clusterID, routeID, body) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route/${routeID}`
  return {
    [CALL_API]: {
      types: [
        UPDATE_GATEWAY_ROUTE_REQUEST,
        UPDATE_GATEWAY_ROUTE_SUCCESS,
        UPDATE_GATEWAY_ROUTE_FAILURE,
      ],
      endpoint,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export function updateGatewayRoute(clusterID, routeID, body) {
  return dispatch => {
    return dispatch(fetchUpdateGatewayRoute(clusterID, routeID, body))
  }
}

export const CHECK_ROUTE_NAME_EXISTENCE_REQUEST = 'CHECK_ROUTE_NAME_EXISTENCE_REQUEST'
export const CHECK_ROUTE_NAME_EXISTENCE_SUCCESS = 'CHECK_ROUTE_NAME_EXISTENCE_SUCCESS'
export const CHECK_ROUTE_NAME_EXISTENCE_FAILURE = 'CHECK_ROUTE_NAME_EXISTENCE_FAILURE'

const fetchRouteNameExitence = (clusterID, name) => {
  return {
    [CALL_API]: {
      types: [
        CHECK_ROUTE_NAME_EXISTENCE_REQUEST,
        CHECK_ROUTE_NAME_EXISTENCE_SUCCESS,
        CHECK_ROUTE_NAME_EXISTENCE_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/route/has/${name}`,
      schema: {},
    },
  }
}

export const checkRouteName = (clusterID, name) =>
  dispatch => dispatch(fetchRouteNameExitence(clusterID, name))
