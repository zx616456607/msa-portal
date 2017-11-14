/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Gateway reducers for redux
 *
 * 2017-11-06
 * @author zhangcz
 */

import * as ActionTyps from '../actions/gateway'

function policesList(state, action) {
  switch (action.type) {
    case ActionTyps.GET_GATEWAY_POLICIES_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTyps.GET_GATEWAY_POLICIES_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        code: action.response.result.code,
        status: action.response.result.status,
        ...action.response.result.data,
      }
    case ActionTyps.GET_GATEWAY_POLICIES_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const gateway = (state = {
  policesList: {},
}, action) => {
  return {
    policesList: policesList(state.policesList, action),
  }
}

export default gateway
