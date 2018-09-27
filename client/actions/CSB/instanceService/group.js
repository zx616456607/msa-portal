/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance serivce group aciton
 *
 * 2017-12-11
 * @author zhangpc
 */

import { CALL_API } from '../../../middleware/api'
import { toQuerystring } from '../../../common/utils'
import cloneDeep from 'lodash/cloneDeep'
import { Schemas } from '../../../middleware/schemas'
import {
  API_CONFIG,
} from '../../../constants'

const { CSB_API_URL } = API_CONFIG

export const CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST'
export const CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS'
export const CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCreateGroup = (instanceID, body, options) => {
  return {
    options,
    [CALL_API]: {
      types: [
        CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST,
        CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS,
        CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createGroup = (instanceID, body, options) =>
  dispatch => dispatch(fetchCreateGroup(instanceID, body, options))

export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST'
export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS'
export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUpdateGroup = (instanceID, groupID, body) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST,
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS,
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups/${groupID}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const updateGroup = (instanceID, groupID, body) =>
  dispatch => dispatch(fetchUpdateGroup(instanceID, groupID, body))

export const GET_CSB_INSTANCE_SERVICE_GROUPS_REQUEST = 'GET_CSB_INSTANCE_SERVICE_GROUPS_REQUEST'
export const GET_CSB_INSTANCE_SERVICE_GROUPS_SUCCESS = 'GET_CSB_INSTANCE_SERVICE_GROUPS_SUCCESS'
export const GET_CSB_INSTANCE_SERVICE_GROUPS_FAILURE = 'GET_CSB_INSTANCE_SERVICE_GROUPS_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchGetGroups = (instanceID, query = {}) => {
  const _query = cloneDeep(query)
  const { page } = _query
  if (page !== undefined) {
    _query.page = page - 1
  }
  return {
    [CALL_API]: {
      types: [
        GET_CSB_INSTANCE_SERVICE_GROUPS_REQUEST,
        GET_CSB_INSTANCE_SERVICE_GROUPS_SUCCESS,
        GET_CSB_INSTANCE_SERVICE_GROUPS_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups?${toQuerystring(_query)}`,
      schema: Schemas.CSB_INSTANCE_SERVICE_GROUP_LIST_DATA,
    },
  }
}

export const getGroups = (instanceID, query) =>
  dispatch => dispatch(fetchGetGroups(instanceID, query))

export const DELETE_CSB_INSTANCE_SERVICE_GROUP_REQUEST = 'DELETE_CSB_INSTANCE_SERVICE_GROUP_REQUEST'
export const DELETE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS = 'DELETE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS'
export const DELETE_CSB_INSTANCE_SERVICE_GROUP_FAILURE = 'DELETE_CSB_INSTANCE_SERVICE_GROUP_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchDeleteGroup = (instanceID, groupID) => {
  return {
    [CALL_API]: {
      types: [
        DELETE_CSB_INSTANCE_SERVICE_GROUP_REQUEST,
        DELETE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS,
        DELETE_CSB_INSTANCE_SERVICE_GROUP_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups/${groupID}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const deleteGroup = (instanceID, groupID) =>
  dispatch => dispatch(fetchDeleteGroup(instanceID, groupID))

export const GET_CSB_INSTANCE_GROUP_SERVICES_REQUEST = 'GET_CSB_INSTANCE_GROUP_SERVICES_REQUEST'
export const GET_CSB_INSTANCE_GROUP_SERVICES_SUCCESS = 'GET_CSB_INSTANCE_GROUP_SERVICES_SUCCESS'
export const GET_CSB_INSTANCE_GROUP_SERVICES_FAILURE = 'GET_CSB_INSTANCE_GROUP_SERVICES_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchGetGroupServices = (instanceID, groupID, query = {}) => {
  const _query = cloneDeep(query)
  const { page } = _query
  if (page !== undefined) {
    _query.page = page - 1
  }
  return {
    groupID,
    [CALL_API]: {
      types: [
        GET_CSB_INSTANCE_GROUP_SERVICES_REQUEST,
        GET_CSB_INSTANCE_GROUP_SERVICES_SUCCESS,
        GET_CSB_INSTANCE_GROUP_SERVICES_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups/${groupID}/services?${toQuerystring(_query)}`,
      schema: Schemas.CSB_PUBLISHED_LIST_DATA,
    },
  }
}

export const getGroupServices = (instanceID, groupID, query) =>
  dispatch => dispatch(fetchGetGroupServices(instanceID, groupID, query))

export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_REQUEST = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_REQUEST'
export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_SUCCESS = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_SUCCESS'
export const UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_FAILURE = 'UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUpdateGroupStatus = (instanceID, groupID, body) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_REQUEST,
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_SUCCESS,
        UPDATE_CSB_INSTANCE_SERVICE_GROUP_STATUS_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups/${groupID}/services/status`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const updateGroupStatus = (instanceID, groupID, body) =>
  dispatch => dispatch(fetchUpdateGroupStatus(instanceID, groupID, body))
