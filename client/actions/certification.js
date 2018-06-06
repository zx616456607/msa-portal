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

/* <------------------ Clients start--------------------->*/
export const CLIENT_LIST_REQUEST = 'CLIENT_LIST_REQUEST'
export const CLIENT_LIST_SUCCESS = 'CLIENT_LIST_SUCCESS'
export const CLIENT_LIST_FAILURE = 'CLIENT_LIST_FAILURE'

const fetchClientList = (access_token, query, zoneInfo) => {
  let endpoint = `${CLIENT_API_URL}/oauth/clients`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [ CLIENT_LIST_REQUEST, CLIENT_LIST_SUCCESS, CLIENT_LIST_FAILURE ],
      endpoint,
      schema: Schemas.MSA_CLIENT_LIST_DATA,
      isCpi: true,
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: CONTENT_TYPE_JSON,
          'Access-Control-Request-Headers': 'X-Identity-Zone-Id,X-Identity-Zone-Subdomain',
          'X-Identity-Zone-Id': id,
          'X-Identity-Zone-Subdomain': subdomain,
        },
      },
    },
  }
}

export function getClientList(query, zoneInfo) {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchClientList(access_token, query, zoneInfo))
  }
}

const CREATE_CLIENT_REQUEST = 'CREATE_CLIENT_REQUEST'
const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS'
const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE'

const fetchCreateClient = (access_token, body) => {
  // const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [ CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients`,
      schema: {},
      isCpi: true,
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          // 'X-Identity-Zone-Id': id,
          // 'X-Identity-Zone-Subdomain': subdomain,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const createClient = (body, zoneInfo) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchCreateClient(access_token, body, zoneInfo))
  }

const EDIT_CLIENT_REQUEST = 'EDIT_CLIENT_REQUEST'
const EDIT_CLIENT_SUCCESS = 'EDIT_CLIENT_SUCCESS'
const EDIT_CLIENT_FAILURE = 'EDIT_CLIENT_FAILURE'

const fetchEditClient = (access_token, body) => {
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
  }
}

export const editClient = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchEditClient(access_token, body))
  }

const DELETE_CLIENT_REQUEST = 'DELETE_CLIENT_REQUEST'
const DELETE_CLIENT_SUCCESS = 'DELETE_CLIENT_SUCCESS'
const DELETE_CLIENT_FAILURE = 'DELETE_CLIENT_FAILURE'

const fetchDeleteClient = (access_token, clientID) => {
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
  }
}

export const deleteClient = clientID =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchDeleteClient(access_token, clientID))
  }

const CHANGE_CLIENT_SECRET_REQUEST = 'CHANGE_CLIENT_SECRET_REQUEST'
const CHANGE_CLIENT_SECRET_SUCCESS = 'CHANGE_CLIENT_SECRET_SUCCESS'
const CHANGE_CLIENT_SECRET_FAILURE = 'CHANGE_CLIENT_SECRET_FAILURE'

const fetchChangeClientSecret = (access_token, body) => {
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
  }
}

export const changeClientSecret = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchChangeClientSecret(access_token, body))
  }

/* <-------------------------- Clients end -------------------------->*/

/* <-------------------------- Zones start -------------------------->*/
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

/* <------------------ Zones end ------------------------------>*/

/* <------------------ Users start ---------------------------->*/

export const USERS_LIST_REQUEST = 'USERS_LIST_REQUEST'
export const USERS_LIST_SUCCESS = 'USERS_LIST_SUCCESS'
export const USERS_LIST_FAILURE = 'USERS_LIST_FAILURE'

const fetchUserList = (token, query) => {
  let endpoint = `${CLIENT_API_URL}/Users`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  // const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        USERS_LIST_REQUEST,
        USERS_LIST_SUCCESS,
        USERS_LIST_FAILURE,
      ],
      isCpi: true,
      endpoint,
      schema: Schemas.UAA_ZONE_USER_LIST_DATA,
      options: {
        headers: {
          Accept: CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
        },
      },
    },
  }
}

export const getUserList = (query, zoneInfo) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchUserList(access_token, query, zoneInfo))
  }

const CREATE_ZONE_USER_REQUEST = 'CREATE_ZONE_USER_REQUEST'
const CREATE_ZONE_USER_SUCCESS = 'CREATE_ZONE_USER_SUCCESS'
const CREATE_ZONE_USER_FAILURE = 'CREATE_ZONE_USER_FAILURE'

