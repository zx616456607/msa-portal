/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance consumer voucher for redux
 *
 * 2017-12-15
 * @author zhangpc
 */

import * as ActionTypes from '../../../actions/CSB/instanceService/consumerVouchers'

export const consumerVouchers = (state = {}, action) => {
  const { instanceID, type } = action
  switch (type) {
    case ActionTypes.GET_CONSUMER_VOUCHERS_LIST_REQUEST:
      return {
        ...state,
        [instanceID]: Object.assign({}, state[instanceID], {
          isFetching: true,
        }),
      }
    case ActionTypes.GET_CONSUMER_VOUCHERS_LIST_SUCCESS:
      return {
        ...state,
        [instanceID]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.GET_CONSUMER_VOUCHERS_LIST_FAILUER:
      return {
        ...state,
        [instanceID]: Object.assgin({}, state[instanceID], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}
