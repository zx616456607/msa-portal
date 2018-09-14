/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * globalConfig aciton
 *
 * 2018-07-10
 * @author ZhouHai tao
 */

// @todo
// 由于dev-branch暂时不需要RPC相关功能，此文件暂时没用
import { API_CONFIG } from '../constants'
import { CALL_API } from '../middleware/api'
import { toQuerystring } from '../common/utils'


export const GET_ZKHOST_REQUEST = 'GET_ZKHOST_REQUEST'
export const GET_ZKHOST_SUCCESS = 'GET_ZKHOST_SUCCESS'
export const GET_ZKHOST_FAILED = 'GET_ZKHOST_FAILED'

const fetchZkhost = clusterId => {
  const endpoint = `${API_CONFIG.MSA_API}${API_CONFIG.MSA_API_PREFIX}/clusters/${clusterId}/zookeeper/zkhost`
  return {
    [CALL_API]: {
      types: [ GET_ZKHOST_REQUEST,
        GET_ZKHOST_SUCCESS,
        GET_ZKHOST_FAILED ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}
export const getZkhost = clusterId => {
  return fetchZkhost(clusterId)
}

export const PUT_ZKHOST_REQUEST = 'PUT_ZKHOST_REQUEST'
export const PUT_ZKHOST_SUCCESS = 'PUT_ZKHOST_SUCCESS'
export const PUT_ZKHOST_FAILED = 'PUT_ZKHOST_FAILED'

const putZkhost = (clusterId, data) => {
  const endpoint = `${API_CONFIG.MSA_API}${API_CONFIG.MSA_API_PREFIX}/clusters/${clusterId}/zookeeper/zkhost?${toQuerystring(data)}`
  return {
    [CALL_API]: {
      types: [ PUT_ZKHOST_REQUEST,
        PUT_ZKHOST_SUCCESS,
        PUT_ZKHOST_FAILED ],
      endpoint,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}
export const setZkhost = (clusterId, data) => {
  return putZkhost(clusterId, data)
}

// 获取apm配置
export const GET_MSA_CONFIG_REQUEST = 'GET_MSA_CONFIG_REQUEST'
export const GET_MSA_CONFIG_SUCCESS = 'GET_MSA_CONFIG_SUCCESS'
export const GET_MSA_CONFIG_FAILURE = 'GET_MSA_CONFIG_FAILURE'

const fetchGlobalConfigByType = (clusterID, type, callback) => {
  const endpoint = `/configs/${type}`
  return {
    [CALL_API]: {
      types: [ GET_MSA_CONFIG_REQUEST,
        GET_MSA_CONFIG_SUCCESS,
        GET_MSA_CONFIG_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
    callback,
  }
}

export const getGlobalConfigByType = (clusterID, type, callback) => {
  return dispatch => dispatch(fetchGlobalConfigByType(clusterID, type, callback))
}
