/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Plubic service aciton
 *
 * 2017-12-29
 * @author zhangcz
 */


import { CALL_API } from '../../../middleware/api'
import { Schemas } from '../../../middleware/schemas'
import { toQuerystring } from '../../../common/utils'
import { API_CONFIG } from '../../../constants'
import cloneDeep from 'lodash/cloneDeep'

const { CSB_API_URL } = API_CONFIG

// 获取公开服务列表
export const GET_PUBLIC_SERVICE_LIST_REQUEST = 'GET_PUBLIC_SERVICE_LIST_REQUEST'
export const GET_PUBLIC_SERVICE_LIST_SUCCESS = 'GET_PUBLIC_SERVICE_LIST_SUCCESS'
export const GET_PUBLIC_SERVICE_LIST_FALIURE = 'GET_PUBLIC_SERVICE_LIST_FALIURE'

const fetchGetPublicServiceList = (instanceID, query) => {
  let endpoint = `${CSB_API_URL}/instances/${instanceID}/services/public`
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
        GET_PUBLIC_SERVICE_LIST_REQUEST,
        GET_PUBLIC_SERVICE_LIST_SUCCESS,
        GET_PUBLIC_SERVICE_LIST_FALIURE,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_SERVICE_LIST_DATA,
    },
  }
}
export const getPublicServiceList = (instanceID, query) => {
  return dispatch => dispatch(fetchGetPublicServiceList(instanceID, query))
}
