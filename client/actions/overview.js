/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * overview.js page
 *
 * @author zhangtao
 * @date Tuesday December 18th 2018
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'

const { MSA_DEVELOP_API } = API_CONFIG

// 治理Spring-Cloud
// 服务数量

export const SC_SERVIE_NUM__REQUEST = 'SC_SERVIE_NUM__REQUEST'
export const SC_SERVIE_NUM_SUCCESS = 'SC_SERVIE_NUM_SUCCESS'
export const SC_SERVIE_NUM_FAILURE = 'SC_SERVIE_NUM_FAILURE'

const fetchLocalProjectDependency = () => {
  const endpoint = `${MSA_DEVELOP_API}/dependency`
  return {
    [CALL_API]: {
      types: [ SC_SERVIE_NUM__REQUEST,
        SC_SERVIE_NUM_SUCCESS,
        SC_SERVIE_NUM_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getLocalProjectDependency() {
  return dispatch => {
    return dispatch(fetchLocalProjectDependency())
  }
}
