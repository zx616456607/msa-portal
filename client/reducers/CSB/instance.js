/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance reducers for redux
 *
 * 2017-12-15
 * @author zhangpc
 */

import isEmpty from 'lodash/isEmpty'
import * as ActionTypes from '../../actions/CSB/instance'
import { formatDate, getQueryKey } from '../../common/utils'

export const publicInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_PUBLIC_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.CSB_PUBLIC_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.CSB_PUBLIC_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const availableInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_AVAILABLE_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.CSB_AVAILABLE_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.CSB_AVAILABLE_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const omInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_OM_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.CSB_OM_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.CSB_OM_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const instanceOverview = (state = {}, action) => {
  const { type, instanceID } = action
  switch (type) {
    case ActionTypes.GET_CSB_INSTANCE_OVERVIEW_REQUEST:
      return {
        ...state,
        [instanceID]: Object.assign({}, state[instanceID], {
          isFetching: true,
        }),
      }
    case ActionTypes.GET_CSB_INSTANCE_OVERVIEW_SUCCESS:
      return {
        ...state,
        [instanceID]: {
          isFetching: false,
          ...action.response.result.data,
        },
      }
    case ActionTypes.GET_CSB_INSTANCE_OVERVIEW_FAILURE:
      return {
        ...state,
        [instanceID]: Object.assign({}, state[instanceID], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const servicesInbounds = (state = {}, action) => {
  const { type, instanceID } = action
  switch (type) {
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_INBOUNDS_REQUEST:
      return {
        ...state,
        [instanceID]: Object.assign({}, state[instanceID], {
          isFetching: true,
        }),
      }
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_INBOUNDS_SUCCESS:
      return {
        ...state,
        [instanceID]: {
          isFetching: false,
          data: action.response.result.data,
        },
      }
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_INBOUNDS_FAILURE:
      return {
        ...state,
        [instanceID]: Object.assign({}, state[instanceID], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const instanceLogs = (state = {}, action) => {
  const { type, instanceNameSpace } = action
  switch (type) {
    case ActionTypes.GET_INSTANCE_LOGS_REQUEST:
      return {
        ...state,
        [instanceNameSpace]: {
          isFetching: true,
        },
      }
    case ActionTypes.GET_INSTANCE_LOGS_SUCCESS:
      return {
        ...state,
        [instanceNameSpace]: {
          isFetching: false,
          data: action.response.result.data || [],
        },
      }
    case ActionTypes.GET_INSTANCE_LOGS_FALIURE:
      return {
        ...state,
        [instanceNameSpace]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}

const formatInstanceMonitor = data => {
  if (isEmpty(data)) {
    return data
  }
  data.forEach(item => {
    const { container_name, metrics } = item
    // bizcharts 图例显示有问题，去掉服务名称后的数字（dsb-server-3375465363-1x4v5 => dsb-server-1x4v5）
    let name = container_name.split('-')
    name.splice(-2, 1)
    name = name.join('-')
    metrics.forEach(metric => {
      metric.container_name = name
      metric.timestamp = formatDate(metric.timestamp, 'MM-DD HH:mm:ss')
    })
  })
  return data
}
export const instanceMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_INSTANCE_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_INSTANCE_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: false,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_INSTANCE_MONITOR_FAILURE:
      return {
        ...state,
        [metricType]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}

export const instanceRealTimeMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_INSTANCE_REALTIME_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_INSTANCE_REALTIME_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: false,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_INSTANCE_REALTIME_MONITOR_FAILURE:
      return {
        ...state,
        [metricType]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}
