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
import * as ActionTypes from '../actions/msaComponent'

export const sringcloudComponent = (state = {}, action) => {
  const { type, clusterID } = action
  switch (type) {
    case ActionTypes.MSACOMPONENT_LIST_REQUEST:
      return {
        ...state,
        [clusterID]: {
          isFetching: true,
        },
      }
    case ActionTypes.MSACOMPONENT_LIST_SUCCESS:
      return {
        ...state,
        [clusterID]: {
          isFetching: false,
          meta: union(state.ids, action.response.result.data.services),
        },
      }
    case ActionTypes.MSACOMPONENT_LIST_FAILURE:
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