const fetchCreateZoneUser = (token, body) => {
  return {
    [CALL_API]: {
      types: [
        CREATE_ZONE_USER_REQUEST,
        CREATE_ZONE_USER_SUCCESS,
        CREATE_ZONE_USER_FAILURE,
      ],
      isCpi: true,
      endpoint: `${CLIENT_API_URL}/Users`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const createZoneUser = body => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchCreateZoneUser(access_token, body))
  }
}

const UPDATE_ZONE_USER_REQUEST = 'UPDATE_ZONE_USER_REQUEST'
const UPDATE_ZONE_USER_SUCCESS = 'UPDATE_ZONE_USER_SUCCESS'
const UPDATE_ZONE_USER_FAILURE = 'UPDATE_ZONE_USER_FAILURE'

const fetchUpdateZoneUser = (token, user, body) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_ZONE_USER_REQUEST,
        UPDATE_ZONE_USER_SUCCESS,
        UPDATE_ZONE_USER_FAILURE,
      ],
      isCpi: true,
      endpoint: `${CLIENT_API_URL}/Users/${user.id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          'If-Match': user.version,
        },
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateZoneUser = (user, body) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchUpdateZoneUser(access_token, user, body))
  }
}

const PATCH_ZONE_USER_REQUEST = 'PATCH_ZONE_USER_REQUEST'
const PATCH_ZONE_USER_SUCCESS = 'PATCH_ZONE_USER_SUCCESS'
const PATCH_ZONE_USER_FAILURE = 'PATCH_ZONE_USER_FAILURE'

const fetchPatchZoneUser = (token, user, body) => {
  return {
    [CALL_API]: {
      types: [
        PATCH_ZONE_USER_REQUEST,
        PATCH_ZONE_USER_SUCCESS,
        PATCH_ZONE_USER_FAILURE,
      ],
      isCpi: true,
      endpoint: `${CLIENT_API_URL}/Users/${user.id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          'if-Match': user.version,
        },
        method: 'PATCH',
        body,
      },
    },
  }
}

export const patchZoneUser = (user, body) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchPatchZoneUser(access_token, user, body))
  }
}

const DELETE_ZONE_USER_REQUEST = 'DELETE_ZONE_USER_REQUEST'
const DELETE_ZONE_USER_SUCCESS = 'DELETE_ZONE_USER_SUCCESS'
const DELETE_ZONE_USER_FAILURE = 'DELETE_ZONE_USER_FAILURE'

const fetchDeleteZoneUser = (token, id) => {
  return {
    [CALL_API]: {
      types: [
        DELETE_ZONE_USER_REQUEST,
        DELETE_ZONE_USER_SUCCESS,
        DELETE_ZONE_USER_FAILURE,
      ],
      isCpi: true,
      endpoint: `${CLIENT_API_URL}/Users/${id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteZoneUser = id => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchDeleteZoneUser(access_token, id))
  }
}

const UPDATE_ZONE_USER_PASSWORD_REQUEST = 'UPDATE_ZONE_USER_PASSWORD_REQUEST'
const UPDATE_ZONE_USER_PASSWORD_SUCCESS = 'UPDATE_ZONE_USER_PASSWORD_SUCCESS'
const UPDATE_ZONE_USER_PASSWORD_FAILURE = 'UPDATE_ZONE_USER_PASSWORD_FAILURE'

const fetchUpdateUserPassword = (token, userId, body) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_ZONE_USER_PASSWORD_REQUEST,
        UPDATE_ZONE_USER_PASSWORD_SUCCESS,
        UPDATE_ZONE_USER_PASSWORD_FAILURE,
      ],
      isCpi: true,
      endpoint: `${CLIENT_API_URL}/Users/${userId}/password`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateZoneUserPassword = (userId, body) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchUpdateUserPassword(access_token, userId, body))
  }
}

const ZONE_USER_UNLOCK_REQUEST = 'ZONE_USER_UNLOCK_REQUEST'
const ZONE_USER_UNLOCK_SUCCESS = 'ZONE_USER_UNLOCK_SUCCESS'
const ZONE_USER_UNLOCK_FAILURE = 'ZONE_USER_UNLOCK_FAILURE'

const fetchUnlockAccount = (token, userId, body) => {
  return {
    [CALL_API]: {
      types: [
        ZONE_USER_UNLOCK_REQUEST,
        ZONE_USER_UNLOCK_SUCCESS,
        ZONE_USER_UNLOCK_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${userId}/status`,
      isCpi: true,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'PATCH',
        body,
      },
    },
  }
}

export const unlockAccount = (userId, body) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    return dispatch(fetchUnlockAccount(access_token, userId, body))
  }
}


/* <------------------ Users end ------------------------------>*/
