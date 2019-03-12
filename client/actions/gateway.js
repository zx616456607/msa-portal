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

const fetchGatewayPagePoliciesList = (clusterID, query, options) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/policy`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    options,
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

export function gatewayPagePoliciesList(clusterID, query, options) {
  return dispatch => {
    return dispatch(fetchGatewayPagePoliciesList(clusterID, query, options))
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

const fetchGatewayRoutes = (clusterID, query, options) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    options,
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

export function getGatewayRoutes(clusterID, query, options) {
  return dispatch => {
    return dispatch(fetchGatewayRoutes(clusterID, query, options))
  }
}

export const ADD_GATEWAY_ROUTE_REQUEST = 'ADD_GATEWAY_ROUTE_REQUEST'
export const ADD_GATEWAY_ROUTE_SUCCESS = 'ADD_GATEWAY_ROUTE_SUCCESS'
export const ADD_GATEWAY_ROUTE_FAILURE = 'ADD_GATEWAY_ROUTE_FAILURE'

const fetchAddGatewayRoute = (clusterID, body, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route`
  return {
    options,
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

export function addGatewayRoute(clusterID, body, options) {
  return dispatch => {
    return dispatch(fetchAddGatewayRoute(clusterID, body, options))
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

const fetchUpdateGatewayRoute = (clusterID, routeID, body, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/gateway/route/${routeID}`
  return {
    options,
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

export function updateGatewayRoute(clusterID, routeID, body, options) {
  return dispatch => {
    return dispatch(fetchUpdateGatewayRoute(clusterID, routeID, body, options))
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

export const CHECK_ROUTE_PATH_EXISTENCE_REQUEST = 'CHECK_ROUTE_PATH_EXISTENCE_REQUEST'
export const CHECK_ROUTE_PATH_EXISTENCE_SUCCESS = 'CHECK_ROUTE_PATH_EXISTENCE_SUCCESS'
export const CHECK_ROUTE_PATH_EXISTENCE_FAILURE = 'CHECK_ROUTE_PATH_EXISTENCE_FAILURE'

const fetchRoutePathExitence = (clusterID, routePath) => {
  return {
    [CALL_API]: {
      types: [
        CHECK_ROUTE_PATH_EXISTENCE_REQUEST,
        CHECK_ROUTE_PATH_EXISTENCE_SUCCESS,
        CHECK_ROUTE_PATH_EXISTENCE_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/route/has/path?routePath=${routePath}`,
      schema: {},
    },
  }
}

export const checkRoutePath = (clusterID, routePath) =>
  dispatch => dispatch(fetchRoutePathExitence(clusterID, routePath))

export const GET_GLOBAL_RULE_SETTING_REQUEST = 'GET_GLOBAL_RULE_SETTING_REQUEST'
export const GET_GLOBAL_RULE_SETTING_SUCCESS = 'GET_GLOBAL_RULE_SETTING_SUCCESS'
export const GET_GLOBAL_RULE_SETTING_FAILURE = 'GET_GLOBAL_RULE_SETTING_FAILURE'

const fetchGlobalRuleSetting = clusterID => {
  return {
    [CALL_API]: {
      types: [
        GET_GLOBAL_RULE_SETTING_REQUEST,
        GET_GLOBAL_RULE_SETTING_SUCCESS,
        GET_GLOBAL_RULE_SETTING_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/route/global/sensitiveheaders`,
      schema: {},
    },
  }
}

export const getGlobalRuleSetting = clusterID =>
  dispatch => dispatch(fetchGlobalRuleSetting(clusterID))

export const UPDATE_GLOBAL_RULE_SETTING_REQUEST = 'UPDATE_GLOBAL_RULE_SETTING_REQUEST'
export const UPDATE_GLOBAL_RULE_SETTING_SUCCESS = 'UPDATE_GLOBAL_RULE_SETTING_SUCCESS'
export const UPDATE_GLOBAL_RULE_SETTING_FAILURE = 'UPDATE_GLOBAL_RULE_SETTING_FAILURE'

const fetchUpdateGlobalRuleSetting = (clusterID, body, options) => {
  return {
    options,
    [CALL_API]: {
      types: [
        UPDATE_GLOBAL_RULE_SETTING_REQUEST,
        UPDATE_GLOBAL_RULE_SETTING_SUCCESS,
        UPDATE_GLOBAL_RULE_SETTING_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/route/global/sensitiveheaders`,
      schema: {},
      options: {
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateGlobalRuleSetting = (clusterID, body, options) =>
  dispatch => dispatch(fetchUpdateGlobalRuleSetting(clusterID, body, options))

export const CREATE_GATEWAY_APIGROUP_REQUEST = 'CREATE_GATEWAY_APIGROUP_REQUEST'
export const CREATE_GATEWAY_APIGROUP_SUCCESS = 'CREATE_GATEWAY_APIGROUP_SUCCESS'
export const CREATE_GATEWAY_APIGROUP_FALIURE = 'CREATE_GATEWAY_APIGROUP_FALIURE'

function fetchCreateGatewayApiGroup(clusterID, body) {
  return {
    [CALL_API]: {
      types: [
        CREATE_GATEWAY_APIGROUP_REQUEST,
        CREATE_GATEWAY_APIGROUP_SUCCESS,
        CREATE_GATEWAY_APIGROUP_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export function createGatewayApiGroup(clusterID, body) {
  return dispatch => {
    return dispatch(fetchCreateGatewayApiGroup(clusterID, body))
  }
}

export const UPDATE_GATEWAY_APIGROUP_REQUEST = 'UPDATE_GATEWAY_APIGROUP_REQUEST'
export const UPDATE_GATEWAY_APIGROUP_SUCCESS = 'UPDATE_GATEWAY_APIGROUP_SUCCESS'
export const UPDATE_GATEWAY_APIGROUP_FALIURE = 'UPDATE_GATEWAY_APIGROUP_FALIURE'

function fetchUpdateGatewayApiGroup(clusterID, groupid, body) {
  return {
    [CALL_API]: {
      types: [
        UPDATE_GATEWAY_APIGROUP_REQUEST,
        UPDATE_GATEWAY_APIGROUP_SUCCESS,
        UPDATE_GATEWAY_APIGROUP_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${groupid}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export function updateGatewayApiGroup(clusterID, groupid, body) {
  return dispatch => {
    return dispatch(fetchUpdateGatewayApiGroup(clusterID, groupid, body))
  }
}

export const GET_GATEWAY_APIGROUP_LIST_REQUEST = 'GET_GATEWAY_APIGROUP_LIST_REQUEST'
export const GET_GATEWAY_APIGROUP_LIST_SUCCESS = 'GET_GATEWAY_APIGROUP_LIST_SUCCESS'
export const GET_GATEWAY_APIGROUP_LIST_FALIURE = 'GET_GATEWAY_APIGROUP_LIST_FALIURE'

function fetchGetGatewayApiGroupList(clusterID, query) {
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_APIGROUP_LIST_REQUEST,
        GET_GATEWAY_APIGROUP_LIST_SUCCESS,
        GET_GATEWAY_APIGROUP_LIST_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export function getGatewayApiGroupList(clusterID, query) {
  return dispatch => {
    return dispatch(fetchGetGatewayApiGroupList(clusterID, query))
  }
}

export const GET_GATEWAY_APIGROUP_REQUEST = 'GET_GATEWAY_APIGROUP_REQUEST'
export const GET_GATEWAY_APIGROUP_SUCCESS = 'GET_GATEWAY_APIGROUP_SUCCESS'
export const GET_GATEWAY_APIGROUP_FALIURE = 'GET_GATEWAY_APIGROUP_FALIURE'

function fetchGetGatewayApiGroup(clusterID, id) {
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_APIGROUP_REQUEST,
        GET_GATEWAY_APIGROUP_SUCCESS,
        GET_GATEWAY_APIGROUP_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${id}`,
      schema: {},
    },
  }
}
export function getGatewayApiGroup(clusterID, id) {
  return dispatch => {
    return dispatch(fetchGetGatewayApiGroup(clusterID, id))
  }
}

export const GET_GATEWAY_APIGROUP_TARGETS_REQUEST = 'GET_GATEWAY_APIGROUP_TARGETS_REQUEST'
export const GET_GATEWAY_APIGROUP_TARGETS_SUCCESS = 'GET_GATEWAY_APIGROUP_TARGETS_SUCCESS'
export const GET_GATEWAY_APIGROUP_TARGETS_FALIURE = 'GET_GATEWAY_APIGROUP_TARGETS_FALIURE'

function fetchGetGatewayApiGroupTargets(clusterID, id, query) {
  return {
    [CALL_API]: {
      types: [
        GET_GATEWAY_APIGROUP_TARGETS_REQUEST,
        GET_GATEWAY_APIGROUP_TARGETS_SUCCESS,
        GET_GATEWAY_APIGROUP_TARGETS_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${id}/targets?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export function getGatewayApiGroupTargets(clusterID, id, query) {
  return dispatch => {
    return dispatch(fetchGetGatewayApiGroupTargets(clusterID, id, query))
  }
}

export const DELETE_GATEWAY_APIGROUP_REQUEST = 'DELETE_GATEWAY_APIGROUP_REQUEST'
export const DELETE_GATEWAY_APIGROUP_SUCCESS = 'DELETE_GATEWAY_APIGROUP_SUCCESS'
export const DELETE_GATEWAY_APIGROUP_FALIURE = 'DELETE_GATEWAY_APIGROUP_FALIURE'

function fetchDelGatewayApiGroup(clusterID, id) {
  return {
    [CALL_API]: {
      types: [
        DELETE_GATEWAY_APIGROUP_REQUEST,
        DELETE_GATEWAY_APIGROUP_SUCCESS,
        DELETE_GATEWAY_APIGROUP_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${id}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export function delGatewayApiGroup(clusterID, id) {
  return dispatch => {
    return dispatch(fetchDelGatewayApiGroup(clusterID, id))
  }
}
export const REMOVE_GATEWAY_APIGROUP_TARGET_REQUEST = 'REMOVE_GATEWAY_APIGROUP_TARGET_REQUEST'
export const REMOVE_GATEWAY_APIGROUP_TARGET_SUCCESS = 'REMOVE_GATEWAY_APIGROUP_TARGET_SUCCESS'
export const REMOVE_GATEWAY_APIGROUP_TARGET_FALIURE = 'REMOVE_GATEWAY_APIGROUP_TARGET_FALIURE'

function fetchRemoveGatewayApiGroupTarget(clusterID, apiGroupId, targetId) {
  return {
    [CALL_API]: {
      types: [
        REMOVE_GATEWAY_APIGROUP_TARGET_REQUEST,
        REMOVE_GATEWAY_APIGROUP_TARGET_SUCCESS,
        REMOVE_GATEWAY_APIGROUP_TARGET_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${apiGroupId}/targets/${targetId}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export function removeGatewayApiGroupTarget(clusterID, apiGroupId, targetId) {
  return dispatch => {
    return dispatch(fetchRemoveGatewayApiGroupTarget(clusterID, apiGroupId, targetId))
  }
}

export const ADD_GATEWAY_APIGROUP_TARGET_REQUEST = 'ADD_GATEWAY_APIGROUP_TARGET_REQUEST'
export const ADD_GATEWAY_APIGROUP_TARGET_SUCCESS = 'ADD_GATEWAY_APIGROUP_TARGET_SUCCESS'
export const ADD_GATEWAY_APIGROUP_TARGET_FALIURE = 'ADD_GATEWAY_APIGROUP_TARGET_FALIURE'

function fetchAddGatewayApiGroupTarget(clusterID, apiGroupId, body) {
  return {
    [CALL_API]: {
      types: [
        ADD_GATEWAY_APIGROUP_TARGET_REQUEST,
        ADD_GATEWAY_APIGROUP_TARGET_SUCCESS,
        ADD_GATEWAY_APIGROUP_TARGET_FALIURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/gateway/apigroup/${apiGroupId}/targets`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export function addGatewayApiGroupTarget(clusterID, apiGroupId, body) {
  return dispatch => {
    return dispatch(fetchAddGatewayApiGroupTarget(clusterID, apiGroupId, body))
  }
}

