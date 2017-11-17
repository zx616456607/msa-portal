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

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_FAILURE = 'AUTH_FAILURE'

// Get Auth info.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchAuth = ({ username, token, jwt }) => {
  let headers
  if (username && token) {
    headers = {
      username,
      Authorization: `token ${token}`,
    }
  } else if (jwt) {
    headers = {
      Authorization: `Bearer ${jwt}`,
    }
  }
  return {
    [CALL_API]: {
      types: [ AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE ],
      endpoint: '/auth',
      schema: Schemas.AUTH_DATA,
      options: {
        headers,
      },
    },
  }
}

// Fetches Auth info.
// Relies on Redux Thunk middleware.
export const getAuth = ({ username, token, jwt }) => dispatch => {
  return dispatch(fetchAuth(({ username, token, jwt })))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
})
