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
import { API_CONFIG, CONTENT_TYPE_TEXT, METRICS_DEFAULT_SOURCE } from '../constants'
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

// 由于dev-branch暂时不需要RPC相关功能, rpc相关action暂时没用
export const RPC_LIST_REQUEST = 'RPC_LIST_REQUEST'
export const RPC_LIST_SUCCESS = 'RPC_LIST_SUCCESS'
export const RPC_LIST_FAILURE = 'RPC_LIST_FAILURE'

// Fetches a page of msa.
const fetchRpcList = (clusterID, query) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/zookeeper/dubbo/servers`

  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [ RPC_LIST_REQUEST, RPC_LIST_SUCCESS, RPC_LIST_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getRpcList(clusterID, query) {
  return dispatch => {
    return dispatch(fetchRpcList(clusterID, query))
  }
}

export const RPC_SEARCH = 'RPC_SEARCH'
export function searchRpcList(condition, currentClassify) {
  return dispatch => {
    dispatch({
      type: RPC_SEARCH,
      payload: {
        condition,
        currentClassify,
      },
    })

  }
}
export const MSA_ADD_MANUALRULE_REQUEST = 'MSA_ADD_MANUALRULE_REQUEST'
export const MSA_ADD_MANUALRULE_SUCCESS = 'MSA_ADD_MANUALRULE_SUCCESS'
export const MSA_ADD_MANUALRULE_FAILURE = 'MSA_ADD_MANUALRULE_FAILURE'

const fetchAddManualrules = (clusterID, body, options) => ({
  options,
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

export function addManualrules(clusterID, body, options) {
  return dispatch => {
    return dispatch(fetchAddManualrules(clusterID, body, options))
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

const fetchAddInstancesIntoManualrules = (clusterID, body, options) => ({
  options,
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

export function addInstancesIntoManualrules(clusterID, body, options) {
  return dispatch => {
    return dispatch(fetchAddInstancesIntoManualrules(clusterID, body, options))
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
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/admissions/${ruleIDs}`,
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

export const MSA_DELETE_INSTANCE_MANUALRULES_REQUEST = 'MSA_DELETE_INSTANCE_MANUALRULES_REQUEST'
export const MSA_DELETE_INSTANCE_MANUALRULES_SUCCESS = 'MSA_DELETE_INSTANCE_MANUALRULES_SUCCESS'
export const MSA_DELETE_INSTANCE_MANUALRULES_FAILURE = 'MSA_DELETE_INSTANCE_MANUALRULES_FAILURE'

const fetchDelInstanceManualrules = (clusterID, ruleIDs) => ({
  [CALL_API]: {
    types: [
      MSA_DELETE_INSTANCE_MANUALRULES_REQUEST,
      MSA_DELETE_INSTANCE_MANUALRULES_SUCCESS,
      MSA_DELETE_INSTANCE_MANUALRULES_FAILURE,
    ],
    endpoint: `${MSA_API_URL}/clusters/${clusterID}/discovery/manualrules/admissions/instances/${ruleIDs}`,
    options: {
      method: 'DELETE',
    },
    schema: {},
  },
})

export const delInstanceManualRules = (clusterID, ruleIDs) =>
  dispatch => dispatch(fetchDelInstanceManualrules(clusterID, ruleIDs))

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

