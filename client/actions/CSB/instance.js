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
import { Schemas } from '../../middleware/schemas'
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
  let schema
  switch (flag) {
    case CSB_AVAILABLE_INSTANCES_FLAG:
      types = [
        CSB_AVAILABLE_INSTANCES_REQUEST,
        CSB_AVAILABLE_INSTANCES_SUCCESS,
        CSB_AVAILABLE_INSTANCES_FAILURE,
      ]
      schema = Schemas.CSB_AVA_INSNTANCES_LIST_DATA
      break
    case CSB_OM_INSTANCES_FLAG:
      types = [
        CSB_OM_INSTANCES_REQUEST,
        CSB_OM_INSTANCES_SUCCESS,
        CSB_OM_INSTANCES_FAILURE,
      ]
      schema = Schemas.CSB_OM_INSNTANCES_LIST_DATA
      break
    case CSB_PUBLIC_INSTANCES_FLAG:
    default:
      types = [
        CSB_PUBLIC_INSTANCES_REQUEST,
        CSB_PUBLIC_INSTANCES_SUCCESS,
        CSB_PUBLIC_INSTANCES_FAILURE,
      ]
      schema = Schemas.CSB_PUB_INSNTANCES_LIST_DATA
      break
  }
  return {
    clusterID,
    query,
    [CALL_API]: {
      types,
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(_query)}`,
      schema,
    },
  }
}

// 获取实例详情
export const GET_CSB_INSTANCE_BY_ID_REQUEST = 'GET_CSB_INSTANCE_BY_ID_REQUEST'
export const GET_CSB_INSTANCE_BY_ID_SUCCESS = 'GET_CSB_INSTANCE_BY_ID_SUCCESS'
export const GET_CSB_INSTANCE_BY_ID_FAILURE = 'GET_CSB_INSTANCE_BY_ID_FAILURE'

const fetchGetInstancebyID = (clusterID, instanceID) => {
  return {
    instanceID,
    [CALL_API]: {
      types: [
        GET_CSB_INSTANCE_BY_ID_REQUEST,
        GET_CSB_INSTANCE_BY_ID_SUCCESS,
        GET_CSB_INSTANCE_BY_ID_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/${instanceID}`,
      schema: Schemas.CSB_AVA_INSNTANCE,
    },
  }
}

export const getInstanceByID = (clusterID, instanceID) =>
  dispatch => dispatch(fetchGetInstancebyID(clusterID, instanceID))

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

// 删除实例
export const DELETE_CSB_INSTANCES_REQUEST = 'DELETE_CSB_INSTANCES_REQUEST'
export const DELETE_CSB_INSTANCES_SUCCESS = 'DELETE_CSB_INSTANCES_SUCCESS'
export const DELETE_CSB_INSTANCES_FAILURE = 'DELETE_CSB_INSTANCES_FAILURE'

const fetchDeleteInstance = (clusterID, instanceID) => {
  return {
    [CALL_API]: {
      types: [
        DELETE_CSB_INSTANCES_REQUEST,
        DELETE_CSB_INSTANCES_SUCCESS,
        DELETE_CSB_INSTANCES_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/${instanceID}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const deleteInstance = (clusterID, instanceID) =>
  dispatch => dispatch(fetchDeleteInstance(clusterID, instanceID))

// 修改实例
export const EDIT_CSB_INSTANCE_REQUEST = 'EDIT_CSB_INSTANCE_REQUEST'
export const EDIT_CSB_INSTANCE_SUCCESS = 'EDIT_CSB_INSTANCE_SUCCESS'
export const EDIT_CSB_INSTANCE_FAILURE = 'EDIT_CSB_INSTANCE_FAILURE'

const fetchEditInstance = (clusterID, instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        EDIT_CSB_INSTANCE_REQUEST,
        EDIT_CSB_INSTANCE_SUCCESS,
        EDIT_CSB_INSTANCE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/${instanceID}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const editInstance = (clusterID, instanceID, body) =>
  dispatch => dispatch(fetchEditInstance(clusterID, instanceID, body))

// 获取实例概览
export const GET_CSB_INSTANCE_OVERVIEW_REQUEST = 'GET_CSB_INSTANCE_OVERVIEW_REQUEST'
export const GET_CSB_INSTANCE_OVERVIEW_SUCCESS = 'GET_CSB_INSTANCE_OVERVIEW_SUCCESS'
export const GET_CSB_INSTANCE_OVERVIEW_FAILURE = 'GET_CSB_INSTANCE_OVERVIEW_FAILURE'

const fetchGetInstanceOverview = (clusterID, instanceID) => {
  return {
    instanceID,
    [CALL_API]: {
      types: [
        GET_CSB_INSTANCE_OVERVIEW_REQUEST,
        GET_CSB_INSTANCE_OVERVIEW_SUCCESS,
        GET_CSB_INSTANCE_OVERVIEW_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/${instanceID}/overview`,
      schema: {},
    },
  }
}

export const getInstanceOverview = (clusterID, instanceID) =>
  dispatch => dispatch(fetchGetInstanceOverview(clusterID, instanceID))

// 获取 dsb-server 入口
export const GET_CSB_INSTANCE_SERVICE_INBOUNDS_REQUEST = 'GET_CSB_INSTANCE_SERVICE_INBOUNDS_REQUEST'
export const GET_CSB_INSTANCE_SERVICE_INBOUNDS_SUCCESS = 'GET_CSB_INSTANCE_SERVICE_INBOUNDS_SUCCESS'
export const GET_CSB_INSTANCE_SERVICE_INBOUNDS_FAILURE = 'GET_CSB_INSTANCE_SERVICE_INBOUNDS_FAILURE'

const fetchGetInstanceServiceInbounds = instanceID => {
  return {
    instanceID,
    [CALL_API]: {
      types: [
        GET_CSB_INSTANCE_SERVICE_INBOUNDS_REQUEST,
        GET_CSB_INSTANCE_SERVICE_INBOUNDS_SUCCESS,
        GET_CSB_INSTANCE_SERVICE_INBOUNDS_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/services/inbounds`,
      schema: {},
    },
  }
}

export const getInstanceServiceInbounds = instanceID =>
  dispatch => dispatch(fetchGetInstanceServiceInbounds(instanceID))
