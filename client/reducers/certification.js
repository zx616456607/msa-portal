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

const identityZoneList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_IDENTITY_ZONES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case ActionTypes.GET_IDENTITY_ZONES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result,
      })
    case ActionTypes.GET_IDENTITY_ZONES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}

const identityZoneDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.IDENTITY_ZONE_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case ActionTypes.IDENTITY_ZONE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        ...action.response.result,
      })
    case ActionTypes.IDENTITY_ZONE_DETAIL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}

const zoneUsers = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.USERS_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case ActionTypes.USERS_LIST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result,
      })
    case ActionTypes.USERS_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}

const certification = (state = {
  clientList: {},
  identityZoneList: {},
  identityZoneDetail: {},
  zoneUsers: {},
}, action) => {
  return {
    clientList: clientList(state.clientList, action),
    identityZoneList: identityZoneList(state.identityZoneList, action),
    identityZoneDetail: identityZoneDetail(state.identityZoneDetail, action),
    zoneUsers: zoneUsers(state.zoneUsers, action),
  }
}

export default certification
