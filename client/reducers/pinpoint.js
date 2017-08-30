/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * PinPoint reducers for redux
 *
 * 2017-08-29
 * @author zhangpc
 */

import union from 'lodash/union'
import * as ActionTypes from '../actions/pinpoint'
// import { toQuerystring } from '../common/utils'

const apps = (state = {}, action) => {
  const { type, apmID } = action
  switch (type) {
    case ActionTypes.PINPOINT_APPS_REQUEST:
      return {
        ...state,
        [apmID]: {
          isFetching: true,
        },
      }
    case ActionTypes.PINPOINT_APPS_SUCCESS:
      return {
        ...state,
        [apmID]: {
          isFetching: false,
          ids: union(state.ids, action.response.result),
        },
      }
    case ActionTypes.PINPOINT_APPS_FAILURE:
      return {
        ...state,
        [apmID]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

const queryScatter = (state = {}, action) => {
  const { type, apmID, query } = action
  switch (type) {
    case ActionTypes.SCATTER_DATA_REQUEST:
      return {
        ...state,
        [apmID]: {
          [query.application]: {
            isFetching: true,
          },
        },
      }
    case ActionTypes.SCATTER_DATA_SUCCESS:
      return {
        ...state,
        [apmID]: {
          [query.application]: {
            isFetching: false,
            ...action.response.result,
          },
        },
      }
    case ActionTypes.SCATTER_DATA_FAILURE:
      return {
        ...state,
        [apmID]: {
          [query.application]: {
            isFetching: false,
          },
        },
      }
    default:
      return state
  }
}

const pinpointMap = (state = {}, action) => {
  const { type, apmID } = action
  switch (type) {
    case ActionTypes.PINPOINT_MAP_REQUEST:
      return {
        ...state,
        [apmID]: {
          isFetching: true,
        },
      }
    case ActionTypes.PINPOINT_MAP_SUCCESS:
      return {
        ...state,
        [apmID]: {
          isFetching: false,
          ...action.response.result,
        },
      }
    case ActionTypes.PINPOINT_MAP_FAILURE:
      return {
        ...state,
        [apmID]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

const queryTransaction = (state = {}, action) => {
  const { type, apmID, application } = action
  switch (type) {
    case ActionTypes.TRANSACTION_METADATA_REQUEST:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: true,
          },
        },
      }
    case ActionTypes.TRANSACTION_METADATA_SUCCESS:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: false,
            ...action.response.result,
          },
        },
      }
    case ActionTypes.TRANSACTION_METADATA_FAILURE:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: false,
          },
        },
      }
    default:
      return state
  }
}

const pinpoint = (state = {
  apps: {},
  queryScatter: {},
  pinpointMap: {},
  queryTransaction: {},
}, action) => {
  return {
    apps: apps(state.apps, action),
    queryScatter: queryScatter(state.queryScatter, action),
    pinpointMap: pinpointMap(state.pinpointMap, action),
    queryTransaction: queryTransaction(state.queryTransaction, action),
  }
}

export default pinpoint
