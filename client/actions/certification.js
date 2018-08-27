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
import {
  API_CONFIG, CONTENT_TYPE_JSON, CONTENT_TYPE_URLENCODED, UAA_JWT,
  ZONE_ID_HEADER, ZONE_SUBDOMAIN_HEADER, IF_MATCH_HEADER,
} from '../constants'
import { toQuerystring } from '../common/utils'

const { CLIENT_API_URL } = API_CONFIG

export const UAA_AUTH_REQUEST = 'UAA_AUTH_REQUEST'
export const UAA_AUTH_SUCCESS = 'UAA_AUTH_SUCCESS'
export const UAA_AUTH_FAILURE = 'UAA_AUTH_FAILURE'

const fetchUaaAuth = (body, options) => {
  const endpoint = `${CLIENT_API_URL}/oauth/token`
  return {
    options,
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

export const getUaaAuth = (body, options) =>
  dispatch => dispatch(fetchUaaAuth(body, options))

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
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
      },
    },
  }
}

export function getClientList(query) {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchClientList(access_token, query, identityZoneDetail))
  }
}

const CREATE_CLIENT_REQUEST = 'CREATE_CLIENT_REQUEST'
const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS'
const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE'

const fetchCreateClient = (access_token, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [ CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const createClient = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchCreateClient(access_token, body, identityZoneDetail))
  }

const EDIT_CLIENT_REQUEST = 'EDIT_CLIENT_REQUEST'
const EDIT_CLIENT_SUCCESS = 'EDIT_CLIENT_SUCCESS'
const EDIT_CLIENT_FAILURE = 'EDIT_CLIENT_FAILURE'

const fetchEditClient = (access_token, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [ EDIT_CLIENT_REQUEST, EDIT_CLIENT_SUCCESS, EDIT_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${body.client_id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchEditClient(access_token, body, identityZoneDetail))
  }

const DELETE_CLIENT_REQUEST = 'DELETE_CLIENT_REQUEST'
const DELETE_CLIENT_SUCCESS = 'DELETE_CLIENT_SUCCESS'
const DELETE_CLIENT_FAILURE = 'DELETE_CLIENT_FAILURE'

const fetchDeleteClient = (access_token, clientID, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [ DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${clientID}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteClient = clientID =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchDeleteClient(access_token, clientID, identityZoneDetail))
  }

const CHANGE_CLIENT_SECRET_REQUEST = 'CHANGE_CLIENT_SECRET_REQUEST'
const CHANGE_CLIENT_SECRET_SUCCESS = 'CHANGE_CLIENT_SECRET_SUCCESS'
const CHANGE_CLIENT_SECRET_FAILURE = 'CHANGE_CLIENT_SECRET_FAILURE'

const fetchChangeClientSecret = (access_token, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        CHANGE_CLIENT_SECRET_REQUEST,
        CHANGE_CLIENT_SECRET_SUCCESS,
        CHANGE_CLIENT_SECRET_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/oauth/clients/${body.clientId}/secret`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${access_token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchChangeClientSecret(access_token, body, identityZoneDetail))
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

const fetchUserList = (token, query, zoneInfo) => {
  let endpoint = `${CLIENT_API_URL}/Users`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        USERS_LIST_REQUEST,
        USERS_LIST_SUCCESS,
        USERS_LIST_FAILURE,
      ],
      endpoint,
      schema: Schemas.UAA_ZONE_USER_LIST_DATA,
      options: {
        headers: {
          Accept: CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
      },
    },
  }
}

export const getUserList = query =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchUserList(access_token, query, identityZoneDetail))
  }

const CREATE_ZONE_USER_REQUEST = 'CREATE_ZONE_USER_REQUEST'
const CREATE_ZONE_USER_SUCCESS = 'CREATE_ZONE_USER_SUCCESS'
const CREATE_ZONE_USER_FAILURE = 'CREATE_ZONE_USER_FAILURE'

const fetchCreateZoneUser = (token, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        CREATE_ZONE_USER_REQUEST,
        CREATE_ZONE_USER_SUCCESS,
        CREATE_ZONE_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchCreateZoneUser(access_token, body, identityZoneDetail))
  }
}

const UPDATE_ZONE_USER_REQUEST = 'UPDATE_ZONE_USER_REQUEST'
const UPDATE_ZONE_USER_SUCCESS = 'UPDATE_ZONE_USER_SUCCESS'
const UPDATE_ZONE_USER_FAILURE = 'UPDATE_ZONE_USER_FAILURE'

const fetchUpdateZoneUser = (token, user, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        UPDATE_ZONE_USER_REQUEST,
        UPDATE_ZONE_USER_SUCCESS,
        UPDATE_ZONE_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${user.id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [IF_MATCH_HEADER]: user.meta.version,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchUpdateZoneUser(access_token, user, body, identityZoneDetail))
  }
}

const PATCH_ZONE_USER_REQUEST = 'PATCH_ZONE_USER_REQUEST'
const PATCH_ZONE_USER_SUCCESS = 'PATCH_ZONE_USER_SUCCESS'
const PATCH_ZONE_USER_FAILURE = 'PATCH_ZONE_USER_FAILURE'

const fetchPatchZoneUser = (token, user, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        PATCH_ZONE_USER_REQUEST,
        PATCH_ZONE_USER_SUCCESS,
        PATCH_ZONE_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${user.id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [IF_MATCH_HEADER]: user.meta.version,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchPatchZoneUser(access_token, user, body, identityZoneDetail))
  }
}

const DELETE_ZONE_USER_REQUEST = 'DELETE_ZONE_USER_REQUEST'
const DELETE_ZONE_USER_SUCCESS = 'DELETE_ZONE_USER_SUCCESS'
const DELETE_ZONE_USER_FAILURE = 'DELETE_ZONE_USER_FAILURE'

const fetchDeleteZoneUser = (token, id, zoneInfo) => {
  const { id: zoneId, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        DELETE_ZONE_USER_REQUEST,
        DELETE_ZONE_USER_SUCCESS,
        DELETE_ZONE_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${id}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: zoneId,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteZoneUser = id => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchDeleteZoneUser(access_token, id, identityZoneDetail))
  }
}

const UPDATE_ZONE_USER_PASSWORD_REQUEST = 'UPDATE_ZONE_USER_PASSWORD_REQUEST'
const UPDATE_ZONE_USER_PASSWORD_SUCCESS = 'UPDATE_ZONE_USER_PASSWORD_SUCCESS'
const UPDATE_ZONE_USER_PASSWORD_FAILURE = 'UPDATE_ZONE_USER_PASSWORD_FAILURE'

const fetchUpdateUserPassword = (token, userInfo, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        UPDATE_ZONE_USER_PASSWORD_REQUEST,
        UPDATE_ZONE_USER_PASSWORD_SUCCESS,
        UPDATE_ZONE_USER_PASSWORD_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${userInfo.id}/password`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [IF_MATCH_HEADER]: userInfo.meta.version,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateZoneUserPassword = (userInfo, body) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchUpdateUserPassword(access_token, userInfo, body, identityZoneDetail))
  }
}

