/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * InstanceService reducers for redux
 *
 * 2017-12-22
 * @author zhaoyb
 */
import union from 'lodash/union'
import * as ActionTypes from '../../../actions/CSB/instanceService'
import { getQueryKey } from '../../../common/utils'

export const publishedService = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_RELEASE_INSTANCE_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.CSB_RELEASE_INSTANCE_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: union(state.ids, action.response.result.data.content),
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.CSB_RELEASE_INSTANCE_FAILURE:
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
export const subscribeService = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_SUBSCRIBE_INSTANCE_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.CSB_SUBSCRIBE_INSTANCE_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: union(state.ids, action.response.result.data.content),
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.CSB_SUBSCRIBE_INSTANCE_FAILURE:
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

