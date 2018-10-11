/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceMesh gateway
 *
 * @author songsz
 * @date 2018-10-10
 */

// import union from 'lodash/union'
import * as ActionTypes from '../actions/meshGateway'
// import { toQuerystring } from '../common/utils'

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
        data: action.response && action.response.result || [],
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