const ZONE_USER_UNLOCK_REQUEST = 'ZONE_USER_UNLOCK_REQUEST'
const ZONE_USER_UNLOCK_SUCCESS = 'ZONE_USER_UNLOCK_SUCCESS'
const ZONE_USER_UNLOCK_FAILURE = 'ZONE_USER_UNLOCK_FAILURE'

const fetchUnlockAccount = (token, userId, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        ZONE_USER_UNLOCK_REQUEST,
        ZONE_USER_UNLOCK_SUCCESS,
        ZONE_USER_UNLOCK_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Users/${userId}/status`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
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
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchUnlockAccount(access_token, userId, body, identityZoneDetail))
  }
}


/* <------------------ Users end ------------------------------>*/

/* <-------------------------- Groups start -------------------------->*/

export const CREATE_GROUPS_REQUEST = 'CREATE_GROUPS_REQUEST'
export const CREATE_GROUPS_SUCCESS = 'CREATE_GROUPS_SUCCESS'
export const CREATE_GROUPS_FAILURE = 'CREATE_GROUPS_FAILURE'

const fetchCreateGroups = (token, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  const endpoint = `${CLIENT_API_URL}/Groups`
  return {
    [CALL_API]: {
      types: [
        CREATE_GROUPS_REQUEST,
        CREATE_GROUPS_SUCCESS,
        CREATE_GROUPS_FAILURE,
      ],
      endpoint,
      schema: {},
      options: {
        headers: {
          'Content-Type': CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const createGroup = body =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchCreateGroups(access_token, body, identityZoneDetail))
  }

export const GROUPS_LIST_REQUEST = 'GROUPS_LIST_REQUEST'
export const GROUPS_LIST_SUCCESS = 'GROUPS_LIST_SUCCESS'
export const GROUPS_LIST_FAILURE = 'GROUPS_LIST_FAILURE'

const fetchGroupList = (token, query, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  let endpoint = `${CLIENT_API_URL}/Groups`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GROUPS_LIST_REQUEST,
        GROUPS_LIST_SUCCESS,
        GROUPS_LIST_FAILURE,
      ],
      endpoint,
      schema: {},
      options: {
        headers: {
          Accept: CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
      },
    },
  }
}

export const getGroupList = query =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchGroupList(access_token, query, identityZoneDetail))
  }

export const DELETE_GROUPS_REQUEST = 'DELETE_GROUPS_REQUEST'
export const DELETE_GROUPS_SUCCESS = 'DELETE_GROUPS_SUCCESS'
export const DELETE_GROUPS_FAILURE = 'DELETE_GROUPS_FAILURE'

const fetchDelGroup = (token, id, zoneInfo) => {
  const { id: zoneId, subdomain } = zoneInfo
  const endpoint = `${CLIENT_API_URL}/Groups/${id}`
  return {
    [CALL_API]: {
      types: [
        DELETE_GROUPS_REQUEST,
        DELETE_GROUPS_SUCCESS,
        DELETE_GROUPS_FAILURE,
      ],
      endpoint,
      schema: {},
      options: {
        headers: {
          Accept: CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: zoneId,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteGroup = id =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchDelGroup(access_token, id, identityZoneDetail))
  }

export const UPDATE_GROUPS_REQUEST = 'UPDATE_GROUPS_REQUEST'
export const UPDATE_GROUPS_SUCCESS = 'UPDATE_GROUPS_SUCCESS'
export const UPDATE_GROUPS_FAILURE = 'UPDATE_GROUPS_FAILURE'

const fetchUpdateGroup = (token, query, body, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        UPDATE_GROUPS_REQUEST,
        UPDATE_GROUPS_SUCCESS,
        UPDATE_GROUPS_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Groups/${query.id}`,
      schema: {},
      options: {
        headers: {
          'Content-Type': CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [IF_MATCH_HEADER]: query.match,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'PUT',
        body,
      },
    },
  }
}

