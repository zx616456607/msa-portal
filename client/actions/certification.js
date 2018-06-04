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
import { API_CONFIG, CONTENT_TYPE_JSON, CONTENT_TYPE_URLENCODED, UAA_JWT } from '../constants'
import { toQuerystring } from '../common/utils'

const { CLIENT_API_URL } = API_CONFIG

export const UAA_AUTH_REQUEST = 'UAA_AUTH_REQUEST'
export const UAA_AUTH_SUCCESS = 'UAA_AUTH_SUCCESS'
export const UAA_AUTH_FAILURE = 'UAA_AUTH_FAILURE'

const fetchUaaAuth = body => {
  const endpoint = `${CLIENT_API_URL}/oauth/token`

  return {
    [CALL_API]: {
      types: [
        UAA_AUTH_REQUEST,
        UAA_AUTH_SUCCESS,
        UAA_AUTH_FAILURE,
      ],
      endpoint,
      schema: Schemas.UAA_AUTH,
      options: {
        headers: {
          'Content-Type': CONTENT_TYPE_URLENCODED,
          Accept: CONTENT_TYPE_JSON,
          Authorization: '',
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const getUaaAuth = body =>
  dispatch => dispatch(fetchUaaAuth(body))

export const UAA_REFRESH_TOKEN_REQUEST = 'UAA_REFRESH_TOKEN_REQUEST'
export const UAA_REFRESH_TOKEN_SUCCESS = 'UAA_REFRESH_TOKEN_SUCCESS'
export const UAA_REFRESH_TOKEN_FAILURE = 'UAA_REFRESH_TOKEN_FAILURE'

const fetchUaaRefreshToken = body => {
  return {
    [CALL_API]: {
      types: [
        UAA_REFRESH_TOKEN_REQUEST,
        UAA_REFRESH_TOKEN_SUCCESS,
        UAA_REFRESH_TOKEN_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/oauth/token`,
      schema: Schemas.UAA_AUTH,
      options: {
        method: 'POST',
        headers: {
          Accept: CONTENT_TYPE_JSON,
          'Content-Type': CONTENT_TYPE_URLENCODED,
          Authorization: '',
        },
        body,
      },
    },
  }
}

export const getUaaRefreshToken = body =>
  dispatch => dispatch(fetchUaaRefreshToken(body))

export const CLIENT_LIST_REQUEST = 'CLIENT_LIST_REQUEST'
export const CLIENT_LIST_SUCCESS = 'CLIENT_LIST_SUCCESS'
export const CLIENT_LIST_FAILURE = 'CLIENT_LIST_FAILURE'

const fetchClientList = (access_token, query) => {
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
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    },
  }
}

export function getClientList(query) {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchClientList(access_token, query))
  }
}

const CREATE_CLIENT_REQUEST = 'CREATE_CLIENT_REQUEST'
const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS'
const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE'

const fetchCreateClient = (access_token, body, callback) => {
  return {
    [CALL_API]: {
      types: [ CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients`,
      schema: {},
      isCpi: true,
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'POST',
        body,
      },
    },
    callback,
  }
}

export const createClient = (body, callback) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchCreateClient(access_token, body, callback))
  }

const EDIT_CLIENT_REQUEST = 'EDIT_CLIENT_REQUEST'
const EDIT_CLIENT_SUCCESS = 'EDIT_CLIENT_SUCCESS'
const EDIT_CLIENT_FAILURE = 'EDIT_CLIENT_FAILURE'

const fetchEditClient = (access_token, body, callback) => {
  return {
    [CALL_API]: {
      types: [ EDIT_CLIENT_REQUEST, EDIT_CLIENT_SUCCESS, EDIT_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${body.client_id}`,
      schema: {},
      isCpi: true,
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'PUT',
        body,
      },
    },
    callback,
  }
}

export const editClient = (body, callback) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchEditClient(access_token, body, callback))
  }

const DELETE_CLIENT_REQUEST = 'DELETE_CLIENT_REQUEST'
const DELETE_CLIENT_SUCCESS = 'DELETE_CLIENT_SUCCESS'
const DELETE_CLIENT_FAILURE = 'DELETE_CLIENT_FAILURE'

const fetchDeleteClient = (access_token, clientID, callback) => {
  return {
    [CALL_API]: {
      types: [ DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${clientID}`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'DELETE',
      },
    },
    callback,
  }
}

export const deleteClient = (clientID, callback) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchDeleteClient(access_token, clientID, callback))
  }

const CHANGE_CLIENT_SECRET_REQUEST = 'CHANGE_CLIENT_SECRET_REQUEST'
const CHANGE_CLIENT_SECRET_SUCCESS = 'CHANGE_CLIENT_SECRET_SUCCESS'
const CHANGE_CLIENT_SECRET_FAILURE = 'CHANGE_CLIENT_SECRET_FAILURE'

const fetchChangeClientSecret = (access_token, body, callback) => {
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
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'PUT',
        body,
      },
    },
    callback,
  }
}

