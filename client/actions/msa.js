/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa aciton
 *
 * 2017-11-02
 * @author zhangxuan
 */

import { CALL_API } from '../middleware/api'
import { SPRING_CLOUD_URL } from '../constants'

export const MSA_LIST_REQUEST = 'MSA_LIST_REQUEST'
export const MSA_LIST_SUCCESS = 'MSA_LIST_SUCCESS'
export const MSA_LIST_FAILURE = 'MSA_LIST_FAILURE'

// Fetches a page of msa.
const fetchMsaList = clusterID => ({
  [CALL_API]: {
    types: [ MSA_LIST_REQUEST, MSA_LIST_SUCCESS, MSA_LIST_FAILURE ],
    endpoint: `${SPRING_CLOUD_URL}/clusters/${clusterID}/discovery/services`,
    schema: {},
  },
})

export function getMsaList(clusterID) {
  return dispatch => {
    return dispatch(fetchMsaList(clusterID))
  }
}
