/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * globalConfig reducers for redux
 *
 * 2018-07-10
 * @author ZhouHai tao
 */

import * as ActionTypes from '../actions/globalConfig'

const globalConfig = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ZKHOST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZKHOST_SUCCESS:
      return {
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZKHOST_FAILED:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.PUT_ZKHOST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.PUT_ZKHOST_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.PUT_ZKHOST_FAILED:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
export default globalConfig
