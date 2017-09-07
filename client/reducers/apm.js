/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm reducers for redux
 *
 * 2017-08-22
 * @author zhangpc
 */

import union from 'lodash/union'
import * as ActionTypes from '../actions/apm'
import { DEFAULT } from '../constants'

export const queryApms = (state = {}, action) => {
  const { type, clusterID } = action
  const namespace = action.namespace || DEFAULT
  switch (type) {
    case ActionTypes.APMS_REQUEST:
      return {
        ...state,
        [namespace]: Object.assign({}, state[namespace], {
          [clusterID]: {
            isFetching: true,
          },
        }),
      }
    case ActionTypes.APMS_SUCCESS:
      return {
        ...state,
        [namespace]: Object.assign({}, state[namespace], {
          [clusterID]: {
            isFetching: false,
            ids: union(state.ids, action.response.result.data.apms),
          },
        }),
      }
    case ActionTypes.APMS_FAILURE:
      return {
        ...state,
        [namespace]: Object.assign({}, state[namespace], {
          [clusterID]: {
            isFetching: false,
          },
        }),
      }
    default:
      return state
  }
}
