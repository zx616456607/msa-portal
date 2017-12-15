/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance aciton
 *
 * 2017-12-11
 * @author zhangpc
 */

import cloneDeep from 'lodash/cloneDeep'
import { CALL_API } from '../../middleware/api'
// import { Schemas } from '../../middleware/schemas'
import { toQuerystring } from '../../common/utils'
import {
  API_CONFIG,
  CSB_PUBLIC_INSTANCES_FLAG,
  CSB_AVAILABLE_INSTANCES_FLAG,
  CSB_OM_INSTANCES_FLAG,
} from '../../constants'

const { CSB_API_URL } = API_CONFIG

export const CSB_AVAILABLE_INSTANCES_REQUEST = 'CSB_AVAILABLE_INSTANCES_REQUEST'
export const CSB_AVAILABLE_INSTANCES_SUCCESS = 'CSB_AVAILABLE_INSTANCES_SUCCESS'
export const CSB_AVAILABLE_INSTANCES_FAILURE = 'CSB_AVAILABLE_INSTANCES_FAILURE'

export const CSB_OM_INSTANCES_REQUEST = 'CSB_OM_INSTANCES_REQUEST'
export const CSB_OM_INSTANCES_SUCCESS = 'CSB_OM_INSTANCES_SUCCESS'
export const CSB_OM_INSTANCES_FAILURE = 'CSB_OM_INSTANCES_FAILURE'

export const CSB_PUBLIC_INSTANCES_REQUEST = 'CSB_PUBLIC_INSTANCES_REQUEST'
export const CSB_PUBLIC_INSTANCES_SUCCESS = 'CSB_PUBLIC_INSTANCES_SUCCESS'
export const CSB_PUBLIC_INSTANCES_FAILURE = 'CSB_PUBLIC_INSTANCES_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
export const fetchInstances = (clusterID, query = {}) => {
  const _query = cloneDeep(query)
  const { flag, page } = _query
  if (page !== undefined) {
    _query.page = page - 1 // for api page start from 0
  }
  let types
  switch (flag) {
    case CSB_AVAILABLE_INSTANCES_FLAG:
      types = [
        CSB_AVAILABLE_INSTANCES_REQUEST,
        CSB_AVAILABLE_INSTANCES_SUCCESS,
        CSB_AVAILABLE_INSTANCES_FAILURE,
      ]
      break
    case CSB_OM_INSTANCES_FLAG:
      types = [
        CSB_OM_INSTANCES_REQUEST,
        CSB_OM_INSTANCES_SUCCESS,
        CSB_OM_INSTANCES_FAILURE,
      ]
      break
    case CSB_PUBLIC_INSTANCES_FLAG:
    default:
      types = [
        CSB_PUBLIC_INSTANCES_REQUEST,
        CSB_PUBLIC_INSTANCES_SUCCESS,
        CSB_PUBLIC_INSTANCES_FAILURE,
      ]
      break
  }
  return {
    clusterID,
    query,
    [CALL_API]: {
      types,
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(_query)}`,
      schema: {},
    },
  }
}

// Fetches a page of CSB instances.
// Relies on Redux Thunk middleware.
export const getInstances = (clusterID, query) =>
  dispatch => dispatch(fetchInstances(clusterID, query))

export const CREATE_INSTANCE_REQUEST = 'CREATE_INSTANCE_REQUEST'
export const CREATE_INSTANCE_SUCCESS = 'CREATE_INSTANCE_SUCCESS'
export const CREATE_INSTANCE_FAILURE = 'CREATE_INSTANCE_FAILURE'

// Create an instance
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCreateInstance = (clusterID, query, body) => {
  return {
    [CALL_API]: {
      types: [ CREATE_INSTANCE_REQUEST, CREATE_INSTANCE_SUCCESS, CREATE_INSTANCE_FAILURE ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createInstance = (clusterID, query, body) =>
  dispatch => dispatch(fetchCreateInstance(clusterID, query, body))

// 申请实例
export const APPLY_FOR_INSTANCES_REQUEST = 'APPLY_FOR_INSTANCES_REQUEST'
export const APPLY_FOR_INSTANCES_SUCCESS = 'APPLY_FOR_INSTANCES_SUCCESS'
export const APPLY_FOR_INSTANCES_FAILURE = 'APPLY_FOR_INSTANCES_FAILURE'

const fetchApplyforInstance = (clusterID, body) => {
  return {
    [CALL_API]: {
      types: [
        APPLY_FOR_INSTANCES_REQUEST,
        APPLY_FOR_INSTANCES_SUCCESS,
        APPLY_FOR_INSTANCES_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/request`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const applyforInstance = (clusterID, body) =>
  dispatch => dispatch(fetchApplyforInstance(clusterID, body))

// 放弃使用实例
export const ABANDON_CSB_INSTANCES_REQUEST = 'ABANDON_CSB_INSTANCES_REQUEST'
export const ABANDON_CSB_INSTANCES_SUCCESS = 'ABANDON_CSB_INSTANCES_SUCCESS'
export const ABANDON_CSB_INSTANCES_FAILURE = 'ABANDON_CSB_INSTANCES_FAILURE'

const fetchAbandonInstance = (clusterID, instanceID, query) => {
  return {
    [CALL_API]: {
      types: [
        ABANDON_CSB_INSTANCES_REQUEST,
        ABANDON_CSB_INSTANCES_SUCCESS,
        ABANDON_CSB_INSTANCES_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/role/${instanceID}?${toQuerystring(query)}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}
export const abandonInstance = (clusterID, instanceID, query) =>
  dispatch => dispatch(fetchAbandonInstance(clusterID, instanceID, query))
