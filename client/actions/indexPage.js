/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * IndexPage action for client/containers/IndexPage/index.js
 *
 * 2018-09-13
 * @author zhouhaitao
 */
import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { toQuerystring } from '../common/utils'

const { MSA_API_URL } = API_CONFIG
// 限流路由数据
export const LIMIT_ROUTE_REQUEST = 'LIMIT_ROUTE_REQUEST'
export const LIMIT_ROUTE_SUCCESS = 'LIMIT_ROUTE_SUCCESS'
export const LIMIT_ROUTE_FAILURE = 'LIMIT_ROUTE_FAILURE'
const fetchLimitAdnRoutes = clusterId => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/overview/gateway`
  return {
    [CALL_API]: {
      types: [
        LIMIT_ROUTE_REQUEST,
        LIMIT_ROUTE_SUCCESS,
        LIMIT_ROUTE_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}
export const getLimitAndRoutes = clusterId => {
  return dispatch => dispatch(fetchLimitAdnRoutes(clusterId))
}

// 微服务数据
export const MICROSERVICE_REQUEST = 'MICROSERVICE_REQUEST'
export const MICROSERVICE_SUCCESS = 'MICROSERVICE_SUCCESS'
export const MICROSERVICE_FAILURE = 'MICROSERVICE_FAILURE'
const fetchMicroservice = (clusterId, query, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/overview/microservice?${toQuerystring(query)}`
  return {
    options,
    [CALL_API]: {
      types: [
        MICROSERVICE_REQUEST,
        MICROSERVICE_SUCCESS,
        MICROSERVICE_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}
export const getMicroservice = (clusterId, query, options) => {
  return dispatch => dispatch(fetchMicroservice(clusterId, query, options))
}

// RPC服务数据
export const RPC_SERVICE_REQUEST = 'RPC_SERVICE_REQUEST'
export const RPC_SERVICE_SUCCESS = 'RPC_SERVICE_SUCCESS'
export const RPC_SERVICE_FAILURE = 'RPC_SERVICE_FAILURE'
const fetchRpcService = clusterId => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/overview/rpcservice`
  return {
    [CALL_API]: {
      types: [
        RPC_SERVICE_REQUEST,
        RPC_SERVICE_SUCCESS,
        RPC_SERVICE_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}
export const getRpcService = clusterId => {
  return dispatch => dispatch(fetchRpcService(clusterId))
}

// 服务调用数据
export const SERVICE_CALL_REQUEST = 'SERVICE_CALL_REQUEST'
export const SERVICE_CALL_SUCCESS = 'SERVICE_CALL_SUCCESS'
export const SERVICE_CALL_FAILURE = 'SERVICE_CALL_FAILURE'
const fetchServiceCall = (clusterId, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/overview/call?${toQuerystring(query)}`
  return {
    [CALL_API]: {
      types: [
        SERVICE_CALL_REQUEST,
        SERVICE_CALL_SUCCESS,
        SERVICE_CALL_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}
export const getServiceCall = (clusterId, query) => {
  return dispatch => dispatch(fetchServiceCall(clusterId, query))
}
