/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance aciton
 *
 * 2017-12-11
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'

export const CSB_INSTANCES_REQUEST = 'CSB_INSTANCES_REQUEST'
export const CSB_INSTANCES_SUCCESS = 'CSB_INSTANCES_SUCCESS'
export const CSB_INSTANCES_FAILURE = 'CSB_INSTANCES_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
export const fetchInstances = (clusterID, userID, query) => ({
  clusterID,
  query,
  [CALL_API]: {
    types: [
      CSB_INSTANCES_REQUEST,
      CSB_INSTANCES_SUCCESS,
      CSB_INSTANCES_FAILURE,
    ],
    endpoint: `/clusters/${clusterID}/instance/${userID}?${toQuerystring(query)}`,
    schema: Schemas.CSB_INSNTANCES_LIST_DATA,
  },
})

// Fetches a page of CSB instances.
// Relies on Redux Thunk middleware.
export const getInstances = (clusterID, userID, query) => dispatch => {
  return dispatch(fetchInstances(clusterID, userID, query))
}
