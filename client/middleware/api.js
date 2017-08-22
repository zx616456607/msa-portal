/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Api middleware for redux
 *
 * 2017-08-16
 * @author zhangpc
 */

import { normalize } from 'normalizr'
import fetch from 'isomorphic-fetch'
import { JWT, API_URL } from '../constants'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, options, schema) => {
  const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint

  return fetch(fullUrl, options)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        return Object.assign({},
          normalize(json, schema),
        )
      })
    )
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, options } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  options = options || {}

  // Set jwt token to headers
  const jwtAuth = store.getState().entities.auth[JWT] || {}
  let jwtToken = jwtAuth.token
  if (!jwtToken && localStorage) {
    jwtToken = localStorage.getItem(JWT)
  }
  options.headers = Object.assign({}, { Authorization: `Bearer ${jwtToken}` }, options.headers)

  return callApi(endpoint, options, schema).then(
    response => next(actionWith({
      response,
      type: successType,
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened',
    }))
  )
}