export const changeClientSecret = (body, callback) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchChangeClientSecret(access_token, body, callback))
  }

export const GET_IDENTITY_ZONES_REQUEST = 'GET_IDENTITY_ZONES_REQUEST'
export const GET_IDENTITY_ZONES_SUCCESS = 'GET_IDENTITY_ZONES_SUCCESS'
export const GET_IDENTITY_ZONES_FAILURE = 'GET_IDENTITY_ZONES_FAILURE'

const fetchIdentityZones = token => {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  }
}

export const getIdentityZones = () =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchIdentityZones(access_token))
  }

const CREATE_IDENTITY_ZONES_REQUEST = 'CREATE_IDENTITY_ZONES_REQUEST'
const CREATE_IDENTITY_ZONES_SUCCESS = 'CREATE_IDENTITY_ZONES_SUCCESS'
const CREATE_IDENTITY_ZONES_FAILURE = 'CREATE_IDENTITY_ZONES_FAILURE'

const fetchCreateIdentityZones = (body, token) => {
  return {
    [CALL_API]: {
      types: [
        CREATE_IDENTITY_ZONES_REQUEST,
        CREATE_IDENTITY_ZONES_SUCCESS,
        CREATE_IDENTITY_ZONES_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/identity-zones`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          'Content-Type': CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const createIdentityZones = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchCreateIdentityZones(body, access_token))
  }

export const IDENTITY_ZONE_DETAIL_REQUEST = 'IDENTITY_ZONE_DETAIL_REQUEST'
export const IDENTITY_ZONE_DETAIL_SUCCESS = 'IDENTITY_ZONE_DETAIL_SUCCESS'
export const IDENTITY_ZONE_DETAIL_FAILURE = 'IDENTITY_ZONE_DETAIL_FAILURE'

const fetchIdentityZoneDetail = (id, token) => {
  return {
    [CALL_API]: {
      types: [
        IDENTITY_ZONE_DETAIL_REQUEST,
        IDENTITY_ZONE_DETAIL_SUCCESS,
        IDENTITY_ZONE_DETAIL_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/identity-zones/${id}`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  }
}

export const getIdentityZoneDetail = id =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchIdentityZoneDetail(id, access_token))
  }

const UPDATE_IDENTITY_ZONE_REQUEST = 'UPDATE_IDENTITY_ZONE_REQUEST'
const UPDATE_IDENTITY_ZONE_SUCCESS = 'UPDATE_IDENTITY_ZONE_SUCCESS'
const UPDATE_IDENTITY_ZONE_FAILURE = 'UPDATE_IDENTITY_ZONE_FAILURE'

const fetchUpdateIdentityZone = (body, token) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_IDENTITY_ZONE_REQUEST,
        UPDATE_IDENTITY_ZONE_SUCCESS,
        UPDATE_IDENTITY_ZONE_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/identity-zones/${body.id}`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': CONTENT_TYPE_JSON,
        },
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateIdentityZone = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchUpdateIdentityZone(body, access_token))
  }

const DELETE_IDENTITY_ZONE_REQUEST = 'DELETE_IDENTITY_ZONE_REQUEST'
const DELETE_IDENTITY_ZONE_SUCCESS = 'DELETE_IDENTITY_ZONE_SUCCESS'
const DELETE_IDENTITY_ZONE_FAILURE = 'DELETE_IDENTITY_ZONE_FAILURE'

const fetchDeleteIdentityZone = (id, token) => {
  return {
    [CALL_API]: {
      types: [
        DELETE_IDENTITY_ZONE_REQUEST,
        DELETE_IDENTITY_ZONE_SUCCESS,
        DELETE_IDENTITY_ZONE_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/identity-zones/${id}`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': CONTENT_TYPE_JSON,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteIdentityZone = id =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchDeleteIdentityZone(id, access_token))
  }
