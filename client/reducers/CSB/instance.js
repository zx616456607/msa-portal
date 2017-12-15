/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance reducers for redux
 *
 * 2017-12-15
 * @author zhangpc
 */

import * as ActionTypes from '../../actions/CSB/instance'
import { getQueryKey } from '../../common/utils'

export const publicInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_PUBLIC_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: {
          isFetching: true,
        },
      }
    case ActionTypes.CSB_PUBLIC_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          data: action.response.result.data,
        },
      }
    case ActionTypes.CSB_PUBLIC_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

export const availableInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_AVAILABLE_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: {
          isFetching: true,
        },
      }
    case ActionTypes.CSB_AVAILABLE_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ...action.response.result.data,
        },
      }
    case ActionTypes.CSB_AVAILABLE_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

export const omInstances = (state = {}, action) => {
  const { query, type } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.CSB_OM_INSTANCES_REQUEST:
      return {
        ...state,
        [key]: {
          isFetching: true,
        },
      }
    case ActionTypes.CSB_OM_INSTANCES_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ...action.response.result.data,
        },
      }
    case ActionTypes.CSB_OM_INSTANCES_FAILURE:
      return {
        ...state,
        [key]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}