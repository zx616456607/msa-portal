/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Event reducers for redux
 *
 * @author zhangxuan
 * @date 2018-05-25
 */

import * as ActionTypes from '../actions/eventManage'

function eventList(state = {}, action) {
  switch (action.type) {
    case ActionTypes.EVENT_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case ActionTypes.EVENT_LIST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        ...action.response.result.data,
      })
    case ActionTypes.EVENT_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}

const eventManage = (state = {
  eventList: {},
}, action) => {
  return {
    eventList: eventList(state.eventList, action),
  }
}

export default eventManage
