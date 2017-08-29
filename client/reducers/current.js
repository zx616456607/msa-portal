/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Current reducers for redux
 *
 * 2017-08-29
 * @author zhangpc
 */

import * as ActionTypes from '../actions/current'

export default function current(state = { cluster: {}, user: {} }, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT:
      return {
        ...state,
        ...action.current,
      }
    case ActionTypes.CURRENT_USER_REQUEST:
      return {
        ...state,
        user: {
          isFetching: true,
        },
      }
    case ActionTypes.CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: {
          isFetching: false,
          info: action.response.result.data,
        },
      }
    case ActionTypes.CURRENT_USER_FAILURE:
      return {
        ...state,
        user: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}
