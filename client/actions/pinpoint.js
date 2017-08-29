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
// import { toQuerystring } from '../common/utils'

export const PINPOINT_APPS_REQUEST = 'PINPOINT_APPS_REQUEST'
export const PINPOINT_APPS_SUCCESS = 'PINPOINT_APPS_SUCCESS'
export const PINPOINT_APPS_FAILURE = 'PINPOINT_APPS_FAILURE'

// Fetches a page of pinpoint apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPPApps = (clusterID, ppID) => ({
  clusterID,
  ppID,
  [CALL_API]: {
    types: [ PINPOINT_APPS_REQUEST, PINPOINT_APPS_SUCCESS, PINPOINT_APPS_FAILURE ],
    endpoint: `/clusters/${clusterID}/apms/pinpoint/${ppID}/applications`,
    schema: Schemas.PP_APPS_ARRAY,
  },
})

// Fetches a page of pinpoint apps.
// Relies on Redux Thunk middleware.
export const loadPPApps = (clusterID, ppID) => dispatch => {
  return dispatch(fetchPPApps(clusterID, ppID))
}
