/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * globalConfig reducers for redux
 *
 * 2018-07-10
 * @author ZhouHai tao
 */
// @todo
// 由于dev-branch暂时不需要RPC相关功能，此文件暂时没用
import * as ActionTypes from '../actions/globalConfig'
/* const globalConfig = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ZKHOST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_ZKHOST_SUCCESS:
      return {
        isFetching: false,
        data: action.response.result.data,
      }
    case ActionTypes.GET_ZKHOST_FAILED:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.PUT_ZKHOST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.PUT_ZKHOST_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.PUT_ZKHOST_FAILED:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}*/

const data = {
  configDetail: '{"url":"http://192.168.1.58:8989","canDeployPersonalServer":{"springcloud":false,"pinpoint":false}}',
  configID: 'cc2739d3-12c9-4864-b5f1-01e99d61msa',
  configType: 'msa',
  createTime: '2018-09-13T09:12:58Z',
  description: '',
}
const springCloudAndApmState = {
  isFetching: false,
  ...data,
}

const springCloudAndApm = (state = springCloudAndApmState, action) => {
  switch (action.type) {
    case ActionTypes.GET_MSA_CONFIG_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_MSA_CONFIG_SUCCESS:
      return {
        ...state,
        ...data,
        isFetching: false,
      }
    case ActionTypes.GET_MSA_CONFIG_FAILURE:
      return {
        ...state,
        ...data,
        isFetching: false,
      }
    default:
      return state
  }
}
export default springCloudAndApm
