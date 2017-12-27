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

const { CSB_API_URL } = API_CONFIG

// 获取我订阅的服务列表
export const GET_MY_SUBSCRIBED_SERVICE_LIST_REQUEST = 'GET_MY_SUBSCRIBED_SERVICE_LIST_REQUEST'
export const GET_MY_SUBSCRIBED_SERVICE_LIST_SUCCESS = 'GET_MY_SUBSCRIBED_SERVICE_LIST_SUCCESS'
export const GET_MY_SUBSCRIBED_SERVICE_LIST_FALIURE = 'GET_MY_SUBSCRIBED_SERVICE_LIST_FALIURE'

const fetchGetMySubscribedServiceList = (instanceID, query) => {
  let endpoint = `${CSB_API_URL}/instances/${instanceID}/service-subscription`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
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
    serviceId,
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

