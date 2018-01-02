/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service Subscription Approval aciton
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
export const GET_SERVICE_SUBSCRIBE_APPROVE_LIST_REQUEST = 'GET_SERVICE_SUBSCRIBE_APPROVE_LIST_REQUEST'
export const GET_SERVICE_SUBSCRIBE_APPROVE_LIST_SUCCESS = 'GET_SERVICE_SUBSCRIBE_APPROVE_LIST_SUCCESS'
export const GET_SERVICE_SUBSCRIBE_APPROVE_LIST_FALIURE = 'GET_SERVICE_SUBSCRIBE_APPROVE_LIST_FALIURE'

const fetchGetServiceSubscribeApproveList = (instanceID, query) => {
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
        GET_SERVICE_SUBSCRIBE_APPROVE_LIST_REQUEST,
        GET_SERVICE_SUBSCRIBE_APPROVE_LIST_SUCCESS,
        GET_SERVICE_SUBSCRIBE_APPROVE_LIST_FALIURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_SERVICE_SUBSCRIBE_APPROVE_LIST_DATA,
    },
  }
}

export const getServiceSubscribeApproveList = (instanceID, query) => {
  return dispatch => dispatch(fetchGetServiceSubscribeApproveList(instanceID, query))
}

// 通过 || 拒绝 服务申请
export const PUT_SERVICE_APPROVAE_REQUEST = 'PUT_SERVICE_APPROVAE_REQUEST'
export const PUT_SERVICE_APPROVAE_SUCCESS = 'PUT_SERVICE_APPROVAE_SUCCESS'
export const PUT_SERVICE_APPROVAE_FALIURE = 'PUT_SERVICE_APPROVAE_FALIURE'

const fetchPutServiceApprove = (instanceID, requestId, body) => {
  return {
    instanceID,
    [CALL_API]: {
      types: [
        PUT_SERVICE_APPROVAE_REQUEST,
        PUT_SERVICE_APPROVAE_SUCCESS,
        PUT_SERVICE_APPROVAE_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/service-subscription/${requestId}/status`,
      options: {
        method: 'PUT',
        body,
      },
      schema: Schemas.CSB_INSTANCE_SERVICE_SUBSCRIBE_APPROVE_LIST_DATA,
    },
  }
}

export const putServiceApprove = (instanceID, requestId, body) => {
  return dispatch => dispatch(fetchPutServiceApprove(instanceID, requestId, body))
}
