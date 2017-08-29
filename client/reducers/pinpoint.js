/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * PinPoint reducers for redux
 *
 * 2017-08-29
 * @author zhangpc
 */

import union from 'lodash/union'
import * as ActionTypes from '../actions/pinpoint'

const apps = (state = {}, action) => {
  const { type, clusterId, ppId } = action
  switch (type) {
    case ActionTypes.PINPOINT_APPS_REQUEST:
      return {
        ...state,
        [clusterId]: {
          [ppId]: {
            isFetching: true,
          },
        },
      }
    case ActionTypes.PINPOINT_APPS_SUCCESS:
      return {
        ...state,
        [clusterId]: {
          [ppId]: {
            isFetching: false,
            ids: union(state.ids, action.response.result),
          },
        },
      }
    case ActionTypes.PINPOINT_APPS_FAILURE:
      return {
        ...state,
        [clusterId]: {
          [ppId]: {
            isFetching: false,
          },
        },
      }
    default:
      return state
  }
}

const pinpoint = (state = {
  apps: {},
}, action) => {
  return {
    apps: apps(state.apps, action),
  }
}

export default pinpoint
