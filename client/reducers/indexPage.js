/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * IndexPage reducers for redux
 *
 * @author zhouhaitao
 * @date 2018-10-18
 */

import * as ActionTypes from '../actions/indexPage'

const limitsAndRoutes = (state, action) => {
  switch (action.type) {
    case ActionTypes.LIMIT_ROUTE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.LIMIT_ROUTE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.LIMIT_ROUTE_FAILURE:
      return {
        isFetching: false,
        ...state,
      }
    default:
      return state
  }
}

const microservice = (state, action) => {
  switch (action.type) {
    case ActionTypes.MICROSERVICE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MICROSERVICE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.MICROSERVICE_FAILURE:
      return {
        isFetching: false,
        ...state,
      }
    default:
      return state
  }
}

const rpcService = (state, action) => {
  switch (action.type) {
    case ActionTypes.RPC_SERVICE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RPC_SERVICE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.RPC_SERVICE_FAILURE:
      return {
        isFetching: false,
        ...state,
      }
    default:
      return state
  }
}

const numberOfServiceCall = (state, action) => {
  switch (action.type) {
    case ActionTypes.SERVICE_CALL_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.SERVICE_CALL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.SERVICE_CALL_FAILURE:
      return {
        isFetching: false,
        ...state,
      }
    default:
      return state
  }
}

const overView = (state = {
  limitsAndRoutes: { isFetching: true },
  microservice: { isFetching: true },
  rpcService: { isFetching: true },
  numberOfServiceCall: { isFetching: true },
}, action) => {
  return {
    limitsAndRoutes: limitsAndRoutes(state.limitsAndRoutes, action),
    microservice: microservice(state.microservice, action),
    rpcService: rpcService(state.rpcService, action),
    numberOfServiceCall: numberOfServiceCall(state.numberOfServiceCall, action),
  }
}

export default overView
