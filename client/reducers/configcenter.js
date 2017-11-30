/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * configcenter reducers for redux
 *
 * 2017-11-30
 * @author zhaoyb
 */

import * as ActionTypes from '../actions/configCenter'

export const configCenter = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.CENTER_SERVICE_INFO_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.CENTER_SERVICE_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.CENTER_SERVICE_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
