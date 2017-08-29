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

export default function current(state = { cluster: {} }, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT:
      return {
        ...state,
        ...action.current,
      }
    default:
      return state
  }
}
