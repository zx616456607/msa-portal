/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Index aciton
 *
 * 2017-08-16
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'

export const APPS_REQUEST = 'APPS_REQUEST'
export const APPS_SUCCESS = 'APPS_SUCCESS'
export const APPS_FAILURE = 'APPS_FAILURE'

// Fetches a page of apps.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchApps = query => ({
  query,
  [CALL_API]: {
    types: [ APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE ],
    endpoint: `/apps${toQuerystring(query)}`,
    schema: Schemas.APP_ARRAY,
  },
})

// Fetches a page of apps.
// Relies on Redux Thunk middleware.
export const loadApps = query => dispatch => {
  return dispatch(fetchApps(query))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
})

export const SAVE_JWT = 'SAVE_JWT'

export const saveJwt = jwt => ({
  jwt,
  type: SAVE_JWT,
})
