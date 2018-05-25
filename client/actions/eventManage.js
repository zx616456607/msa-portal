/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Event action
 *
 * @author zhangxuan
 * @date 2018-05-24
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { API_CONFIG } from '../constants'
import { toQuerystring } from '../common/utils'

const { MSA_API_URL } = API_CONFIG

export const EVENT_LIST_REQUEST = 'EVENT_LIST_REQUEST'
export const EVENT_LIST_SUCCESS = 'EVENT_LIST_SUCCESS'
export const EVENT_LIST_FAILURE = 'EVENT_LIST_FAILURE'

const fetchEventList = (clusterID, query, callback) => {
  let endpoint = `${MSA_API_URL}/clusters/${clusterID}/discovery/eventlog/list`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        EVENT_LIST_REQUEST,
        EVENT_LIST_SUCCESS,
        EVENT_LIST_FAILURE,
      ],
      endpoint,
      schema: Schemas.MSA_EVENT_LIST_DATA,
    },
    callback,
  }
}

export const eventLogList = (clusterID, query, callback) =>
  dispatch => dispatch(fetchEventList(clusterID, query, callback))
