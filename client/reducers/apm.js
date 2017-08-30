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

export const queryApms = (state = {}, action) => {
  const { type, clusterID } = action
  switch (type) {
    case ActionTypes.APMS_REQUEST:
      return {
        ...state,
        [clusterID]: Object.assign({}, state[clusterID], {
          isFetching: true,
        }),
      }
    case ActionTypes.APMS_SUCCESS:
      return {
        ...state,
        [clusterID]: {
          isFetching: false,
          ids: union(state.ids, action.response.result.data.apms),
        },
      }
    case ActionTypes.APMS_FAILURE:
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
