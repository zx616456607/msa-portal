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
import { SPRING_CLOUD_URL } from '../constants'
import { toQuerystring } from '../common/utils'

export const MSA_LIST_REQUEST = 'MSA_LIST_REQUEST'
export const MSA_LIST_SUCCESS = 'MSA_LIST_SUCCESS'
export const MSA_LIST_FAILURE = 'MSA_LIST_FAILURE'

// Fetches a page of msa.
const fetchMsaList = (clusterID, query) => {
  let endpoint = `${SPRING_CLOUD_URL}/clusters/${clusterID}/discovery/services`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [ MSA_LIST_REQUEST, MSA_LIST_SUCCESS, MSA_LIST_FAILURE ],
      endpoint,
      schema: {},
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

const fetchAddManualrule = (clusterID, body) => ({
  [CALL_API]: {
    types: [ MSA_ADD_MANUALRULE_REQUEST, MSA_ADD_MANUALRULE_SUCCESS, MSA_ADD_MANUALRULE_FAILURE ],
    endpoint: `${SPRING_CLOUD_URL}/clusters/${clusterID}/discovery/manualrule`,
    options: {
      method: 'POST',
      body,
    },
    schema: {},
  },
})

export function addManualrule(clusterID, body) {
  return dispatch => {
    return dispatch(fetchAddManualrule(clusterID, body))
  }
}

export const MSA_DISCOVERY_PING_REQUEST = 'MSA_DISCOVERY_PING_REQUEST'
export const MSA_DISCOVERY_PING_SUCCESS = 'MSA_DISCOVERY_PING_SUCCESS'
export const MSA_DISCOVERY_PING_FAILURE = 'MSA_DISCOVERY_PING_FAILURE'

const fetchDiscoveryPing = (clusterID, body) => ({
  [CALL_API]: {
    types: [ MSA_DISCOVERY_PING_REQUEST, MSA_DISCOVERY_PING_SUCCESS, MSA_DISCOVERY_PING_FAILURE ],
    endpoint: `${SPRING_CLOUD_URL}/clusters/${clusterID}/discovery/ping`,
    options: {
      method: 'POST',
      body,
    },
    schema: {},
  },
})

export function discoveryPing(clusterID, body) {
  return dispatch => {
    return dispatch(fetchDiscoveryPing(clusterID, body))
  }
}

export const MSA_DELETE_MANUALRULE_REQUEST = 'MSA_DELETE_MANUALRULE_REQUEST'
export const MSA_DELETE_MANUALRULE_SUCCESS = 'MSA_DELETE_MANUALRULE_SUCCESS'
export const MSA_DELETE_MANUALRULE_FAILURE = 'MSA_DELETE_MANUALRULE_FAILURE'

const fetchDelManualrule = (clusterID, ruleIDs) => ({
  [CALL_API]: {
    types: [ MSA_DELETE_MANUALRULE_REQUEST, MSA_DELETE_MANUALRULE_SUCCESS, MSA_DELETE_MANUALRULE_FAILURE ],
    endpoint: `${SPRING_CLOUD_URL}/clusters/${clusterID}/discovery/manualrule/${ruleIDs}`,
    options: {
      method: 'DELETE',
    },
    schema: {},
  },
})

export function delManualrule(clusterID, ruleIDs) {
  return dispatch => {
    return dispatch(fetchDelManualrule(clusterID, ruleIDs))
  }
}
