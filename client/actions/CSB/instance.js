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

import { CALL_API } from '../../middleware/api'
// import { Schemas } from '../../middleware/schemas'
import { toQuerystring } from '../../common/utils'
import {
  API_CONFIG,
  CSB_PUBLIC_INSTANCES_FLAG,
  CSB_AVAILABLE_INSTANCES_FLAG,
  CSB_OM_INSTANCES_FLAG,
} from '../../constants'

const { CSB_API_URL } = API_CONFIG

export const CSB_AVAILABLE_INSTANCES_REQUEST = 'CSB_AVAILABLE_INSTANCES_REQUEST'
export const CSB_AVAILABLE_INSTANCES_SUCCESS = 'CSB_AVAILABLE_INSTANCES_SUCCESS'
export const CSB_AVAILABLE_INSTANCES_FAILURE = 'CSB_AVAILABLE_INSTANCES_FAILURE'

export const CSB_OM_INSTANCES_REQUEST = 'CSB_OM_INSTANCES_REQUEST'
export const CSB_OM_INSTANCES_SUCCESS = 'CSB_OM_INSTANCES_SUCCESS'
export const CSB_OM_INSTANCES_FAILURE = 'CSB_OM_INSTANCES_FAILURE'

export const CSB_PUBLIC_INSTANCES_REQUEST = 'CSB_PUBLIC_INSTANCES_REQUEST'
export const CSB_PUBLIC_INSTANCES_SUCCESS = 'CSB_PUBLIC_INSTANCES_SUCCESS'
export const CSB_PUBLIC_INSTANCES_FAILURE = 'CSB_PUBLIC_INSTANCES_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
export const fetchInstances = (clusterID, query = {}) => {
  let types
  switch (query.flag) {
    case CSB_AVAILABLE_INSTANCES_FLAG:
      types = [
        CSB_AVAILABLE_INSTANCES_REQUEST,
        CSB_AVAILABLE_INSTANCES_SUCCESS,
        CSB_AVAILABLE_INSTANCES_FAILURE,
      ]
      break
    case CSB_OM_INSTANCES_FLAG:
      types = [
        CSB_OM_INSTANCES_REQUEST,
        CSB_OM_INSTANCES_SUCCESS,
        CSB_OM_INSTANCES_FAILURE,
      ]
      break
    case CSB_PUBLIC_INSTANCES_FLAG:
    default:
      types = [
        CSB_PUBLIC_INSTANCES_REQUEST,
        CSB_PUBLIC_INSTANCES_SUCCESS,
        CSB_PUBLIC_INSTANCES_FAILURE,
      ]
      break
  }
  return {
    clusterID,
    query,
    [CALL_API]: {
      types,
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

// Fetches a page of CSB instances.
// Relies on Redux Thunk middleware.
export const getInstances = (clusterID, query) =>
  dispatch => dispatch(fetchInstances(clusterID, query))
