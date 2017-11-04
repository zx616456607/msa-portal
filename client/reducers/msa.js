/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa reducers for redux
 *
 * 2017-11-02
 * @author zhangxuan
 */

import * as ActionTypes from '../actions/msa'

const msaList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MSA_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const msa = (state = {
  msaList: {},
}, action) => {
  return {
    msaList: msaList(state, action),
  }
}

export default msa
