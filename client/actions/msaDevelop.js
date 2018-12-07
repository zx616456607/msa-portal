/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDevelop aciton
 *
 * 2017-11-02
 * @author zhangxuan
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'

const { MSA_DEVELOP_API } = API_CONFIG

export const MSA_DEVELOP_DEPENDENCY_REQUEST = 'MSA_DEVELOP_DEPENDENCY_REQUEST'
export const MSA_DEVELOP_DEPENDENCY_SUCCESS = 'MSA_DEVELOP_DEPENDENCY_SUCCESS'
export const MSA_DEVELOP_DEPENDENCY_FAILURE = 'MSA_DEVELOP_DEPENDENCY_FAILURE'

const fetchLocalProjectDependency = () => {
  const endpoint = `${MSA_DEVELOP_API}/dependency`
  return {
    [CALL_API]: {
      types: [ MSA_DEVELOP_DEPENDENCY_REQUEST,
        MSA_DEVELOP_DEPENDENCY_SUCCESS,
        MSA_DEVELOP_DEPENDENCY_FAILURE ],
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
