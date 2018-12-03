/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * configcenter reducers for redux
 *
 * 2017-11-30
 * @author zhaoyb
 */

import * as ActionTypes from '../actions/configCenter'
import filter from 'lodash/filter'
import cloneDeep from 'lodash/cloneDeep'

export const configCenter = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.CENTER_SERVICE_INFO_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.CENTER_SERVICE_INFO_SUCCESS: {
      const _key = action.query.branch_name + '/' + (action.query.path || '')
      const temp = cloneDeep(action.response.result.data)
      return {
        ...state,
        isFetching: false,
        [_key]: temp.map(item => Object.assign(item, { isGet: false })),
      }
    }
    case ActionTypes.CENTER_SERVICE_INFO_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.CENTER_CONFIG_COMMIT_REQUEST:
      return {
        ...state,
      }
    case ActionTypes.CENTER_CONFIG_COMMIT_SUCCESS: {
      const branch = action.query.branch_name
      const path = action.query.path
      const _key = branch + '/' + (path || '')
      const data = action.response.result.data
      return {
        ...state,
        [_key]: state[_key].map(item => {
          const temp = cloneDeep(item)
          const status = filter(data, { file: (path ? path + '/' : '') + temp.name })[0]
          const res = Object.assign(temp, status, { isGet: true })
          return res
        }),
      }
    }
    case ActionTypes.CENTER_CONFIG_COMMIT_FAILURE:
      return {
        ...state,
      }
    default:
      return state
  }
}
