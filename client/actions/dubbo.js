/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * actions for dubbo
 *
 * 2018-10-24
 * @author zhouhaitao
 */
import { CALL_API } from '../middleware/api'
import { toQuerystring } from '../common/utils'
import { METRICS_DEFAULT_SOURCE, API_CONFIG } from '../constants'
import _ from 'lodash'

const { PAAS_API_URL } = API_CONFIG

export const FETCH_DUBBO_LIST_REQUEST = 'FETCH_DUBBO_LIST_REQUEST'
export const FETCH_DUBBO_LIST_SUCCESS = 'FETCH_DUBBO_LIST_SUCCESS'
export const FETCH_DUBBO_LIST_FAILURE = 'FETCH_DUBBO_LIST_FAILURE'

const fetchDubboList = (clusterId, options, callback) => {
  return {
    options,
    [CALL_API]: {
      types: [ FETCH_DUBBO_LIST_REQUEST,
        FETCH_DUBBO_LIST_SUCCESS,
        FETCH_DUBBO_LIST_FAILURE ],
      endpoint: `/clusters/${clusterId}/daas/dubbo`,
      schema: {},
    },
    callback,
  }
}
export const getDubboList = (clusterId, options, callback) => dispatch => dispatch(
  fetchDubboList(clusterId, options, callback))

export const GET_DUBBO_DETAIL_REQUEST = 'GET_DUBBO_DETAIL_REQUEST'
export const GET_DUBBO_DETAIL_SUCCESS = 'GET_DUBBO_DETAIL_SUCCESS'
export const GET_DUBBO_DETAIL_FAILURE = 'GET_DUBBO_DETAIL_FAILURE'

const fetchDubboDetail = (clusterId, name, groupversion, callback) => {
  return {
    [CALL_API]: {
      types: [ GET_DUBBO_DETAIL_REQUEST,
        GET_DUBBO_DETAIL_SUCCESS,
        GET_DUBBO_DETAIL_FAILURE ],
      endpoint: `/clusters/${clusterId}/daas/dubbo/${name}?groupversion=${groupversion}`,
      schema: {},
    },
    callback,
  }
}

export const getDubboDetail = (clusterId, name, groupversion, callback) => {
  return dispatch => {
    return dispatch(fetchDubboDetail(clusterId, name, groupversion, callback))
  }
}
export const SEARCH_DUBBO_CONSUMER_OR_PROVIDER = 'SEARCH_DUBBO_CONSUMER_OR_PROVIDER'
export const searchConsumerOrProvider = (type, keyWord, data) => {
  return (dispatch, getState) => {
    // const { dubboDetail } = getState().dubbo
    const nextDubboDetail = _.cloneDeep(getState().dubbo.dubboDetail)
    const list = _.cloneDeep(nextDubboDetail.dataBackup[ type ])
    if (!list) return
    const filteredData = list.filter(v => {
      return v.podName.indexOf(keyWord) >= 0
    })
    nextDubboDetail.data[type] = filteredData
    dispatch({
      type: SEARCH_DUBBO_CONSUMER_OR_PROVIDER,
      payload: data ? data : nextDubboDetail.data,
    })
  }
}
export const FETCH_SUPPLIER_LIST_REQUEST = 'FETCH_SUPPLIER_LIST_REQUEST'
export const FETCH_SUPPLIER_LIST_SUCCESS = 'FETCH_SUPPLIER_LIST_SUCCESS'
export const FETCH_SUPPLIER_LIST_FAILURE = 'FETCH_SUPPLIER_LIST_FAILURE'

const fetchSupplierList = () => {
  return {
    type: FETCH_SUPPLIER_LIST_SUCCESS,
  }
}
export const getSupplierList = () => dispatch => dispatch(fetchSupplierList())

export const FETCH_CONSUMER_LIST_REQUEST = 'FETCH_CONSUMER_LIST_REQUEST'
export const FETCH_CONSUMER_LIST_SUCCESS = 'FETCH_CONSUMER_LIST_SUCCESS'
export const FETCH_CONSUMER_LIST_FAILURE = 'FETCH_CONSUMER_LIST_FAILURE'

const fetchConsumerList = () => {
  return {
    type: FETCH_CONSUMER_LIST_SUCCESS,
  }
}
export const getConsumerList = () => dispatch => dispatch(fetchConsumerList())


export const GET_ALL_METRICS_SERVICE_REQUEST = 'GET_ALL_METRICS_SERVICE_REQUEST'
export const GET_ALL_METRICS_SERVICE_SUCCESS = 'GET_ALL_METRICS_SERVICE_SUCCESS'
export const GET_ALL_METRICS_SERVICE_FAILURE = 'GET_ALL_METRICS_SERVICE_FAILURE'

