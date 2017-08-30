/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App aciton
 *
 * 2017-08-16
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
// import { toQuerystring } from '../common/utils'

export const APMS_REQUEST = 'APMS_REQUEST'
export const APMS_SUCCESS = 'APMS_SUCCESS'
export const APMS_FAILURE = 'APMS_FAILURE'

// Fetches a page of apms.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchApms = clusterID => ({
  clusterID,
  [CALL_API]: {
    types: [ APMS_REQUEST, APMS_SUCCESS, APMS_FAILURE ],
    endpoint: `/clusters/${clusterID}/apms`,
    schema: Schemas.APM_ARRAY_DATA,
  },
})

// Fetches a page of apms.
// Relies on Redux Thunk middleware.
export const loadApms = clusterID => dispatch => {
  return dispatch(fetchApms(clusterID))
}
