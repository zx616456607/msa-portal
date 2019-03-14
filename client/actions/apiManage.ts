/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 *
 * action of apiManage
 *
 * 2019-03-11
 * @author zhouhaitao
 */
import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'

const { MSA_API_URL } = API_CONFIG

export const CREATE_API_REQUEST = 'CREATE_API_REQUEST'
export const CREATE_API_SUCCESS = 'CREATE_API_SUCCESS'
export const CREATE_API_FAILURE = 'CREATE_API_FAILURE'
const createApiRequest = (clusterId:string, body:object) => {
  return {
    [CALL_API]: {
      types: [CREATE_API_REQUEST, CREATE_API_SUCCESS, CREATE_API_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api`,
      options: {
        method: 'POST',
        body,
      },
      schema: {}
    }
  }
}
export const createApi = (clusterId:string, body:object) => dispatch => dispatch(createApiRequest(clusterId,body))

export const GET_API_LIST_REQUEST = 'GET_API_LIST_REQUEST'
export const GET_API_LIST_SUCCESS = 'GET_API_LIST_SUCCESS'
export const GET_API_LIST_FAILURE = 'GET_API_LIST_FAILURE'
const fetchApiList = (clusterId:string, query:object) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterId}/gateway/api?${toQuerystring(query)}`
  if (query.apiGroupId) {
    endpoint = `${MSA_API_URL}/clusters/${clusterId}/gateway/apigroup/${query.apiGroupId}/apis`
  }
  return {
    [CALL_API]: {
      types: [GET_API_LIST_REQUEST, GET_API_LIST_SUCCESS, GET_API_LIST_FAILURE],
      endpoint,
      schema: {}
    }
  }
}
export const getApiList = (clusterId:string, query:object) => dispatch => dispatch(fetchApiList(clusterId,query))

export const DELETE_API_REQUEST = 'DELETE_API_REQUEST'
export const DELETE_API_SUCCESS = 'DELETE_API_SUCCESS'
export const DELETE_API_FAILURE = 'DELETE_API_FAILURE'
const deleteApiRequest = (clusterId:string, id:string) => {
  return {
    [CALL_API]: {
      types: [DELETE_API_REQUEST, DELETE_API_SUCCESS, DELETE_API_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api/${id}`,
      options: {
        method: 'DELETE',
      },
      schema: {}
    }
  }
}
export const deleteApi = (clusterId:string, id:string) => dispatch => dispatch(deleteApiRequest(clusterId,id))

export const PUBLISH_API_REQUEST = 'PUBLISH_API_REQUEST'
export const PUBLISH_API_SUCCESS = 'PUBLISH_API_SUCCESS'
export const PUBLISH_API_FAILURE = 'PUBLISH_API_FAILURE'
const publishApiRequest = (clusterId:string, id:string, env:string, body:object) => {
  return {
    [CALL_API]: {
      types: [PUBLISH_API_REQUEST, PUBLISH_API_SUCCESS, PUBLISH_API_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api/${id}/publish/${env}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {}
    }
  }
}
export const publishApi = (clusterId:string, id:string, env:string, body:object) => dispatch => dispatch(publishApiRequest(clusterId,id,env, body))

export const GET_API_DETAIL_REQUEST = 'GET_API_DETAIL_REQUEST'
export const GET_API_DETAIL_SUCCESS = 'GET_API_DETAIL_SUCCESS'
export const GET_API_DETAIL_FAILURE = 'GET_API_DETAIL_FAILURE'
const fetchApiDetail = (clusterId:string, id:string) => {
  return {
    [CALL_API]: {
      types: [GET_API_DETAIL_REQUEST, GET_API_DETAIL_SUCCESS, GET_API_DETAIL_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api/${id}`,
      schema: {}
    }
  }
}
export const getApiDetail = (clusterId:string, id:string) => dispatch => dispatch(fetchApiDetail(clusterId,id))

export const UPDATE_API_REQUEST = 'UPDATE_API_REQUEST'
export const UPDATE_API_SUCCESS = 'UPDATE_API_SUCCESS'
export const UPDATE_API_FAILURE = 'UPDATE_API_FAILURE'
const updateApiRequest = (clusterId:string, id:string, body:string) => {
  return {
    [CALL_API]: {
      types: [UPDATE_API_REQUEST, UPDATE_API_SUCCESS, UPDATE_API_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api/${id}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {}
    }
  }
}
export const updateApi = (clusterId:string, id:string, body:string) => dispatch => dispatch(updateApiRequest(clusterId,id,body))

export const DEBUG_API_REQUEST = 'DEBUG_API_REQUEST'
export const DEBUG_API_SUCCESS = 'DEBUG_API_SUCCESS'
export const DEBUG_API_FAILURE = 'DEBUG_API_FAILURE'
const debugApiRequest = (clusterId:string, body:string) => {
  return {
    [CALL_API]: {
      types: [DEBUG_API_REQUEST, DEBUG_API_SUCCESS, DEBUG_API_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/test`,
      options: {
        method: 'POST',
        body,
      },
      schema: {}
    }
  }
}
export const debugApi = (clusterId:string, body:string) => dispatch => dispatch(debugApiRequest(clusterId,body))

export const GET_PUBLISH_ENV_REQUEST = 'GET_PUBLISH_ENV_REQUEST'
export const GET_PUBLISH_ENV_SUCCESS = 'GET_PUBLISH_ENV_SUCCESS'
export const GET_PUBLISH_ENV_FAILURE = 'GET_PUBLISH_ENV_FAILURE'
const fetchPublishEnv = (clusterId:string) => {
  return {
    [CALL_API]: {
      types: [GET_PUBLISH_ENV_REQUEST, GET_PUBLISH_ENV_SUCCESS, GET_PUBLISH_ENV_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/env/available`,
      schema: {}
    }
  }
}
export const getPublishEnv = (clusterId:string) => dispatch => dispatch(fetchPublishEnv(clusterId))

export const OFFLINE_REQUEST = 'OFFLINE_REQUEST'
export const OFFLINE_SUCCESS = 'OFFLINE_SUCCESS'
export const OFFLINE_FAILURE = 'OFFLINE_FAILURE'
const offlineApiRequest = (clusterId:string, id: string, envId: string) => {
  return {
    [CALL_API]: {
      types: [OFFLINE_REQUEST, OFFLINE_SUCCESS, OFFLINE_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api/${id}/offline/${envId}`,
      schema: {}
    }
  }
}
export const offlineApi = (clusterId:string, id:string, envId:string) => dispatch => dispatch(fetchPublishEnv(clusterId, id, envId))
