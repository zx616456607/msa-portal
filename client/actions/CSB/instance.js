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
  METRICS_DEFAULT_SOURCE,
} from '../../constants'

const { CSB_API_URL, PAAS_API_URL } = API_CONFIG

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

// 校验实例名称
const CHECK_CSB_INSTANCE_NAME_REQUEST = 'CHECK_CSB_INSTANCE_NAME_REQUEST'
const CHECK_CSB_INSTANCE_NAME_SUCCESS = 'CHECK_CSB_INSTANCE_NAME_SUCCESS'
const CHECK_CSB_INSTANCE_NAME_FAILURE = 'CHECK_CSB_INSTANCE_NAME_FAILURE'

const fetchCheckInstanceName = (clusterID, query) => {
  return {
    [CALL_API]: {
      types: [
        CHECK_CSB_INSTANCE_NAME_REQUEST,
        CHECK_CSB_INSTANCE_NAME_SUCCESS,
        CHECK_CSB_INSTANCE_NAME_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/name?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const checkInstanceName = (clusterID, name) =>
  dispatch => dispatch(fetchCheckInstanceName(clusterID, name))

// 获取当前实例的日志
export const GET_INSTANCE_LOGS_REQUEST = 'GET_INSTANCE_LOGS_REQUEST'
export const GET_INSTANCE_LOGS_SUCCESS = 'GET_INSTANCE_LOGS_SUCCESS'
export const GET_INSTANCE_LOGS_FALIURE = 'GET_INSTANCE_LOGS_FALIURE'

function fetchGetInstanceLogs(clusterId, instanceNameSpace, body) {
  return {
    instanceNameSpace,
    [CALL_API]: {
      types: [
        GET_INSTANCE_LOGS_REQUEST,
        GET_INSTANCE_LOGS_SUCCESS,
        GET_INSTANCE_LOGS_FALIURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/logs/services/dsb-server/logs`,
      options: {
        method: 'POST',
        body,
        headers: {
          onbehalfuser: instanceNameSpace,
        },
      },
      schema: {},
    },
  }
}

export const loadInstanceLogs = (clusterId, instanceNameSpace, body = {}) =>
  dispatch => dispatch(fetchGetInstanceLogs(clusterId, instanceNameSpace, body))

// 启动当前实例
export const START_INSTANCE_REQUEST = 'START_INSTANCE_REQUEST'
export const START_INSTANCE_SUCCESS = 'START_INSTANCE_SUCCESS'
export const START_INSTANCE_FALIURE = 'START_INSTANCE_FALIURE'

function fetchStartInstance(clusterId, instanceNameSpace, body) {
  return {
    [CALL_API]: {
      types: [
        START_INSTANCE_REQUEST,
        START_INSTANCE_SUCCESS,
        START_INSTANCE_FALIURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/services/batch-start`,
      options: {
        method: 'PUT',
        body,
        headers: {
          onbehalfuser: instanceNameSpace,
        },
      },
      schema: {},
    },
  }
}

export const startInstance = (clusterId, instanceNameSpace, body) =>
  dispatch => dispatch(fetchStartInstance(clusterId, instanceNameSpace, body))

// 停止当前实例
export const STOP_INSTANCE_REQUEST = 'STOP_INSTANCE_REQUEST'
export const STOP_INSTANCE_SUCCESS = 'STOP_INSTANCE_SUCCESS'
export const STOP_INSTANCE_FALIURE = 'STOP_INSTANCE_FALIURE'

function fetchStopInstance(clusterId, instanceNameSpace, body) {
  return {
    [CALL_API]: {
      types: [
        STOP_INSTANCE_REQUEST,
        STOP_INSTANCE_SUCCESS,
        STOP_INSTANCE_FALIURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/services/batch-stop`,
      options: {
        method: 'PUT',
        body,
        headers: {
          onbehalfuser: instanceNameSpace,
        },
      },
      schema: {},
    },
  }
}

export const stopInstance = (clusterId, instanceNameSpace, body) =>
  dispatch => dispatch(fetchStopInstance(clusterId, instanceNameSpace, body))

// 重新部署实例
export const RESTART_INSTANCE_REQUEST = 'RESTART_INSTANCE_REQUEST'
export const RESTART_INSTANCE_SUCCESS = 'RESTART_INSTANCE_SUCCESS'
export const RESTART_INSTANCE_FALIURE = 'RESTART_INSTANCE_FALIURE'

function fetchRestartInstance(clusterId, instanceNameSpace, body) {
  return {
    [CALL_API]: {
      types: [
        RESTART_INSTANCE_REQUEST,
        RESTART_INSTANCE_SUCCESS,
        RESTART_INSTANCE_FALIURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/services/batch-restart`,
      options: {
        method: 'PUT',
        body,
        headers: {
          onbehalfuser: instanceNameSpace,
        },
      },
      schema: {},
    },
  }
}

export const restartInstance = (clusterId, instanceNameSpace, body) =>
  dispatch => dispatch(fetchRestartInstance(clusterId, instanceNameSpace, body))

// 实例监控
export const GET_INSTANCE_MONITOR_REQUEST = 'GET_INSTANCE_MONITOR_REQUEST'
export const GET_INSTANCE_MONITOR_SUCCESS = 'GET_INSTANCE_MONITOR_SUCCESS'
export const GET_INSTANCE_MONITOR_FAILURE = 'GET_INSTANCE_MONITOR_FAILURE'

const fetchInstanceMonitor = (clusterID, instance, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { namespace } = instance
  const { type } = query
  const name = 'dsb-server'
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_INSTANCE_MONITOR_REQUEST,
        GET_INSTANCE_MONITOR_SUCCESS,
        GET_INSTANCE_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterID}/metric/services/${name}/metrics?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project: namespace,
        },
      },
    },
  }
}

export const instanceMonitor = (clusterID, instance, query) =>
  dispatch => dispatch(fetchInstanceMonitor(clusterID, instance, query))

// 实例实时监控
export const GET_INSTANCE_REALTIME_MONITOR_REQUEST = 'GET_INSTANCE_REALTIME_MONITOR_REQUEST'
export const GET_INSTANCE_REALTIME_MONITOR_SUCCESS = 'GET_INSTANCE_REALTIME_MONITOR_SUCCESS'
export const GET_INSTANCE_REALTIME_MONITOR_FAILURE = 'GET_INSTANCE_REALTIME_MONITOR_FAILURE'

const fetchInstanceRealTimeMonitor = (clusterID, instance, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { namespace } = instance
  const { type } = query
  const name = 'dsb-server'
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_INSTANCE_REALTIME_MONITOR_REQUEST,
        GET_INSTANCE_REALTIME_MONITOR_SUCCESS,
        GET_INSTANCE_REALTIME_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterID}/metric/services/${name}/metrics?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project: namespace,
        },
      },
    },
  }
}

export const instanceRealTimeMonitor = (clusterID, instance, query) =>
  dispatch => dispatch(fetchInstanceRealTimeMonitor(clusterID, instance, query))
