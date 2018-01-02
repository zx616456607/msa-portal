/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Subscribed Service aciton
 *
 * 2017-12-25
 * @author zhangcz
 */

import { CALL_API } from '../../../middleware/api'
import { Schemas } from '../../../middleware/schemas'
import { toQuerystring } from '../../../common/utils'
import { API_CONFIG } from '../../../constants'
import cloneDeep from 'lodash/cloneDeep'

const { CSB_API_URL } = API_CONFIG

// 获取我订阅的服务列表
export const GET_MY_SUBSCRIBED_SERVICE_LIST_REQUEST = 'GET_MY_SUBSCRIBED_SERVICE_LIST_REQUEST'
export const GET_MY_SUBSCRIBED_SERVICE_LIST_SUCCESS = 'GET_MY_SUBSCRIBED_SERVICE_LIST_SUCCESS'
export const GET_MY_SUBSCRIBED_SERVICE_LIST_FALIURE = 'GET_MY_SUBSCRIBED_SERVICE_LIST_FALIURE'

const fetchGetMySubscribedServiceList = (instanceID, query) => {
  let endpoint = `${CSB_API_URL}/instances/${instanceID}/service-subscription`
  if (query) {
    const _query = cloneDeep(query)
    if (query.page) {
      _query.page = query.page - 1
    }
    endpoint += `?${toQuerystring(_query)}`
  }
  return {
    instanceID,
    [CALL_API]: {
      types: [
        GET_MY_SUBSCRIBED_SERVICE_LIST_REQUEST,
        GET_MY_SUBSCRIBED_SERVICE_LIST_SUCCESS,
        GET_MY_SUBSCRIBED_SERVICE_LIST_FALIURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_MY_SUBSCRIBED_SERVICES_LIST_DATA,
    },
  }
}

export const getMySubscribedServiceList = (instanceID, query) => {
  return dispatch => dispatch(fetchGetMySubscribedServiceList(instanceID, query))
}

// 查看服务文档
export const GET_SERVICE_API_DOC_REQUEST = 'GET_SERVICE_API_DOC_REQUEST'
export const GET_SERVICE_API_DOC_SUCCESS = 'GET_SERVICE_API_DOC_SUCCESS'
export const GET_SERVICE_API_DOC_FALIURE = 'GET_SERVICE_API_DOC_FALIURE'

const fetchGetServiceApiDoc = (instanceID, serviceId) => {
  return {
    [CALL_API]: {
      types: [
        GET_SERVICE_API_DOC_REQUEST,
        GET_SERVICE_API_DOC_SUCCESS,
        GET_SERVICE_API_DOC_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/services/${serviceId}`,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_SERVICE_API_DOC,
    },
  }
}

export const getServiceApiDoc = (instanceID, serviceId) => {
  return dispatch => dispatch(fetchGetServiceApiDoc(instanceID, serviceId))
}

// 退订服务
export const GET_UNSUBSCRIBE_SERVICE_REQUEST = 'GET_UNSUBSCRIBE_SERVICEREQUEST'
export const GET_UNSUBSCRIBE_SERVICE_SUCCESS = 'GET_UNSUBSCRIBE_SERVICE_SUCCESS'
export const GET_UNSUBSCRIBE_SERVICE_FALIURE = 'GET_UNSUBSCRIBE_SERVICE_FALIURE'

const fetchGetUnsubscribeService = (instanceID, requestId) => {
  return {
    [CALL_API]: {
      types: [
        GET_UNSUBSCRIBE_SERVICE_REQUEST,
        GET_UNSUBSCRIBE_SERVICE_SUCCESS,
        GET_UNSUBSCRIBE_SERVICE_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/service-subscription/${requestId}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const unsubscriveService = (instanceID, requestId) => {
  return dispatch => dispatch(fetchGetUnsubscribeService(instanceID, requestId))
}

// 修改绑定 IP
export const PUT_EDIT_SERVICE_BIND_IP_REQUEST = 'PUT_EDIT_SERVICE_BIND_IP_REQUEST'
export const PUT_EDIT_SERVICE_BIND_IP_SUCCESS = 'PUT_EDIT_SERVICE_BIND_IP_SUCCESS'
export const PUT_EDIT_SERVICE_BIND_IP_FALIURE = 'PUT_EDIT_SERVICE_BIND_IP_FALIURE'

const fetchEditServiceBindIp = (instanceID, serviceId) => {
  return {
    [CALL_API]: {
      types: [
        PUT_EDIT_SERVICE_BIND_IP_REQUEST,
        PUT_EDIT_SERVICE_BIND_IP_SUCCESS,
        PUT_EDIT_SERVICE_BIND_IP_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/services/${serviceId}`,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_SERVICE_API_DOC,
    },
  }
}

export const editServiceBindIp = (instanceID, serviceId) => {
  return dispatch => dispatch(fetchEditServiceBindIp(instanceID, serviceId))
}
