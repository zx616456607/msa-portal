/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CSB cascading Link rules reducers for redux
 *
 * 2018-1-18
 * @author zhangcz
 */

import * as ActionTypes from '../../actions/CSB/cascadingLinkRules'

export function cascadingLinkRule(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_CSB_CASCADING_LINK_RULES_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_CSB_CASCADING_LINK_RULES_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.result.data.content,
        totalElements: action.response.result.data.totalElements,
        size: action.response.result.data.size,
      }
    case ActionTypes.GET_CSB_CASCADING_LINK_RULES_LIST_FALIURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

