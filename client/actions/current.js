/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Current aciton
 *
 * 2017-08-29
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { toQuerystring } from '../common/utils'

export const SET_CURRENT = 'SET_CURRENT'

export function setCurrent(current) {
  return {
    current,
    type: SET_CURRENT,
  }
}

export const CURRENT_USER_REQUEST = 'CURRENT_USER_REQUEST'
export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const CURRENT_USER_FAILURE = 'CURRENT_USER_FAILURE'

// Get current user info.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCurrentUser = userID => {
  return {
    [CALL_API]: {
      types: [ CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE ],
      endpoint: `/users/${userID}`,
      schema: {},
    },
  }
}

// Fetches current user info.
// Relies on Redux Thunk middleware.
export const getCurrentUser = userID => dispatch => {
  return dispatch(fetchCurrentUser(userID))
}

export const USER_PROJECTS_REQUEST = 'USER_PROJECTS_REQUEST'
export const USER_PROJECTS_SUCCESS = 'USER_PROJECTS_SUCCESS'
export const USER_PROJECTS_FAILURE = 'USER_PROJECTS_FAILURE'

// Get projects of user.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUserProjects = (userID, query) => {
  return {
    [CALL_API]: {
      types: [ USER_PROJECTS_REQUEST, USER_PROJECTS_SUCCESS, USER_PROJECTS_FAILURE ],
      endpoint: `/users/${userID}/projects?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

// Fetches projects of user.
// Relies on Redux Thunk middleware.
export const getUserProjects = (userID, query) => dispatch => {
  return dispatch(fetchUserProjects(userID, query))
}
