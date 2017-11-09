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

function gatewayList(state, action) {
  switch (action.type) {
    case ActionTyps.GATEWAY_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTyps.GATEWAY_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTyps.GATEWAY_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const gateway = (state = {
  gatewayList: {},
}, action) => {
  return {
    gatewayList: gatewayList(state.gatewayList, action),
  }
}

export default gateway