function fetchServiceAllOfMetrics(cluster, serviceName, query = {}, callback) {
  let endpoint = `/clusters/${cluster}/services/${serviceName}`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    cluster,
    serviceName,
    [CALL_API]: {
      types: [
        GET_ALL_METRICS_SERVICE_REQUEST,
        GET_ALL_METRICS_SERVICE_SUCCESS,
        GET_ALL_METRICS_SERVICE_FAILURE ],
      endpoint,
      schema: {},
    },
    callback,
  }
}
export function loadServiceAllOfMetrics(cluster, serviceName, query, callback) {
  return dispatch => {
    return dispatch(fetchServiceAllOfMetrics(cluster, serviceName, query, callback))
  }
}

// 实例监控
export const GET_DUBBO_INSTANCE_MONITOR_REQUEST = 'GET_DUBBO_INSTANCE_MONITOR_REQUEST'
export const GET_DUBBO_INSTANCE_MONITOR_SUCCESS = 'GET_DUBBO_INSTANCE_MONITOR_SUCCESS'
export const GET_DUBBO_INSTANCE_MONITOR_FAILURE = 'GET_DUBBO_INSTANCE_MONITOR_FAILURE'

const fetchDubboInstanceMonitor = (clusterID, serviceName, project, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { type } = query
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_DUBBO_INSTANCE_MONITOR_REQUEST,
        GET_DUBBO_INSTANCE_MONITOR_SUCCESS,
        GET_DUBBO_INSTANCE_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterID}/metric/services/${serviceName}/metrics?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project,
        },
      },
    },
  }
}

export const dubboInstanceMonitor = (clusterID, serviceName, project, query) =>
  dispatch => dispatch(fetchDubboInstanceMonitor(clusterID, serviceName, project, query))

// 实例实时监控
export const GET_DUBBO_INSTANCE_REALTIME_MONITOR_REQUEST = 'GET_DUBBO_INSTANCE_REALTIME_MONITOR_REQUEST'
export const GET_DUBBO_INSTANCE_REALTIME_MONITOR_SUCCESS = 'GET_DUBBO_INSTANCE_REALTIME_MONITOR_SUCCESS'
export const GET_DUBBO_INSTANCE_REALTIME_MONITOR_FAILURE = 'GET_DUBBO_INSTANCE_REALTIME_MONITOR_FAILURE'

const fetchDubboInstanceRealTimeMonitor = (clusterID, serviceName, project, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { type } = query
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_DUBBO_INSTANCE_REALTIME_MONITOR_REQUEST,
        GET_DUBBO_INSTANCE_REALTIME_MONITOR_SUCCESS,
        GET_DUBBO_INSTANCE_REALTIME_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterID}/metric/services/${serviceName}/metrics?${toQuerystring(query)}`,
      schema: {},
      options: {
        headers: {
          project,
        },
      },
    },
  }
}

export const dubboInstanceRealTimeMonitor = (clusterID, serviceName, project, query) =>
  dispatch => dispatch(fetchDubboInstanceRealTimeMonitor(clusterID, serviceName, project, query))

// 获取当前实例的日志
export const GET_DUBBO_INSTANCE_LOGS_REQUEST = 'GET_DUBBO_INSTANCE_LOGS_REQUEST'
export const GET_DUBBO_INSTANCE_LOGS_SUCCESS = 'GET_DUBBO_INSTANCE_LOGS_SUCCESS'
export const GET_DUBBO_INSTANCE_LOGS_FALIURE = 'GET_DUBBO_INSTANCE_LOGS_FALIURE'

function fetchDubboInstanceLogs(clusterId, project, serviceName, body) {
  body.log_type = 'stdout'
  body.kind = 'service'
  return {
    serviceName,
    [CALL_API]: {
      types: [
        GET_DUBBO_INSTANCE_LOGS_REQUEST,
        GET_DUBBO_INSTANCE_LOGS_SUCCESS,
        GET_DUBBO_INSTANCE_LOGS_FALIURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/logs/instances/${serviceName}/logs`,
      options: {
        method: 'POST',
        body,
        headers: {
          teamspace: project,
        },
      },
      schema: {},
    },
  }
}

export const loadDubboInstanceLogs = (clusterId, project, serviceName, body) =>
  dispatch => dispatch(fetchDubboInstanceLogs(clusterId, project, serviceName, body))
