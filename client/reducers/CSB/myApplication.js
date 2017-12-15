/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MyApplication reducers for redux
 *
 * 2017-12-15
 * @author zhaoyb
 */

import * as ActionTypes from '../../actions/CSB/myApplication'

export const myApplication = (state = {}, action) => {
  const { type, clusterID } = action
  switch (type) {
    case ActionTypes.FETCH_APPLY_LIST_REQUEST:
      return {
        ...state,
        [clusterID]: {
          isFetching: true,
        },
      }
    case ActionTypes.FETCH_APPLY_LIST_SUCCESS:
      return {
        ...state,
        [clusterID]: {
          isFetching: false,
          meta: action.response.result.data,
        },
      }
    case ActionTypes.FETCH_APPLY_LIST_FAILURE:
      return {
        ...state,
        [clusterID]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}
