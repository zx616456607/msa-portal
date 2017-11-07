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
import { JWT, API_CONFIG, CONTENT_TYPE_JSON, CONTENT_TYPE_URLENCODED } from '../constants'
import { toQuerystring } from '../common/utils'

const { PAAS_API_URL, PAAS_SPI_URL } = API_CONFIG
// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, options, schema) => {
  let fullUrl
  if (/^https?:\/\//.test(endpoint)) {
    fullUrl = endpoint
  } else {
    fullUrl = PAAS_API_URL + endpoint
  }

  // Support spi
  if (options.isSpi) {
    fullUrl = (endpoint.indexOf(PAAS_SPI_URL) === -1) ? PAAS_SPI_URL + endpoint : endpoint
    delete options.isSpi
  }

  fullUrl = encodeURI(fullUrl)

  if (options.method) {
    options.method = options.method.toUpperCase()
  }

  // The request body can be of the type String, Blob, or FormData.
  // Other data structures need to be encoded before hand as one of these types.
  // https://github.github.io/fetch/#request-body
  const REQUEST_BODY_METHODS = [ 'POST', 'PUT', 'PATCH' ]
  if (REQUEST_BODY_METHODS.indexOf(options.method) > -1) {
    if (!options.headers) options.headers = {}
    if (options.headers['Content-Type'] === undefined) {
      options.headers['Content-Type'] = CONTENT_TYPE_JSON
    }
    switch (options.headers['Content-Type']) {
      case CONTENT_TYPE_JSON:
        options.body = JSON.stringify(options.body)
        break
      case CONTENT_TYPE_URLENCODED:
        options.body = toQuerystring(options.body)
        break
      default:
        break
    }
  }
  return fetch(fullUrl, options)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        return Object.assign({},
          normalize(json, schema)
        )
      }).catch(json => {
        const { message } = json || {}
        const { status, statusText } = response
        // handle for unjson response
        if (status < 300) {
          return {
            status,
            message: message || statusText,
          }
        }
        const error = new Error(message || statusText)
        error.status = status
        return Promise.reject(error)
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

  // Set project to headers
  const currentConfig = store.getState().current.config
  const project = currentConfig.project && currentConfig.project.namespace
  if (project && project !== 'default') {
    options.headers = Object.assign({}, { project }, options.headers)
  }
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
