/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Reducers for redux
 *
 * 2017-08-16
 * @author zhangpc
 */

import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import union from 'lodash/union'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { getQueryKey } from '../common/utils'

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { apps: {} }, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }

  return state
}

const jwt = (state = {}, action) => {
  const { type, jwt } = action

  if (type === ActionTypes.SAVE_JWT) {
    return jwt
  }

  return state
}

const queryApps = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.APPS_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.APPS_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: union(state.ids, action.response.result),
        },
      }
    case ActionTypes.APPS_FAILURE:
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

const rootReducer = combineReducers({
  entities,
  errorMessage,
  jwt,
  queryApps,
  routing,
})

export default rootReducer
