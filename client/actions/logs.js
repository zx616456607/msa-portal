/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa logs
 *
 * 2018-07-30
 * @author zhaoyb
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
const { PAAS_SPI_URL } = API_CONFIG

export const GET_CLUSTER_OF_TEAM_FOR_LOG_REQUEST = 'GET_CLUSTER_OF_TEAM_FOR_LOG_REQUEST'
export const GET_CLUSTER_OF_TEAM_FOR_LOG_SUCCESS = 'GET_CLUSTER_OF_TEAM_FOR_LOG_SUCCESS'
export const GET_CLUSTER_OF_TEAM_FOR_LOG_FAILURE = 'GET_CLUSTER_OF_TEAM_FOR_LOG_FAILURE'

function fetchClusterOfQueryLog(projecName) {
  let endpoint
  if (projecName === 'default') {
    endpoint = `${PAAS_SPI_URL}/clusters/default`
  } else {
    endpoint = `/projects/${projecName}/clusters`
  }
  return {
    [CALL_API]: {
      types: [
        GET_CLUSTER_OF_TEAM_FOR_LOG_REQUEST,
        GET_CLUSTER_OF_TEAM_FOR_LOG_SUCCESS,
        GET_CLUSTER_OF_TEAM_FOR_LOG_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export function getClusterOfQueryLog(projecName) {
  return dispatch => {
    return dispatch(fetchClusterOfQueryLog(projecName))
  }
}

export const GET_SERVICE_OF_TEAM_FOR_LOG_REQUEST = 'GET_SERVICE_OF_TEAM_FOR_LOG_REQUEST'
export const GET_SERVICE_OF_TEAM_FOR_LOG_SUCCESS = 'GET_SERVICE_OF_TEAM_FOR_LOG_SUCCESS'
export const GET_SERVICE_OF_TEAM_FOR_LOG_FAILURE = 'GET_SERVICE_OF_TEAM_FOR_LOG_FAILURE'

function fetchServiceOfQueryLog(clusterId, namespace) {
  return {
    [CALL_API]: {
      types: [
        GET_SERVICE_OF_TEAM_FOR_LOG_REQUEST,
        GET_SERVICE_OF_TEAM_FOR_LOG_SUCCESS,
        GET_SERVICE_OF_TEAM_FOR_LOG_FAILURE,
      ],
      endpoint: `/clusters/${clusterId}/apps/${namespace}/apps`,
      schema: {},
    },
  }
}

export function getServiceOfQueryLog(clusterId, namespace) {
  return dispatch => {
    return dispatch(fetchServiceOfQueryLog(clusterId, namespace))
  }
}

export const SERVICE_CONTAINERS_LIST_REQUEST = 'SERVICE_CONTAINERS_LIST_REQUEST'
export const SERVICE_CONTAINERS_LIST_SUCCESS = 'SERVICE_CONTAINERS_LIST_SUCCESS'
export const SERVICE_CONTAINERS_LIST_FAILURE = 'SERVICE_CONTAINERS_LIST_FAILURE'

// Fetches container list from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchServiceContainerList(cluster, serviceName) {
  let endpoint
  if (serviceName === 'all') {
    endpoint = `clusters/${cluster}/instances/wanglei/instances`
  } else {
    endpoint = `/clusters/${cluster}/instances/services/${serviceName}/instances`
  }
  return {
    cluster,
    serviceName,
    [CALL_API]: {
      types: [
        SERVICE_CONTAINERS_LIST_REQUEST,
        SERVICE_CONTAINERS_LIST_SUCCESS,
        SERVICE_CONTAINERS_LIST_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

// Fetches containers list from API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadServiceContainerList(cluster, serviceName) {
  return dispatch => {
    return dispatch(fetchServiceContainerList(cluster, serviceName))
  }
}

export const GET_SERVICE_QUERY_LOG_REQUEST = 'GET_SERVICE_QUERY_LOG_REQUEST'
export const GET_SERVICE_QUERY_LOG_SUCCESS = 'GET_SERVICE_QUERY_LOG_SUCCESS'
export const GET_SERVICE_QUERY_LOG_FAILURE = 'GET_SERVICE_QUERY_LOG_FAILURE'

function fetchQueryLogList(cluster, query, state, body) {
  let endpoint
  if (state) {
    endpoint = `/clusters/${cluster}/logs/instances/${query}/logs`
  } else {
    endpoint = `/clusters/${cluster}/logs/services/${query}/logs`
  }
  return {
    [CALL_API]: {
      types: [
        GET_SERVICE_QUERY_LOG_REQUEST,
        GET_SERVICE_QUERY_LOG_SUCCESS,
        GET_SERVICE_QUERY_LOG_FAILURE,
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

export function getQueryLogList(cluster, query, state, body) {
  return dispatch => {
    return dispatch(fetchQueryLogList(cluster, query, state, body))
  }
}
