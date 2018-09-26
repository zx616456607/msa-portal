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
  const project = action.project || DEFAULT
  switch (type) {
    case ActionTypes.APMS_REQUEST:
      return {
        ...state,
        [project]: Object.assign({}, state[project], {
          [clusterID]: {
            isFetching: true,
          },
        }),
      }
    case ActionTypes.APMS_SUCCESS:
      return {
        ...state,
        [project]: Object.assign({}, state[project], {
          [clusterID]: {
            isFetching: false,
            ids: union(state.ids, action.response.result.data.apms),
          },
        }),
      }
    case ActionTypes.APMS_FAILURE:
      return {
        ...state,
        [project]: Object.assign({}, state[project], {
          [clusterID]: {
            isFetching: false,
          },
        }),
      }
    default:
      return state
  }
}
