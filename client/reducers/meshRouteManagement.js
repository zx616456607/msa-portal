/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceMesh gateway
 *
 * @author zhouhaitao
 * @date 2018-10-15
 */

import * as ActionTypes from '../actions/meshRouteManagement'

const meshRouteList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MESH_ROUTE_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MESH_ROUTE_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.result || [],
      }
    case ActionTypes.MESH_ROUTE_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const meshRouteDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_MESH_ROUTE_DETAIL_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_MESH_ROUTE_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.result || [],
      }
    case ActionTypes.FETCH_MESH_ROUTE_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const meshRouteManagement = (state = {
  meshRouteList: {
    isFetching: false,
    data: [],
  },
  meshRouteDetail: {},
}, action) => ({
  meshRouteList: meshRouteList(state.meshRouteList, action),
  meshRouteDetail: meshRouteDetail(state.meshRouteDetail, action),
})

export default meshRouteManagement
