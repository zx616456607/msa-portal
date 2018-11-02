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

import union from 'lodash/union'
import * as ActionTypes from '../../actions/CSB/myApplication'
import { getQueryKey } from '../../common/utils'

export const myApplication = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_APPLY_LIST_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_APPLY_LIST_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: key === 'filter=status-eq-1&flag=1&page=1&size=10' ?
            action.response.result.data.content
            :
            union(state.ids, action.response.result.data.content),
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.FETCH_APPLY_LIST_FAILURE:
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
