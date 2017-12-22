/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance reducers for redux
 *
 * 2017-12-15
 * @author zhangpc
 */

import union from 'lodash/union'
import * as ActionTypes from '../../../actions/CSB/instanceService/group'
import { getQueryKey } from '../../../common/utils'

export const serviceGroups = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_GROUPS_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_GROUPS_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: union(state.ids, action.response.result.data.content),
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.GET_CSB_INSTANCE_SERVICE_GROUPS_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}