export const updateGroup = (query, body) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchUpdateGroup(access_token, query, body, identityZoneDetail))
  }

const DELETE_GROUP_USER_REQUEST = 'DELETE_GROUP_USER_REQUEST'
const DELETE_GROUP_USER_SUCCESS = 'DELETE_GROUP_USER_SUCCESS'
export const DELETE_GROUP_USER_FAILURE = 'DELETE_GROUP_USER_FAILURE'

const fetchDeleteGroupUser = (token, groupId, userId, zoneInfo) => {
  const { id, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        DELETE_GROUP_USER_REQUEST,
        DELETE_GROUP_USER_SUCCESS,
        DELETE_GROUP_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Groups/${groupId}/members/${userId}`,
      schema: {},
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: id,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'DELETE',
      },
    },
  }
}

export const deleteGroupUser = (groupId, userId) => {
  return (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchDeleteGroupUser(access_token, groupId, userId, identityZoneDetail))
  }
}

export const GROUPS_DETAIL_LIST_REQUEST = 'GROUPS_DETAIL_LIST_REQUEST'
export const GROUPS_DETAIL_LIST_SUCCESS = 'GROUPS_DETAIL_LIST_SUCCESS'
export const GROUPS_DETAIL_LIST_FAILURE = 'GROUPS_DETAIL_LIST_FAILURE'

const fetchGroupDetailList = (token, id, query, zoneInfo) => {
  const { id: zoneId, subdomain } = zoneInfo
  let endpoint = `${CLIENT_API_URL}/Groups/${id}/members`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GROUPS_DETAIL_LIST_REQUEST,
        GROUPS_DETAIL_LIST_SUCCESS,
        GROUPS_DETAIL_LIST_FAILURE,
      ],
      endpoint,
      schema: Schemas.UAA_ZONE_GROUP_USERS_LIST_DATA,
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: zoneId,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
      },
    },
  }
}

export const getGroupDetail = (id, query) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(fetchGroupDetailList(access_token, id, query, identityZoneDetail))
  }

export const ADD_GROUPS_DETAIL_USER_REQUEST = 'ADD_GROUPS_DETAIL_USER_REQUEST'
export const ADD_GROUPS_DETAIL_USER_SUCCESS = 'ADD_GROUPS_DETAIL_USER_SUCCESS'
export const ADD_GROUPS_DETAIL_USER_FAILURE = 'ADD_GROUPS_DETAIL_USER_FAILURE'

const createGroupUser = (token, id, body, zoneInfo) => {
  const { id: zoneId, subdomain } = zoneInfo
  return {
    [CALL_API]: {
      types: [
        ADD_GROUPS_DETAIL_USER_REQUEST,
        ADD_GROUPS_DETAIL_USER_SUCCESS,
        ADD_GROUPS_DETAIL_USER_FAILURE,
      ],
      endpoint: `${CLIENT_API_URL}/Groups/${id}/members`,
      schema: {},
      options: {
        headers: {
          'Content-Type': CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
          [ZONE_ID_HEADER]: zoneId,
          [ZONE_SUBDOMAIN_HEADER]: subdomain,
        },
        method: 'POST',
        body,
      },
    },
  }
}

export const addGroupsUser = (id, body) =>
  (dispatch, getState) => {
    const { access_token } = getState().entities.uaaAuth[UAA_JWT]
    const { identityZoneDetail } = getState().certification
    return dispatch(createGroupUser(access_token, id, body, identityZoneDetail))
  }

/* <-------------------------- Groups end -------------------------->*/
