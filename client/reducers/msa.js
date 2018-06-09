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

const msaNameList = (state = {}, action) => {
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

const msaEnv = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_ENV_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.MSA_ENV_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_ENV_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const msaConfig = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MSA_CONFIG_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.MSA_CONFIG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result,
      }
    case ActionTypes.MSA_CONFIG_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.SERVICE_DETAIL_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.SERVICE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.SERVICE_DETAIL_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const serviceProxy = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_PROXIES_REQUEST:
      return {
        isFetching: true,
      }
    case ActionTypes.GET_PROXIES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.GET_PROXIES_FAILURE:
      return {
        isFetching: false,
      }
    default:
      return state
  }
}

const msa = (state = {
  msaNameList: {},
  msaEnv: {},
  msaConfig: {},
  serviceDetail: {},
  serviceProxy: {},
}, action) => {
  return {
    msaNameList: msaNameList(state.msaNameList, action),
    msaEnv: msaEnv(state.msaEnv, action),
    msaConfig: msaConfig(state.msaConfig, action),
    serviceDetail: serviceDetail(state.serviceDetail, action),
    serviceProxy: serviceProxy(state.serviceProxy, action),
  }
}

export default msa
