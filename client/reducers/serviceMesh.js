/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceMesh.js page
 *
 * @author zhangtao
 * @date Monday July 30th 2018
 */

// import union from 'lodash/union'
import * as ActionTypes from '../actions/serviceMesh'
// import { toQuerystring } from '../common/utils'

const appsList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.APP_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.APP_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.APP_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.SERVICE_GET_ALL_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.SERVICE_GET_ALL_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.SERVICE_GET_ALL_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const graphDataList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.SERVICE_MESH_GRAPH_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.SERVICE_MESH_GRAPH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.SERVICE_MESH_GRAPH_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceMesh = (state = {
  apps: {},
}, action) => {
  return {
    appsList: appsList(state.appsList, action),
    serviceList: serviceList(state.serviceList, action),
    graphDataList: graphDataList(state.graphDataList, action),
  }
}

export default serviceMesh
