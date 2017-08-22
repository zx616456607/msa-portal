/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Auth reducers for redux
 *
 * 2017-08-22
 * @author zhangpc
 */

import union from 'lodash/union'
import * as ActionTypes from '../actions/apm'

export const queryApms = (state = {}, action) => {
  const { type, clusterId } = action
  switch (type) {
    case ActionTypes.APMS_REQUEST:
      return {
        ...state,
        [clusterId]: Object.assign({}, state[clusterId], {
          isFetching: true,
        }),
      }
    case ActionTypes.APMS_SUCCESS:
      return {
        ...state,
        [clusterId]: {
          isFetching: false,
          ids: union(state.ids, action.response.result.data.apms),
        },
      }
    case ActionTypes.APMS_FAILURE:
      return {
        ...state,
        [clusterId]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}
