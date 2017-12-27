/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * InstanceService reducers for redux
 *
 * 2017-12-22
 * @author zhaoyb
 */
import * as ActionTypes from '../../../actions/CSB/instanceService'
import { getQueryKey } from '../../../common/utils'

export const publishedService = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_INSTANCE_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.FETCH_CSB_INSTANCE_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const serviceCAL = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          data: action.response.result,
        },
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const serviceOverview = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          data: action.response.result.data,
        },
      }
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const serviceDetailMap = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          data: action.response.result.data,
        },
      }
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

