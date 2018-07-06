/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa reducers for redux
 *
 * 2017-11-02
 * @author zhangxuan
 */

import * as ActionTypes from '../actions/msa'
import isEmpty from 'lodash/isEmpty'
import { formatDate } from '../common/utils'

const msaNameList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MSA_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const rpcList = (state = {}, action) => {
  const { type } = action
  const data = {
    status: 'success',
    code: 200,
    data: {
      providersSet: [
        {
          ip: '10.0.75.1:20880',
          version: null,
          side: 'provider',
          serviceName: 'com.tenxcloud.example.dubbos.CityService',
          application: 'zk-dubbo-provider',
          group: 'a',
          timestamp: 1530771249531,
          pid: 0,
          detail: null,
        },
        {
          ip: '192.168.1.220:20880',
          version: null,
          side: 'provider',
          serviceName: 'com.tenxcloud.example.dubbos.CityService',
          application: 'zk-dubbo-provider',
          group: null,
          timestamp: 1530531827620,
          pid: 0,
          detail: null,
        },
        {
          ip: '10.0.75.1:53637',
          version: '3.0',
          side: 'provider',
          serviceName: 'com.tenxcloud.example.dubbos.ConService',
          application: 'zk-dubbo-consumer',
          group: null,
          timestamp: 1530775275706,
          pid: 0,
          detail: null,
        },
        {
          ip: '10.0.75.1:20880',
          version: null,
          side: 'provider',
          serviceName: 'com.tenxcloud.example.dubbos.CityService',
          application: 'zk-dubbo-provider',
          group: null,
          timestamp: 1530771239220,
          pid: 0,
          detail: null,
        },
        {
          ip: '10.0.75.1:53637',
          version: '2.0',
          side: 'provider',
          serviceName: 'com.tenxcloud.example.dubbos.ConService',
          application: 'zk-dubbo-consumer',
          group: null,
          timestamp: 1530775274927,
          pid: 0,
          detail: null,
        },
      ],
      consumersSet: [
        {
          ip: '10.0.75.1',
          version: null,
          side: 'consumer',
          serviceName: 'com.tenxcloud.example.dubbos.CityService',
          application: 'zk-dubbo-consumer',
          group: null,
          timestamp: 1530775254683,
          pid: 0,
          detail: null,
        },
      ],
      services: [
        'com.tenxcloud.example.dubbos.CityService',
        'com.tenxcloud.example.dubbos.ConService',
      ],
      ips: [
        '10.0.75.1',
        '10.0.75.1:20880',
        '192.168.1.220:20880',
        '10.0.75.1:53637',
      ],
    },
  }
  switch (type) {
    case ActionTypes.RPC_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RPC_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.data,
      }
    case ActionTypes.RPC_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        ...data.data,
      }
    case ActionTypes.RPC_SEARCH: {
      const { condition } = action.payload
      const key = Object.keys(condition)[0]
      const tempState = state
      if (condition[key] !== '') {
        const newData = tempState[action.payload.currentClassify].filter(
          v => v[key] === condition[key])
        tempState[action.payload.currentClassify] = newData
      }
      return {
        ...state,
        ...tempState,
      }
    }
    default:
      return state
  }
}

const msaEnv = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_ENV_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.MSA_ENV_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_ENV_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const msaConfig = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_CONFIG_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.MSA_CONFIG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_CONFIG_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.SERVICE_DETAIL_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.SERVICE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.SERVICE_DETAIL_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceProxy = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_PROXIES_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.GET_PROXIES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.GET_PROXIES_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const msaLogs = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_MSA_LOGS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        data: [],
      })
    case ActionTypes.GET_MSA_LOGS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.GET_MSA_LOGS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        data: [],
      })
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

const msaMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_MSA_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_MSA_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: false,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_MSA_MONITOR_FAILURE:
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

const msaRealTimeMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_MSA_REALTIME_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_MSA_REALTIME_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_MSA_REALTIME_MONITOR_FAILURE:
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

const msa = (state = {
  msaNameList: {},
  rpcList: {},
  msaEnv: {},
  msaConfig: {},
  serviceDetail: {},
  serviceProxy: {},
  msaLogs: {},
  msaMonitor: {},
  msaRealTimeMonitor: {},
}, action) => {
  return {
    msaNameList: msaNameList(state.msaNameList, action),
    rpcList: rpcList(state.rpcList, action),
    msaEnv: msaEnv(state.msaEnv, action),
    msaConfig: msaConfig(state.msaConfig, action),
    serviceDetail: serviceDetail(state.serviceDetail, action),
    serviceProxy: serviceProxy(state.serviceProxy, action),
    msaLogs: msaLogs(state.msaLogs, action),
    msaMonitor: msaMonitor(state.msaMonitor, action),
    msaRealTimeMonitor: msaRealTimeMonitor(state.msaRealTimeMonitor, action),
  }
}

export default msa
