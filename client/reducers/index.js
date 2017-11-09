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
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import current from './current'
import * as apm from './apm'
import pinpoint from './pinpoint'
import msa from './msa'
import gateway from './gateway'

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {
  auth: {},
  apms: {},
  projects: {},
  ppApps: {},
  msaList: {},
  gatewayPolicies: {},
}, action) => {
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

const config = (state = {}) => state

const rootReducer = combineReducers({
  entities,
  errorMessage,
  config,
  routing,
  current,
  ...apm,
  pinpoint,
  msa,
  gateway,
})

export default rootReducer
