/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Certification action
 *
 * 2018-05-15
 * @author zhangxuan
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { API_CONFIG, CLIENT_JWT } from '../constants'
import { toQuerystring } from '../common/utils'

const { CLIENT_API_URL } = API_CONFIG

const clientHeaders = {
  Authorization: `Bearer ${CLIENT_JWT}`,
}

export const CLIENT_LIST_REQUEST = 'CLIENT_LIST_REQUEST'
export const CLIENT_LIST_SUCCESS = 'CLIENT_LIST_SUCCESS'
export const CLIENT_LIST_FAILURE = 'CLIENT_LIST_FAILURE'

const fetchClientList = query => {
  let endpoint = `${CLIENT_API_URL}/oauth/clients`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [ CLIENT_LIST_REQUEST, CLIENT_LIST_SUCCESS, CLIENT_LIST_FAILURE ],
      endpoint,
      schema: Schemas.MSA_CLIENT_LIST_DATA,
      isCpi: true,
      options: {
        headers: clientHeaders,
      },
    },
  }
}

export function getClientList(query) {
  return dispatch => {
    return dispatch(fetchClientList(query))
  }
}

const CREATE_CLIENT_REQUEST = 'CREATE_CLIENT_REQUEST'
const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS'
const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE'

const fetchCreateClient = (body, callback) => {
  return {
    [CALL_API]: {
      types: [ CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients`,
      schema: {},
      isCpi: true,
      options: {
        headers: clientHeaders,
        method: 'POST',
        body,
      },
    },
    callback,
  }
}

export const createClient = (body, callback) =>
  dispatch => dispatch(fetchCreateClient(body, callback))

const EDIT_CLIENT_REQUEST = 'EDIT_CLIENT_REQUEST'
const EDIT_CLIENT_SUCCESS = 'EDIT_CLIENT_SUCCESS'
const EDIT_CLIENT_FAILURE = 'EDIT_CLIENT_FAILURE'

const fetchEditClient = (body, callback) => {
  return {
    [CALL_API]: {
      types: [ EDIT_CLIENT_REQUEST, EDIT_CLIENT_SUCCESS, EDIT_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${body.client_id}`,
      schema: {},
      isCpi: true,
      options: {
        headers: clientHeaders,
        method: 'PUT',
        body,
      },
    },
    callback,
  }
}

export const editClient = (body, callback) =>
  dispatch => dispatch(fetchEditClient(body, callback))

const DELETE_CLIENT_REQUEST = 'DELETE_CLIENT_REQUEST'
const DELETE_CLIENT_SUCCESS = 'DELETE_CLIENT_SUCCESS'
const DELETE_CLIENT_FAILURE = 'DELETE_CLIENT_FAILURE'

const fetchDeleteClient = (clientID, callback) => {
  return {
    [CALL_API]: {
      types: [ DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${clientID}`,
      isCpi: true,
      schema: {},
      options: {
        headers: clientHeaders,
        method: 'DELETE',
      },
    },
    callback,
  }
}

export const deleteClient = (clientID, callback) =>
  dispatch => dispatch(fetchDeleteClient(clientID, callback))

const CHANGE_CLIENT_SECRET_REQUEST = 'CHANGE_CLIENT_SECRET_REQUEST'
const CHANGE_CLIENT_SECRET_SUCCESS = 'CHANGE_CLIENT_SECRET_SUCCESS'
const CHANGE_CLIENT_SECRET_FAILURE = 'CHANGE_CLIENT_SECRET_FAILURE'

const fetchChangeClientSecret = (body, callback) => {
  return {
    [CALL_API]: {
      types: [
        CHANGE_CLIENT_SECRET_REQUEST,
        CHANGE_CLIENT_SECRET_SUCCESS,
        CHANGE_CLIENT_SECRET_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${body.clientId}/secret`,
      isCpi: true,
      schema: {},
      options: {
        headers: clientHeaders,
        method: 'PUT',
        body,
      },
    },
    callback,
  }
}

export const changeClientSecret = (body, callback) =>
  dispatch => dispatch(fetchChangeClientSecret(body, callback))

export const GET_IDENTITY_ZONES_REQUEST = 'GET_IDENTITY_ZONES_REQUEST'
export const GET_IDENTITY_ZONES_SUCCESS = 'GET_IDENTITY_ZONES_SUCCESS'
export const GET_IDENTITY_ZONES_FAILURE = 'GET_IDENTITY_ZONES_FAILURE'

const fetchIdentityZones = () => {
  return {
    [CALL_API]: {
      types: [
        GET_IDENTITY_ZONES_REQUEST,
        GET_IDENTITY_ZONES_SUCCESS,
        GET_IDENTITY_ZONES_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/identity-zones`,
      isCpi: true,
      schema: Schemas.MSA_CLIENT_IDENTITY_ZONE_LIST_DATA,
      options: {
        headers: clientHeaders,
      },
    },
  }
}

export const getIdentityZones = () =>
  dispatch => dispatch(fetchIdentityZones())
