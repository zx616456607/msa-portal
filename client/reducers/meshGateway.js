/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceMesh gateway
 *
 * @author songsz
 * @date 2018-10-10
 */

import * as ActionTypes from '../actions/meshGateway'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import { getDeepValue } from '../common/utils'

const sortByCreateTime = res => {
  const { entities, result } = res || {}
  return sortBy(result || [], r => -moment(
    getDeepValue(entities || {}, [ 'meshGatewayList', r, 'metadata', 'creationTimestamp' ])
  ).unix())
}

const meshIngressGatewayList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MESH_I_GATEWAY_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MESH_I_GATEWAY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.response && action.response.result || [],
      }
    case ActionTypes.MESH_I_GATEWAY_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const meshGatewayList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.MESH_GATEWAY_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.MESH_GATEWAY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: sortByCreateTime(action.response),
      }
    case ActionTypes.MESH_GATEWAY_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

const meshGateway = (state = {
  apps: {},
}, action) => ({
  meshGatewayList: meshGatewayList(state.meshGatewayList, action),
  meshIngressGatewayList: meshIngressGatewayList(state.meshIngressGatewayList, action),
})

export default meshGateway
