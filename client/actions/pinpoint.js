/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * PinPoint aciton
 *
 * 2017-08-29
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'

export const PINPOINT_APPS_REQUEST = 'PINPOINT_APPS_REQUEST'
export const PINPOINT_APPS_SUCCESS = 'PINPOINT_APPS_SUCCESS'
export const PINPOINT_APPS_FAILURE = 'PINPOINT_APPS_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPPApps = (clusterID, apmID) => ({
  apmID,
  [CALL_API]: {
    types: [ PINPOINT_APPS_REQUEST, PINPOINT_APPS_SUCCESS, PINPOINT_APPS_FAILURE ],
    endpoint: `/clusters/${clusterID}/apms/pinpoint/${apmID}/applications`,
    schema: Schemas.PP_APPS_ARRAY,
  },
})

// Fetches a page of pinpoint apps.
// Relies on Redux Thunk middleware.
export const loadPPApps = (clusterID, apmID) => dispatch => {
  return dispatch(fetchPPApps(clusterID, apmID))
}

export const SCATTER_DATA_REQUEST = 'SCATTER_DATA_REQUEST'
export const SCATTER_DATA_SUCCESS = 'SCATTER_DATA_SUCCESS'
export const SCATTER_DATA_FAILURE = 'SCATTER_DATA_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchScatterData = (clusterID, apmID, query) => ({
  apmID,
  query,
  [CALL_API]: {
    types: [ SCATTER_DATA_REQUEST, SCATTER_DATA_SUCCESS, SCATTER_DATA_FAILURE ],
    endpoint: `/clusters/${clusterID}/apms/pinpoint/${apmID}/scatterData?${toQuerystring(query)}`,
    schema: {},
  },
})

// Fetches a page of pinpoint apps.
// Relies on Redux Thunk middleware.
export const loadScatterData = (clusterID, apmID, query) => dispatch => {
  return dispatch(fetchScatterData(clusterID, apmID, query))
}

export const PINPOINT_MAP_REQUEST = 'PINPOINT_MAP_REQUEST'
export const PINPOINT_MAP_SUCCESS = 'PINPOINT_MAP_SUCCESS'
export const PINPOINT_MAP_FAILURE = 'PINPOINT_MAP_FAILURE'

// Fetches pinpoint map.
// Relies on the custom API middleware defined in ../middleware/api.js.

const fetchPinpointMap = (clusterID, apmID, query) => {
  let endpoint = `/clusters/${clusterID}/apms/pinpoint/${apmID}/serverMapData`
  if (query) {
    endpoint += `?${toQuerystring(query, null, null)}`
  }
  return {
    apmID,
    [CALL_API]: {
      types: [ PINPOINT_MAP_REQUEST, PINPOINT_MAP_SUCCESS, PINPOINT_MAP_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

// Fetches pinpoint map.
// Relies on Redux Thunk middleware.

export const loadPinpointMap = (clusterID, apmID, query) => dispatch => {
  return dispatch(fetchPinpointMap(clusterID, apmID, query))
}
