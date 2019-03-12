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
  return {
    [CALL_API]: {
      types: [GET_API_LIST_REQUEST, GET_API_LIST_SUCCESS, GET_API_LIST_FAILURE],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/gateway/api?${toQuerystring(query)}`,
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

