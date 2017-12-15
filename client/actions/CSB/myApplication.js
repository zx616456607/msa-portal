/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB MyApplication aciton
 *
 * 2017-12-15
 * @author zhaoyb
 */

import { CALL_API } from '../../middleware/api'
import { toQuerystring } from '../../common/utils'
import { API_CONFIG } from '../../constants'
import cloneDeep from 'lodash/cloneDeep'

const { CSB_API_URL } = API_CONFIG

export const FETCH_APPLY_LIST_REQUEST = 'FETCH_APPLY_LIST_REQUEST'
export const FETCH_APPLY_LIST_SUCCESS = 'FETCH_APPLY_LIST_SUCCESS'
export const FETCH_APPLY_LIST_FAILURE = 'FETCH_APPLY_LIST_FAILURE'

const fetchApplyList = (clusterID, query = {}) => {
  const _query = cloneDeep(query)
  const { page } = _query
  if (page !== undefined) {
    _query.page = page - 1 // for api page start from 0
  }
  return {
    clusterID,
    query,
    [CALL_API]: {
      types: [ FETCH_APPLY_LIST_REQUEST, FETCH_APPLY_LIST_SUCCESS, FETCH_APPLY_LIST_FAILURE ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/request?${toQuerystring(_query)}`,
      schema: {},
    },
  }
}

export const loadApply = (clusterID, query) => dispatch => {
  return dispatch(fetchApplyList(clusterID, query))
}


export const DELTE_APPLY_REQUEST = 'DELTE_APPLY_REQUEST'
export const DELTE_APPLY_SUCCESS = 'DELTE_APPLY_SUCCESS'
export const DELTE_APPLY_FAILURE = 'DELTE_APPLY_FAILURE'

const delApply = (clusterID, id) => {
  return {
    id,
    clusterID,
    [CALL_API]: {
      types: [ DELTE_APPLY_REQUEST, DELTE_APPLY_SUCCESS, DELTE_APPLY_FAILURE ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/request/${id}`,
      schema: {},
    },
  }
}

export const removeApply = (clusterID, id) => dispatch => {
  return dispatch(delApply(clusterID, id))
}


export const UPDATE_APPLY_REQUEST = 'UPDATE_APPLY_REQUEST'
export const UPDATE_APPLY_SUCCESS = 'UPDATE_APPLY_SUCCESS'
export const UPDATE_APPLY_FAILURE = 'UPDATE_APPLY_FAILURE'

const fetchUpdateApply = (clusterID, id, body) => {
  return {
    id,
    clusterID,
    [CALL_API]: {
      types: [ UPDATE_APPLY_REQUEST, UPDATE_APPLY_SUCCESS, UPDATE_APPLY_FAILURE ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance/request/${id}`,
      schema: {},
      options: {
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateApply = (clusterID, id, body) => dispatch => {
  return dispatch(fetchUpdateApply(clusterID, id, body))
}
