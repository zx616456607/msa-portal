/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa aciton
 *
 * 2017-11-02
 * @author zhangxuan
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { API_CONFIG, CONTENT_TYPE_TEXT } from '../constants'
import { toQuerystring } from '../common/utils'

const { MSA_API_URL, PAAS_API_URL } = API_CONFIG

export const MSA_LIST_REQUEST = 'MSA_LIST_REQUEST'
export const MSA_LIST_SUCCESS = 'MSA_LIST_SUCCESS'
export const MSA_LIST_FAILURE = 'MSA_LIST_FAILURE'

// Fetches a page of msa.
const fetchMsaList = (clusterID, query) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/discovery/services`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [ MSA_LIST_REQUEST, MSA_LIST_SUCCESS, MSA_LIST_FAILURE ],
      endpoint,
      schema: Schemas.MSALIST_ARRAY_DATA,
    },
  }
}

export function getMsaList(clusterID, query) {
  return dispatch => {
    return dispatch(fetchMsaList(clusterID, query))
  }
}

export const MSA_ADD_MANUALRULE_REQUEST = 'MSA_ADD_MANUALRULE_REQUEST'
export const MSA_ADD_MANUALRULE_SUCCESS = 'MSA_ADD_MANUALRULE_SUCCESS'
export const MSA_ADD_MANUALRULE_FAILURE = 'MSA_ADD_MANUALRULE_FAILURE'

const fetchAddManualrules = (clusterID, body) => ({
  [CALL_API]: {
    types: [ MSA_ADD_MANUALRULE_REQUEST, MSA_ADD_MANUALRULE_SUCCESS, MSA_ADD_MANUALRULE_FAILURE ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/admissions`,
    options: {
      method: 'POST',
      body,
    },
    schema: {},
  },
})

export function addManualrules(clusterID, body) {
  return dispatch => {
    return dispatch(fetchAddManualrules(clusterID, body))
  }
}

export const MSA_ADD_EXPULSIONS_MANUALRULES_REQUEST = 'MSA_ADD_EXPULSIONS_MANUALRULES_REQUEST'
export const MSA_ADD_EXPULSIONS_MANUALRULES_SUCCESS = 'MSA_ADD_EXPULSIONS_MANUALRULES_SUCCESS'
export const MSA_ADD_EXPULSIONS_MANUALRULES_FAILURE = 'MSA_ADD_EXPULSIONS_MANUALRULES_FAILURE'

