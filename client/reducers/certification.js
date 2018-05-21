/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Certification reducers for redux
 *
 * 2018-05-15
 * @author zhangxuan
 */

import * as ActionTypes from '../actions/certification'

const clientList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.CLIENT_LIST_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.CLIENT_LIST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        ...action.response.result,
      })
    case ActionTypes.CLIENT_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}
const certification = (state = {
  clientList: {},
}, action) => {
  return {
    clientList: clientList(state.clientList, action),
  }
}

export default certification
