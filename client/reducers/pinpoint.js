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

const serviceMap = (state = {}, action) => {
  const { type, apmID, query } = action
  switch (type) {
    case ActionTypes.PINPOINT_MAP_REQUEST:
      return {
        ...state,
        [apmID]: {
          [query.applicationName]: {
            isFetching: true,
          },
        },
      }
    case ActionTypes.PINPOINT_MAP_SUCCESS:
      return {
        ...state,
        [apmID]: {
          [query.applicationName]: {
            isFetching: false,
            ...action.response.result,
          },
        },
      }
    case ActionTypes.PINPOINT_MAP_FAILURE:
      return {
        ...state,
        [apmID]: {
          [query.applicationName]: {
            isFetching: false,
          },
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

const transactionInfo = (state = {}, action) => {
  const { type, query } = action
  switch (type) {
    case ActionTypes.TRANSACTION_INFO_REQUEST:
      return {
        ...state,
        [query.agentId]: {
          ...state[query.agentId],
          [query.spanId]: {
            isFetching: true,
          },
        },
      }
    case ActionTypes.TRANSACTION_INFO_SUCCESS:
      return {
        ...state,
        [query.agentId]: {
          ...state[query.agentId],
          [query.spanId]: {
            isFetching: false,
            ...action.response.result,
          },
        },
      }
    case ActionTypes.TRANSACTION_INFO_FAILURE:
      return {
        ...state,
        [query.agentId]: {
          ...state[query.agentId],
          [query.spanId]: {
            isFetching: false,
          },
        },
      }
    default:
      return state
  }
}

const charts = (state = {}, action) => {
  const { type, apmID, application } = action
  switch (type) {
    case ActionTypes.FETCH_JVMGC_FAILURE:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: false,
          },
        },
      }
    case ActionTypes.FETCH_JVMGC_SUCCESS:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: false,
            ...action.response.result,
          },
        },
      }
    case ActionTypes.FETCH_JVMGC_REQUEST:
      return {
        ...state,
        [apmID]: {
          [application]: {
            isFetching: true,
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
  serviceMap: {},
  queryTransaction: {},
  transactionInfo: {},
}, action) => {
  return {
    apps: apps(state.apps, action),
    charts: charts(state.charts, action),
    queryScatter: queryScatter(state.queryScatter, action),
    serviceMap: serviceMap(state.serviceMap, action),
    queryTransaction: queryTransaction(state.queryTransaction, action),
    transactionInfo: transactionInfo(state.transactionInfo, action),
  }
}

export default pinpoint
