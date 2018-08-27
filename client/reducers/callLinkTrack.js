/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * callLinkTrack reducers for redux
 *
 * 2018-07-09
 * @author zhaoyb
 */

import * as ActionTypes from '../actions/callLinkTrack'

const tracesList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_ZIPKIN_TRACES_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZIPKIN_TRACES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZIPKIN_TRACES_FAILURE:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state
  }
}

const servicesList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_ZIPKIN_SERVICES_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZIPKIN_SERVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZIPKIN_SERVICES_FAILURE:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state
  }
}

const traceList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_ZIPKIN_TRACE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZIPKIN_TRACE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZIPKIN_TRACE_FAILURE:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state
  }
}

const relationShipList = (state = {}, action) => {
  const { type, lname, operationType } = action
  switch (type) {
    case ActionTypes.GET_ZIPKIN_DEPENDENCIES_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZIPKIN_DEPENDENCIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZIPKIN_DEPENDENCIES_FAILURE:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.ACTIVE_RElATION_CHART_NODE: {
      const newstate = { ...state }
      newstate.data.nodes.forEach(node => {
        if (node.active !== undefined) {
          delete node.active
        }
        if (node.id === lname && operationType === 'set') {
          node.active = true
        }
      });
      return {
        ...newstate,
        isFetching: false,
      }
    }
    default:
      return state
  }
}

const zipkin = (state = {
  traceList: {},
  tracesList: {},
  servicesList: {},
  relationShipList: {},
}, action) => {
  return {
    traceList: traceList(state.traceList, action),
    tracesList: tracesList(state.tracesList, action),
    servicesList: servicesList(state.servicesList, action),
    relationShipList: relationShipList(state.relationShipList, action),
  }
}

export default zipkin
