/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * reducers for dubbo
 *
 * @author zhouhaitao
 * @date 2018-10-15
 */

import * as ActionTypes from '../actions/dubbo'

const dubboListData = [
  {
    serviceName: 'service1',
    version: '1.0.1',
    group: 'def',
    belong: 'app1',
    status: '0',
    time: '2018-10-15T07:59:27Z',
    id: '25',
  },
  {
    serviceName: 'service1',
    version: '1.0.1',
    group: 'def',
    belong: 'app1',
    status: '0',
    time: '2018-10-15T07:59:27Z',
    id: '58',
  },
  {
    serviceName: 'service1',
    version: '1.0.1',
    group: 'def',
    belong: 'app1',
    status: '0',
    time: '2018-10-15T07:59:27Z',
    id: '23',
  },
]


const dubboList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_DUBBO_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_DUBBO_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: dubboListData || [],
      }
    case ActionTypes.FETCH_DUBBO_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
const dubboDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_DUBBO_DETAIL_SUCCESS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const dubbo = (state = {
  dubboList: {
    isFetching: false,
    data: [],
  },
  dubboDetail: {},
}, action) => ({
  dubboList: dubboList(state.dubboList, action),
  dubboDetail: dubboDetail(state.dubboDetail, action),
})

export default dubbo