const fetchAddExpulsionsManualrules = (clusterID, body) => ({
  [CALL_API]: {
    types: [
      MSA_ADD_EXPULSIONS_MANUALRULES_REQUEST,
      MSA_ADD_EXPULSIONS_MANUALRULES_SUCCESS,
      MSA_ADD_EXPULSIONS_MANUALRULES_FAILURE,
    ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/expulsions`,
    options: {
      method: 'POST',
      body,
    },
    schema: {},
  },
})

export function addExpulsionsManualrules(clusterID, body) {
  return dispatch => {
    return dispatch(fetchAddExpulsionsManualrules(clusterID, body))
  }
}

export const MSA_ADD_INSTANCES_INTO_MANUALRULES_REQUEST = 'MSA_ADD_INSTANCES_INTO_MANUALRULES_REQUEST'
export const MSA_ADD_INSTANCES_INTO_MANUALRULES_SUCCESS = 'MSA_ADD_INSTANCES_INTO_MANUALRULES_SUCCESS'
export const MSA_ADD_INSTANCES_INTO_MANUALRULES_FAILURE = 'MSA_ADD_INSTANCES_INTO_MANUALRULES_FAILURE'

const fetchAddInstancesIntoManualrules = (clusterID, body) => ({
  [CALL_API]: {
    types: [
      MSA_ADD_INSTANCES_INTO_MANUALRULES_REQUEST,
      MSA_ADD_INSTANCES_INTO_MANUALRULES_SUCCESS,
      MSA_ADD_INSTANCES_INTO_MANUALRULES_FAILURE,
    ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/admissions/instances`,
    options: {
      method: 'POST',
      body,
    },
    schema: {},
  },
})

export function addInstancesIntoManualrules(clusterID, body) {
  return dispatch => {
    return dispatch(fetchAddInstancesIntoManualrules(clusterID, body))
  }
}

export const MSA_DISCOVERY_PING_REQUEST = 'MSA_DISCOVERY_PING_REQUEST'
export const MSA_DISCOVERY_PING_SUCCESS = 'MSA_DISCOVERY_PING_SUCCESS'
export const MSA_DISCOVERY_PING_FAILURE = 'MSA_DISCOVERY_PING_FAILURE'

const fetchDiscoveryPing = (clusterID, body) => ({
  [CALL_API]: {
    types: [ MSA_DISCOVERY_PING_REQUEST, MSA_DISCOVERY_PING_SUCCESS, MSA_DISCOVERY_PING_FAILURE ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/services/ping`,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': CONTENT_TYPE_TEXT,
      },
    },
    schema: {},
  },
})

export function discoveryPing(clusterID, body) {
  return dispatch => {
    return dispatch(fetchDiscoveryPing(clusterID, body))
  }
}

export const MSA_DELETE_MANUALRULES_REQUEST = 'MSA_DELETE_MANUALRULES_REQUEST'
export const MSA_DELETE_MANUALRULES_SUCCESS = 'MSA_DELETE_MANUALRULES_SUCCESS'
export const MSA_DELETE_MANUALRULES_FAILURE = 'MSA_DELETE_MANUALRULES_FAILURE'

const fetchDelManualrules = (clusterID, ruleIDs) => ({
  [CALL_API]: {
    types: [
      MSA_DELETE_MANUALRULES_REQUEST,
      MSA_DELETE_MANUALRULES_SUCCESS,
      MSA_DELETE_MANUALRULES_FAILURE,
    ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/admissions/instances/${ruleIDs}`,
    options: {
      method: 'DELETE',
    },
    schema: {},
  },
})

export function delManualrules(clusterID, ruleIDs) {
  return dispatch => {
    return dispatch(fetchDelManualrules(clusterID, ruleIDs))
  }
}

export const MSA_DELETE_EXPULSSIONS_MANUALRULES_REQUEST = 'MSA_DELETE_EXPULSSIONS_MANUALRULES_REQUEST'
export const MSA_DELETE_EXPULSSIONS_MANUALRULES_SUCCESS = 'MSA_DELETE_EXPULSSIONS_MANUALRULES_SUCCESS'
export const MSA_DELETE_EXPULSSIONS_MANUALRULES_FAILURE = 'MSA_DELETE_EXPULSSIONS_MANUALRULES_FAILURE'

const fetchDelExpulsionsManualrules = (clusterID, ruleIDs) => ({
  [CALL_API]: {
    types: [
      MSA_DELETE_EXPULSSIONS_MANUALRULES_REQUEST,
      MSA_DELETE_EXPULSSIONS_MANUALRULES_SUCCESS,
      MSA_DELETE_EXPULSSIONS_MANUALRULES_FAILURE,
    ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/expulsions/${ruleIDs}`,
    options: {
      method: 'DELETE',
    },
    schema: {},
  },
})

export function delExpulsionsManualrules(clusterID, ruleIDs) {
  return dispatch => {
    return dispatch(fetchDelExpulsionsManualrules(clusterID, ruleIDs))
  }
}

export const MSA_ENV_REQUEST = 'MSA_ENV_REQUEST'
export const MSA_ENV_SUCCESS = 'MSA_ENV_SUCCESS'
export const MSA_ENV_FAILURE = 'MSA_ENV_FAILURE'

const fetchMsaEnv = (clusterID, serviceInfo) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/env`
  /* if (query) {
    endpoint += `?${toQuerystring(query)}`
  } */
  return {
    [CALL_API]: {
      types: [ MSA_ENV_REQUEST, MSA_ENV_SUCCESS, MSA_ENV_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getMsaEnv(clusterID, serviceInfo) {
  return dispatch => {
    return dispatch(fetchMsaEnv(clusterID, serviceInfo))
  }
}

export const MSA_CONFIG_REQUEST = 'MSA_CONFIG_REQUEST'
export const MSA_CONFIG_SUCCESS = 'MSA_CONFIG_SUCCESS'
export const MSA_CONFIG_FAILURE = 'MSA_CONFIG_FAILURE'

const fetchMsaConfig = (clusterID, serviceInfo) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/config`
  /* if (query) {
    endpoint += `?${toQuerystring(query)}`
  } */
  return {
    [CALL_API]: {
      types: [ MSA_CONFIG_REQUEST, MSA_CONFIG_SUCCESS, MSA_CONFIG_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getMsaConfig(clusterID, serviceInfo) {
  return dispatch => {
    return dispatch(fetchMsaConfig(clusterID, serviceInfo))
  }
}

export const MSA_CONFIG_REFRESH_REQUEST = 'MSA_CONFIG_REFRESH_REQUEST'
export const MSA_CONFIG_REFRESH_SUCCESS = 'MSA_CONFIG_REFRESH_SUCCESS'
export const MSA_CONFIG_REFRESH_FAILURE = 'MSA_CONFIG_REFRESH_FAILURE'

const fetchRefreshMsaConfig = (clusterID, serviceInfo) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/bus/refresh`
  return {
    [CALL_API]: {
      types: [ MSA_CONFIG_REFRESH_REQUEST, MSA_CONFIG_REFRESH_SUCCESS, MSA_CONFIG_REFRESH_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'POST',
      },
    },
  }
}

export function refreshMsaConfig(clusterID, serviceInfo) {
  return dispatch => {
    return dispatch(fetchRefreshMsaConfig(clusterID, serviceInfo))
  }
}

export const SERVICE_DETAIL_REQUEST = 'SERVICE_DETAIL_REQUEST'
export const SERVICE_DETAIL_SUCCESS = 'SERVICE_DETAIL_SUCCESS'
export const SERVICE_DETAIL_FAILURE = 'SERVICE_DETAIL_FAILURE'

const fetchServiceDetail = (clusterID, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        SERVICE_DETAIL_REQUEST,
        SERVICE_DETAIL_SUCCESS,
        SERVICE_DETAIL_FAILURE,
      ],
      endpoint: `/clusters/${clusterID}/services/${serviceName}`,
      schema: {},
    },
  }
}

export function getServiceDetail(clusterID, serviceName) {
  return dispatch => {
    return dispatch(fetchServiceDetail(clusterID, serviceName))
  }
}

export const GET_PROXIES_REQUEST = 'GET_PROXIES_REQUEST'
export const GET_PROXIES_SUCCESS = 'GET_PROXIES_SUCCESS'
export const GET_PROXIES_FAILURE = 'GET_PROXIES_FAILURE'

const fetchClusterProxies = clusterID => {
  return {
    [CALL_API]: {
      types: [
        GET_PROXIES_REQUEST,
        GET_PROXIES_SUCCESS,
        GET_PROXIES_FAILURE,
      ],
      endpoint: `/clusters/${clusterID}/proxies`,
      schema: {},
    },
  }
}

export function getClusterProxies(clusterID) {
  return dispatch => {
    return dispatch(fetchClusterProxies(clusterID))
  }
}

// 微服务日志
export const GET_MSA_LOGS_REQUEST = 'GET_MSA_LOGS_REQUEST'
export const GET_MSA_LOGS_SUCCESS = 'GET_MSA_LOGS_SUCCESS'
export const GET_MSA_LOGS_FAILURE = 'GET_MSA_LOGS_FAILURE'

const fetchMsaLogs = (clusterId, serviceName, body) => {
  return {
    [CALL_API]: {
      types: [
        GET_MSA_LOGS_REQUEST,
        GET_MSA_LOGS_SUCCESS,
        GET_MSA_LOGS_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/logs/services/${serviceName}/logs`,
      schema: {},
      options: {
        method: 'POST',
        body,
      },
    },
  }
}

export const getMsaLogs = (clusterId, serviceName, body) =>
  dispatch => dispatch(fetchMsaLogs(clusterId, serviceName, body))