const fetchMsaEnv = (clusterID, serviceInfo, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/env`
  /* if (query) {
    endpoint += `?${toQuerystring(query)}`
  } */
  return {
    options,
    [CALL_API]: {
      types: [ MSA_ENV_REQUEST, MSA_ENV_SUCCESS, MSA_ENV_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getMsaEnv(clusterID, serviceInfo, options) {
  return dispatch => {
    return dispatch(fetchMsaEnv(clusterID, serviceInfo, options))
  }
}

export const MSA_CONFIG_REQUEST = 'MSA_CONFIG_REQUEST'
export const MSA_CONFIG_SUCCESS = 'MSA_CONFIG_SUCCESS'
export const MSA_CONFIG_FAILURE = 'MSA_CONFIG_FAILURE'

const fetchMsaConfig = (clusterID, serviceInfo, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/config`
  /* if (query) {
    endpoint += `?${toQuerystring(query)}`
  } */
  return {
    options,
    [CALL_API]: {
      types: [ MSA_CONFIG_REQUEST, MSA_CONFIG_SUCCESS, MSA_CONFIG_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getMsaConfig(clusterID, serviceInfo, options) {
  return dispatch => {
    return dispatch(fetchMsaConfig(clusterID, serviceInfo, options))
  }
}

export const MSA_CONFIG_REFRESH_REQUEST = 'MSA_CONFIG_REFRESH_REQUEST'
export const MSA_CONFIG_REFRESH_SUCCESS = 'MSA_CONFIG_REFRESH_SUCCESS'
export const MSA_CONFIG_REFRESH_FAILURE = 'MSA_CONFIG_REFRESH_FAILURE'

const fetchRefreshMsaConfig = (clusterID, serviceInfo, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterID}/services/${serviceInfo}/bus/refresh`
  return {
    options,
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

export function refreshMsaConfig(clusterID, serviceInfo, options) {
  return dispatch => {
    return dispatch(fetchRefreshMsaConfig(clusterID, serviceInfo, options))
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

// 微服务监控
export const GET_MSA_MONITOR_REQUEST = 'GET_MSA_MONITOR_REQUEST'
export const GET_MSA_MONITOR_SUCCESS = 'GET_MSA_MONITOR_SUCCESS'
export const GET_MSA_MONITOR_FAILURE = 'GET_MSA_MONITOR_FAILURE'

const fetchMsaMonitor = (clusterId, serviceName, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { type } = query
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_MSA_MONITOR_REQUEST,
        GET_MSA_MONITOR_SUCCESS,
        GET_MSA_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/metric/services/${serviceName}/metrics?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const msaMonitor = (clusterId, serviceName, query) =>
  dispatch => dispatch(fetchMsaMonitor(clusterId, serviceName, query))

// 微服务实时监控
export const GET_MSA_REALTIME_MONITOR_REQUEST = 'GET_MSA_REALTIME_MONITOR_REQUEST'
export const GET_MSA_REALTIME_MONITOR_SUCCESS = 'GET_MSA_REALTIME_MONITOR_SUCCESS'
export const GET_MSA_REALTIME_MONITOR_FAILURE = 'GET_MSA_REALTIME_MONITOR_FAILURE'

const fetchMsaRealTimeMonitor = (clusterId, serviceName, query) => {
  query = Object.assign({}, query, { source: METRICS_DEFAULT_SOURCE })
  const { type } = query
  return {
    metricType: type,
    [CALL_API]: {
      types: [
        GET_MSA_REALTIME_MONITOR_REQUEST,
        GET_MSA_REALTIME_MONITOR_SUCCESS,
        GET_MSA_REALTIME_MONITOR_FAILURE,
      ],
      endpoint: `${PAAS_API_URL}/clusters/${clusterId}/metric/services/${serviceName}/metrics?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const msaRealTimeMonitor = (clusterId, serviceName, query) =>
  dispatch => dispatch(fetchMsaRealTimeMonitor(clusterId, serviceName, query))

// 微服务熔断监控集群列表

export const GET_MSA_BLOWN_CLUSTERS_REQUEST = 'GET_MSA_BLOWN_CLUSTERS_REQUEST'
export const GET_MSA_BLOWN_CLUSTERS_SUCCESS = 'GET_MSA_BLOWN_CLUSTERS_SUCCESS'
export const GET_MSA_BLOWN_CLUSTERS_FAILURE = 'GET_MSA_BLOWN_CLUSTERS_FAILURE'

const fetchMsaBlownClusters = clusterId => {
  return {
    [CALL_API]: {
      types: [
        GET_MSA_BLOWN_CLUSTERS_REQUEST,
        GET_MSA_BLOWN_CLUSTERS_SUCCESS,
        GET_MSA_BLOWN_CLUSTERS_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/hystrix/clusters`,
      schema: {},
    },
  }
}

export const msaBlownClusters = clusterId =>
  dispatch => dispatch(fetchMsaBlownClusters(clusterId))

// 微服务熔断监控（目前未使用，这部分数据通过websocket方式获取）
export const GET_MSA_BLOWN_MONITOR_REQUEST = 'GET_MSA_BLOWN_MONITOR_REQUEST'
export const GET_MSA_BLOWN_MONITOR_SUCCESS = 'GET_MSA_BLOWN_MONITOR_SUCCESS'
export const GET_MSA_BLOWN_MONITOR_FAILURE = 'GET_MSA_BLOWN_MONITOR_FAILURE'

const fetchMsaBlownMonitor = (clusterId, clusterName) => {
  return {
    [CALL_API]: {
      types: [
        GET_MSA_BLOWN_MONITOR_REQUEST,
        GET_MSA_BLOWN_MONITOR_SUCCESS,
        GET_MSA_BLOWN_MONITOR_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/hystrix/query/${clusterName}`,
      schema: {},
    },
  }
}

export const msaBlownMonitor = (clusterID, clusterName) =>
  dispatch => dispatch(fetchMsaBlownMonitor(clusterID, clusterName))

// 将熔断监控数据放入store
export const SET_BLOWN_MONITOR = 'SET_BLOWN_MONITOR'

export const setBlownMonitor = data => {
  return {
    type: SET_BLOWN_MONITOR,
    data,
  }
}

// 清空熔断监控数据
export const CLEAR_BLOWN_MONITOR = 'CLEAR_BLOWN_MONITOR'

export const clearBlownMonitor = () => {
  return {
    type: CLEAR_BLOWN_MONITOR,
  }
}

// 查看服务是否设置熔断
export const GET_MSA_BLOWN_OPEN_REQUEST = 'GET_MSA_BLOWN_OPEN_REQUEST'
export const GET_MSA_BLOWN_OPEN_SUCCESS = 'GET_MSA_BLOWN_OPEN_SUCCESS'
export const GET_MSA_BLOWN_OPEN_FAILURE = 'GET_MSA_BLOWN_OPEN_FAILURE'

const fetchMsaBlownOpen = (clusterId, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        GET_MSA_BLOWN_OPEN_REQUEST,
        GET_MSA_BLOWN_OPEN_SUCCESS,
        GET_MSA_BLOWN_OPEN_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/services/${serviceName}/check/hystrix`,
      schema: {},
    },
  }
}

export const getMsaBlownOpenStatus = (clusterId, serviceName) =>
  dispatch => dispatch(fetchMsaBlownOpen(clusterId, serviceName))

// 熔断开启、关闭接口
export const MSA_BLOWN_OPEN_REQUEST = 'MSA_BLOWN_OPEN_REQUEST'
export const MSA_BLOWN_OPEN_SUCCESS = 'MSA_BLOWN_OPEN_SUCCESS'
export const MSA_BLOWN_OPEN_FAILURE = 'MSA_BLOWN_OPEN_FAILURE'

const postMsaBlownOpen = (clusterId, query) => {
  return {
    [CALL_API]: {
      types: [
        MSA_BLOWN_OPEN_REQUEST,
        MSA_BLOWN_OPEN_SUCCESS,
        MSA_BLOWN_OPEN_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/hystrix/open?${toQuerystring(query)}`,
      options: {
        method: 'POST',
      },
      schema: {},
    },
  }
}

export const msaBlownOpen = (clusterId, query) =>
  dispatch => dispatch(postMsaBlownOpen(clusterId, query))

// 设置熔断规则
export const SET_MSA_BLOWN_STRATEGY_REQUEST = 'SET_MSA_BLOWN_STRATEGY_REQUEST'
export const SET_MSA_BLOWN_STRATEGY_SUCCESS = 'SET_MSA_BLOWN_STRATEGY_SUCCESS'
export const SET_MSA_BLOWN_STRATEGY_FAILURE = 'SET_MSA_BLOWN_STRATEGY_FAILURE'

const postMsaBlownStrategy = (clusterId, body) => {
  return {
    [CALL_API]: {
      types: [
        SET_MSA_BLOWN_STRATEGY_REQUEST,
        SET_MSA_BLOWN_STRATEGY_SUCCESS,
        SET_MSA_BLOWN_STRATEGY_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/hystrix/rule`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const setMsaBlownStrategy = (clusterId, body) =>
  dispatch => dispatch(postMsaBlownStrategy(clusterId, body))

// 删除熔断规则
export const DEL_MSA_BLOWN_STRATEGY_REQUEST = 'DEL_MSA_BLOWN_STRATEGY_REQUEST'
export const DEL_MSA_BLOWN_STRATEGY_SUCCESS = 'DEL_MSA_BLOWN_STRATEGY_SUCCESS'
export const DEL_MSA_BLOWN_STRATEGY_FAILURE = 'DEL_MSA_BLOWN_STRATEGY_FAILURE'

const delMsaBlownStrategyRequest = (clusterId, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        DEL_MSA_BLOWN_STRATEGY_REQUEST,
        DEL_MSA_BLOWN_STRATEGY_SUCCESS,
        DEL_MSA_BLOWN_STRATEGY_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/hystrix/property?serviceName=${serviceName}`,
      options: {
        method: 'PUT',
      },
      schema: {},
    },
  }
}

export const delMsaBlownStrategy = (clusterId, serviceName) =>
  dispatch => dispatch(delMsaBlownStrategyRequest(clusterId, serviceName))


// 获取微服务熔断策略
export const GET_MSA_BLOWN_STRATEGY_REQUEST = 'GET_MSA_BLOWN_STRATEGY_REQUEST'
export const GET_MSA_BLOWN_STRATEGY_SUCCESS = 'GET_MSA_BLOWN_STRATEGY_SUCCESS'
export const GET_MSA_BLOWN_STRATEGY_FAILURE = 'GET_MSA_BLOWN_STRATEGY_FAILURE'

const fetchMsaBlownStrategy = (clusterId, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        GET_MSA_BLOWN_STRATEGY_REQUEST,
        GET_MSA_BLOWN_STRATEGY_SUCCESS,
        GET_MSA_BLOWN_STRATEGY_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/hystrix/rule?serviceName=${serviceName}`,
      schema: {},
    },
  }
}

export const getMsaBlownStrategy = (clusterId, serviceName) =>
  dispatch => dispatch(fetchMsaBlownStrategy(clusterId, serviceName))

// 检查服务是否可以开启降级
export const GET_SERVICE_DEMOTE_STATUS_REQUEST = 'GET_SERVICE_DEMOTE_STATUS_REQUEST'
export const GET_SERVICE_DEMOTE_STATUS_SUCCESS = 'GET_SERVICE_DEMOTE_STATUS_SUCCESS'
export const GET_SERVICE_DEMOTE_STATUS_FAILURE = 'GET_SERVICE_DEMOTE_STATUS_FAILURE'

const fetchServiceDemoteStatus = (clusterId, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        GET_SERVICE_DEMOTE_STATUS_REQUEST,
        GET_SERVICE_DEMOTE_STATUS_SUCCESS,
        GET_SERVICE_DEMOTE_STATUS_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/services/${serviceName}/check/hystrix?`,
      schema: {},
    },
  }
}

export const getServiceDemoteStatus = (clusterId, serviceName) =>
  dispatch => dispatch(fetchServiceDemoteStatus(clusterId, serviceName))

// 获取降级按钮开关状态
export const GET_DEMOTE_STATUS_REQUEST = 'GET_DEMOTE_STATUS_REQUEST'
export const GET_DEMOTE_STATUS_SUCCESS = 'GET_DEMOTE_STATUS_SUCCESS'
export const GET_DEMOTE_STATUS_FAILURE = 'GET_DEMOTE_STATUS_FAILURE'

const fetchDemoteStatus = (clusterId, serviceName) => {
  return {
    [CALL_API]: {
      types: [
        GET_DEMOTE_STATUS_REQUEST,
        GET_DEMOTE_STATUS_SUCCESS,
        GET_DEMOTE_STATUS_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/status?serviceName=${serviceName}`,
      schema: {},
    },
  }
}

export const getDemoteStatus = (clusterId, serviceName) =>
  dispatch => dispatch(fetchDemoteStatus(clusterId, serviceName))

// 降级开启/关闭
export const DEMOTE_SWITCH_REQUEST = 'POST_DEMOTE_SWITCH_REQUEST'
export const DEMOTE_SWITCH_SUCCESS = 'POST_DEMOTE_SWITCH_SUCCESS'
export const DEMOTE_SWITCH_FAILURE = 'POST_DEMOTE_SWITCH_FAILURE'

const demoteSwitchRequest = (clusterId, query) => {
  return {
    [CALL_API]: {
      types: [
        DEMOTE_SWITCH_REQUEST,
        DEMOTE_SWITCH_SUCCESS,
        DEMOTE_SWITCH_FAILURE,
      ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/degrade/open?${toQuerystring(query)}`,
      options: {
        method: 'POST',
      },
      schema: {},
    },
  }
}

export const demoteSwitch = (clusterId, query) =>
  dispatch => dispatch(demoteSwitchRequest(clusterId, query))

// 查询事务列表
export const GET_DISTRIBUTE_LIST_REQUEST = 'GET_DISTRIBUTE_LIST_REQUEST'
export const GET_DISTRIBUTE_LIST_SUCCESS = 'GET_DISTRIBUTE_LIST_SUCCESS'
export const GET_DISTRIBUTE_LIST_FAILURE = 'GET_DISTRIBUTE_LIST_FAILURE'

const fetchDistributeList = (clusterId, query) => {
  return {
    [CALL_API]: {
      types: [
        GET_DISTRIBUTE_LIST_REQUEST,
        GET_DISTRIBUTE_LIST_SUCCESS,
        GET_DISTRIBUTE_LIST_FAILURE,
      ],
      // endpoint: `http://192.168.1.230:19073/api/v1/tx/getTxList?${toQuerystring(query)}`,
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/transaction/groups?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const getDistributeList = (clusterId, query) =>
  dispatch => dispatch(fetchDistributeList(clusterId, query))

// 查询子事务
export const GET_CHILD_TRANSACTION_REQUEST = 'GET_CHILD_TRANSACTION_REQUEST'
export const GET_CHILD_TRANSACTION_SUCCESS = 'GET_CHILD_TRANSACTION_SUCCESS'
export const GET_CHILD_TRANSACTION_FAILURE = 'GET_CHILD_TRANSACTION_FAILURE'

const fetchChildTranscation = (clusterId, txName) => {
  return {
    [CALL_API]: {
      types: [
        GET_CHILD_TRANSACTION_REQUEST,
        GET_CHILD_TRANSACTION_SUCCESS,
        GET_CHILD_TRANSACTION_FAILURE,
      ],
      // endpoint: `http://192.168.1.230:19073/api/v1/tx/queryTxDetails/${txName}`,
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/transaction/details/${txName}`,
      schema: {},
    },
  }
}

export const getChildTranscation = (clusterId, txName) =>
  dispatch => dispatch(fetchChildTranscation(clusterId, txName))

// 查询事务执行记录概览
export const GET_EXECUTION_RECORD_OVERVIEW_REQUEST = 'GET_EXECUTION_RECORD_OVERVIEW_REQUEST'
export const GET_EXECUTION_RECORD_OVERVIEW_SUCCESS = 'GET_EXECUTION_RECORD_OVERVIEW_SUCCESS'
export const GET_EXECUTION_RECORD_OVERVIEW_FAILURE = 'GET_EXECUTION_RECORD_OVERVIEW_FAILURE'

const fetchExecuctionRecordOverview = clusterID => {
  return {
    [CALL_API]: {
      types: [
        GET_EXECUTION_RECORD_OVERVIEW_REQUEST,
        GET_EXECUTION_RECORD_OVERVIEW_SUCCESS,
        GET_EXECUTION_RECORD_OVERVIEW_FAILURE,
      ],
      // endpoint: 'http://192.168.1.230:19073/api/v1/tx/overview',
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/transaction/overview`,
      schema: {},
    },
  }
}

export const getExecuctionRecordOverview = clusterId =>
  dispatch => dispatch(fetchExecuctionRecordOverview(clusterId))

// 查询事务执行记录列表
export const GET_EXECUTION_RECORD_LIST_REQUEST = 'GET_EXECUTION_RECORD_LIST_REQUEST'
export const GET_EXECUTION_RECORD_LIST_SUCCESS = 'GET_EXECUTION_RECORD_LIST_SUCCESS'
export const GET_EXECUTION_RECORD_LIST_FAILURE = 'GET_EXECUTION_RECORD_LIST_FAILURE'

const fetchExecuctionRecordList = (clusterID, query) => {
  return {
    [CALL_API]: {
      types: [
        GET_EXECUTION_RECORD_LIST_REQUEST,
        GET_EXECUTION_RECORD_LIST_SUCCESS,
        GET_EXECUTION_RECORD_LIST_FAILURE,
      ],
      // endpoint: `http://192.168.1.230:19073/api/v1/tx/recordList?${toQuerystring(query)}`,
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/transaction/transactions?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const getExecuctionRecordList = (clusterId, query) =>
  dispatch => dispatch(fetchExecuctionRecordList(clusterId, query))

// 查询事务执行记录详情
export const GET_EXECUTION_RECORD_DETAIL_REQUEST = 'GET_EXECUTION_RECORD_DETAIL_REQUEST'
export const GET_EXECUTION_RECORD_DETAIL_SUCCESS = 'GET_EXECUTION_RECORD_DETAIL_SUCCESS'
export const GET_EXECUTION_RECORD_DETAIL_FAILURE = 'GET_EXECUTION_RECORD_DETAIL_FAILURE'

const fetchExecuctionRecordDetail = (clusterID, id) => {
  return {
    [CALL_API]: {
      types: [
        GET_EXECUTION_RECORD_DETAIL_REQUEST,
        GET_EXECUTION_RECORD_DETAIL_SUCCESS,
        GET_EXECUTION_RECORD_DETAIL_FAILURE,
      ],
      // endpoint: `http://192.168.1.230:19073/api/v1/tx/record/${groupId}`,
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/transaction/transactions/${id}`,
      schema: {},
    },
  }
}

export const getExecuctionRecordDetail = (clusterId, id) =>
  dispatch => dispatch(fetchExecuctionRecordDetail(clusterId, id))

