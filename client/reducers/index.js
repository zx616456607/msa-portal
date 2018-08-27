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
// import merge from 'lodash/merge'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import current from './current'
import * as apm from './apm'
import pinpoint from './pinpoint'
import msa from './msa'
import gateway from './gateway'
import * as configCenter from './configcenter'
import * as sringcloudComponent from './springcloud'
import CSB from './CSB'
import certification from './certification'
import eventManage from './eventManage'
import zipkin from './callLinkTrack'
import serviceMesh from './serviceMesh'

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
    const entities = action.response.entities
    Object.keys(entities).forEach(key => {
      entities[key] = Object.assign({}, state[key], entities[key])
    })
    return Object.assign({}, state, entities)
  }

  return state
}

// Updates error message to notify about the failed fetches.
const errorObject = (state = null, action) => {
  const { type, error, status, options } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return { message: error, status, options }
  }

  return state
}

const config = (state = {}) => state

const rootReducer = combineReducers({
  entities,
  errorObject,
  config,
  routing,
  current,
  ...apm,
  pinpoint,
  ...sringcloudComponent,
  msa,
  gateway,
  ...configCenter,
  CSB,
  certification,
  eventManage,
  zipkin,
  serviceMesh,
})

export default rootReducer
