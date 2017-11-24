/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * SrringCloud reducers for redux
 *
 * 2017-11-23
 * @author zhaoyb
 */

import union from 'lodash/union'
import * as ActionTypes from '../actions/msaConfig'
import { DEFAULT } from '../constants'

export const querySringCloud = (state = {}, action) => {
  const { type, clusterID } = action
  const namespace = action.namespace || DEFAULT
  switch (type) {
    case ActionTypes.SPRINGCLOUD_REQUEST:
      return {
        ...state,
        [namespace]: Object.assign({}, state[namespace], {
          [clusterID]: {
            isFetching: true,
          },
        }),
      }
    case ActionTypes.SPRINGCLOUD_SUCCESS:
      return {
        ...state,
        [namespace]: Object.assign({}, state[namespace], {
          [clusterID]: {
            isFetching: false,
            ids: union(state.ids, action.response.result.data.springclouds),
          },
        }),
      }
    case ActionTypes.SPRINGCLOUD_FAILURE:
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
