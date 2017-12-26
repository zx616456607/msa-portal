/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB PublishedService aciton
 *
 * 2017-12-21
 * @author zhaoyb
 */

import { CALL_API } from '../../../middleware/api'
import { toQuerystring } from '../../../common/utils'
import { API_CONFIG } from '../../../constants'
import cloneDeep from 'lodash/cloneDeep'
import { Schemas } from '../../../middleware/schemas'

const { CSB_API_URL } = API_CONFIG

export const FETCH_CSB_INSTANCE_REQUEST = 'FETCH_CSB_INSTANCE_REQUEST'
export const FETCH_CSB_INSTANCE_SUCCESS = 'FETCH_CSB_INSTANCE_SUCCESS'
export const FETCH_CSB_INSTANCE_FAILURE = 'FETCH_CSB_INSTANCE_FAILURE'

// Create an instance service list
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchInstanceServiceList = (instanceId, query = {}) => {
  const _query = cloneDeep(query)
  const { page } = _query
  if (page !== undefined) {
    _query.page = page - 1
  }
  return {
    instanceId,
    query,
    [CALL_API]: {
      types: [
        FETCH_CSB_INSTANCE_REQUEST,
        FETCH_CSB_INSTANCE_SUCCESS,
        FETCH_CSB_INSTANCE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services?${toQuerystring(_query)}`,
      schema: Schemas.CSB_PUBLISHED_LIST_DATA,
    },
  }
}

export const getInstanceService = (instanceId, query) => dispatch => {
  return dispatch(fetchInstanceServiceList(instanceId, query))
}

export const CREATE_CSB_INSTANCE_SERVICE_REQUEST = 'CREATE_CSB_INSTANCE_SERVICE_REQUEST'
export const CREATE_CSB_INSTANCE_SERVICE_SUCCESS = 'CREATE_CSB_INSTANCE_SERVICE_SUCCESS'
export const CREATE_CSB_INSTANCE_SERVICE_FAILURE = 'CREATE_CSB_INSTANCE_SERVICE_FAILURE'

// fetch an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCreateService = (instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        CREATE_CSB_INSTANCE_SERVICE_REQUEST,
        CREATE_CSB_INSTANCE_SERVICE_SUCCESS,
        CREATE_CSB_INSTANCE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/services`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createService = (instanceID, body) =>
  dispatch => dispatch(fetchCreateService(instanceID, body))

export const PUT_CSB_INSTANCE_SERVICE_REQUEST = 'PUT_CSB_INSTANCE_SERVICE_REQUEST'
export const PUT_CSB_INSTANCE_SERVICE_SUCCESS = 'PUT_CSB_INSTANCE_SERVICE_SUCCESS'
export const PUT_CSB_INSTANCE_SERVICE_FAILURE = 'PUT_CSB_INSTANCE_SERVICE_FAILURE'

// edit an instance service
// Relies on the custom API middleware defined in ../middleware/api.js.
const editInstanceService = (instanceId, serviceId, body) => {
  return {
    [CALL_API]: {
      types: [
        PUT_CSB_INSTANCE_SERVICE_REQUEST,
        PUT_CSB_INSTANCE_SERVICE_SUCCESS,
        PUT_CSB_INSTANCE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/status`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const PutInstanceService = (instanceId, serviceId, body) => dispatch => {
  return dispatch(editInstanceService(instanceId, serviceId, body))
}

export const DEL_CSB_INSTANCE_SERVICE_REQUEST = 'DEL_CSB_INSTANCE_SERVICE_REQUEST'
export const DEL_CSB_INSTANCE_SERVICE_SUCCESS = 'DEL_CSB_INSTANCE_SERVICE_SUCCESS'
export const DEL_CSB_INSTANCE_SERVICE_FAILURE = 'DEL_CSB_INSTANCE_SERVICE_FAILURE'

// delete an instance service
// Relies on the custom API middleware defined in ../middleware/api.js.
const rmInstanceService = (instanceId, id) => {
  return {
    [CALL_API]: {
      types: [
        DEL_CSB_INSTANCE_SERVICE_REQUEST,
        DEL_CSB_INSTANCE_SERVICE_SUCCESS,
        DEL_CSB_INSTANCE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${id}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const delInstanceService = (instanceId, id) => dispatch => {
  return dispatch(rmInstanceService(instanceId, id))
}

export const FETCH_CSB_INSTANCE_SERVICE_ACL_REQUEST = 'FETCH_CSB_INSTANCE_SERVICE_ACL_REQUEST'
export const FETCH_CSB_INSTANCE_SERVICE_ACL_SUCCESS = 'FETCH_CSB_INSTANCE_SERVICE_ACL_SUCCESS'
export const FETCH_CSB_INSTANCE_SERVICE_ACL_FAILURE = 'FETCH_CSB_INSTANCE_SERVICE_ACL_FAILURE'

// fetch an instance service ACL
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchInstanceServiceACL = (instanceId, serviceId) => {
  return {
    [CALL_API]: {
      types: [
        FETCH_CSB_INSTANCE_SERVICE_ACL_REQUEST,
        FETCH_CSB_INSTANCE_SERVICE_ACL_SUCCESS,
        FETCH_CSB_INSTANCE_SERVICE_ACL_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/access-control`,
      schema: Schemas.CSB_INSTANCE_SERVICE_ACL_LIST_DATA,
    },
  }
}

export const getInstanceServiceACL = (instanceId, serviceId) => dispatch => {
  return dispatch(fetchInstanceServiceACL(instanceId, serviceId))
}

export const DEL_CSB_INSTANCE_SERVICE_ACL_REQUEST = 'DEL_CSB_INSTANCE_SERVICE_ACL_REQUEST'
export const DEL_CSB_INSTANCE_SERVICE_ACL_SUCCESS = 'DEL_CSB_INSTANCE_SERVICE_ACL_SUCCESS'
export const DEL_CSB_INSTANCE_SERVICE_ACL_FAILURE = 'DEL_CSB_INSTANCE_SERVICE_ACL_FAILURE'

const rmInstanceServiceACL = (instanceId, serviceId) => {
  return {
    [CALL_API]: {
      types: [
        DEL_CSB_INSTANCE_SERVICE_ACL_REQUEST,
        DEL_CSB_INSTANCE_SERVICE_ACL_SUCCESS,
        DEL_CSB_INSTANCE_SERVICE_ACL_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/access-control`,
      schema: Schemas.CSB_INSTANCE_SERVICE_ACL_LIST_DATA,
    },
  }
}

export const delInstanceServiceACL = (instanceId, serviceId) => dispatch => {
  return dispatch(rmInstanceServiceACL(instanceId, serviceId))
}

export const FETCH_CSB_SERVICE_DETAIL_REQUEST = 'FETCH_CSB_SERVICE_DETAIL_REQUEST'
export const FETCH_CSB_SERVICE_DETAIL_SUCCESS = 'FETCH_CSB_SERVICE_DETAIL_SUCCESS'
export const FETCH_CSB_SERVICE_DETAIL_FAILURE = 'FETCH_CSB_SERVICE_DETAIL_FAILURE'

const fetchServiceDetail = (instanceId, serviceId) => {
  return {
    [CALL_API]: {
      types: [
        FETCH_CSB_SERVICE_DETAIL_REQUEST,
        FETCH_CSB_SERVICE_DETAIL_SUCCESS,
        FETCH_CSB_SERVICE_DETAIL_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/overview`,
      schema: Schemas.CSB_INSTANCE_SERVICE_DETAIL_LIST_DATA,
    },
  }
}

export const getInstanceServiceDetail = (instanceId, serviceId) => dispatch => {
  return dispatch(fetchServiceDetail(instanceId, serviceId))
}
