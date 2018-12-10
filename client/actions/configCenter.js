/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm aciton
 *
 * 2017-11-04
 * @author zhaoyb
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'
import { toQuerystring } from '../common/utils'
import { CONTENT_TYPE_TEXT } from '../constants'

const { MSA_API_URL } = API_CONFIG

export const CENTER_SERVICE_URL_REQUEST = 'CENTER_SERVICE_URL_REQUEST'
export const CENTER_SERVICE_URL_SUCCESS = 'CENTER_SERVICE_URL_SUCCESS'
export const CENTER_SERVICE_URL_FAILURE = 'CENTER_SERVICE_URL_FAILURE'

const fetchServiceUrl = clusterId => {
  return {
    clusterId,
    [CALL_API]: {
      types: [ CENTER_SERVICE_URL_REQUEST, CENTER_SERVICE_URL_SUCCESS, CENTER_SERVICE_URL_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/configserver/env`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getService = clusterId => dispatch => {
  return dispatch(fetchServiceUrl(clusterId))
}

export const CENTER_BRANCH_LIST_REQUEST = 'CENTER_BRANCH_LIST_REQUEST'
export const CENTER_BRANCH_LIST_SUCCESS = 'CENTER_BRANCH_LIST_SUCCESS'
export const CENTER_BRANCH_LIST_FAILURE = 'CENTER_BRANCH_LIST_FAILURE'

const fetchBranch = (clusterId, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/branches?${toQuerystring(query)}`
  return {
    query,
    clusterId,
    [CALL_API]: {
      types: [ CENTER_BRANCH_LIST_REQUEST, CENTER_BRANCH_LIST_SUCCESS, CENTER_BRANCH_LIST_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getBranchList = (clusterId, query) => dispatch => {
  return dispatch(fetchBranch(clusterId, query))
}

export const CENTER_SERVICE_INFO_REQUEST = 'CENTER_SERVICE_INFO_REQUEST'
export const CENTER_SERVICE_INFO_SUCCESS = 'CENTER_SERVICE_INFO_SUCCESS'
export const CENTER_SERVICE_INFO_FAILURE = 'CENTER_SERVICE_INFO_FAILURE'

const fetchCenterEvn = (clusterId, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/files?${toQuerystring(query)}`
  return {
    query,
    clusterId,
    [CALL_API]: {
      types: [
        CENTER_SERVICE_INFO_REQUEST,
        CENTER_SERVICE_INFO_SUCCESS,
        CENTER_SERVICE_INFO_FAILURE,
      ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getCenterEvn = (clusterId, query) => dispatch => {
  return dispatch(fetchCenterEvn(clusterId, query))
}

export const CENTER_CONFIG_INFO_REQUEST = 'CENTER_CONFIG_INFO_REQUEST'
export const CENTER_CONGIG_INFO_SUCCESS = 'CENTER_CONGIG_INFO_SUCCESS'
export const CENTER_CONFIG_INFO_FAILURE = 'CENTER_CONFIG_INFO_FAILURE'

const fetchCenterConfig = (clusterId, id, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/filecontent?${toQuerystring(query)}`
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_CONFIG_INFO_REQUEST, CENTER_CONGIG_INFO_SUCCESS, CENTER_CONFIG_INFO_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getCenterConfig = (clusterId, id, query) => dispatch => {
  return dispatch(fetchCenterConfig(clusterId, id, query))
}

export const DELETE_BRANCH_CENTER_CONFIG_REQUEST = 'DELETE_BRANCH_CENTER_CONFIG_REQUEST'
export const DELETE_BRANCH_CENTER_CONFIG_SUCCESS = 'DELETE_BRANCH_CENTER_CONFIG_SUCCESS'
export const DELETE_BRANCH_CENTER_CONFIG_FAILURE = 'DELETE_BRANCH_CENTER_CONFIG_FAILURE'

const fetchDeleteBranch = (clusterId, query, options) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/branches?${toQuerystring(query)}`
  return {
    options,
    query,
    [CALL_API]: {
      types: [ DELETE_BRANCH_CENTER_CONFIG_REQUEST,
        DELETE_BRANCH_CENTER_CONFIG_SUCCESS, DELETE_BRANCH_CENTER_CONFIG_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export const deleteBranch = (clusterId, query, options) => dispatch => {
  return dispatch(fetchDeleteBranch(clusterId, query, options))
}

export const CREATE_BRANCH_CENTER_CONFIG_REQUEST = 'CREATE_BRANCH_CENTER_CONFIG_REQUEST'
export const CREATE_BRANCH_CENTER_CONFIG_SUCCESS = 'CREATE_BRANCH_CENTER_CONFIG_SUCCESS'
export const CREATE_BRANCH_CENTER_CONFIG_FAILURE = 'CREATE_BRANCH_CENTER_CONFIG_FAILURE'

const fetchCreateBranch = (clusterId, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/branches?${toQuerystring(query)}`
  return {
    query,
    [CALL_API]: {
      types: [ CREATE_BRANCH_CENTER_CONFIG_REQUEST,
        CREATE_BRANCH_CENTER_CONFIG_SUCCESS, CREATE_BRANCH_CENTER_CONFIG_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'POST',
      },
    },
  }
}

export const createBranch = (clusterId, query) => dispatch => {
  return dispatch(fetchCreateBranch(clusterId, query))
}

export const CENTER_CONFIG_COMMIT_REQUEST = 'CENTER_CONFIG_COMMIT_REQUEST'
export const CENTER_CONFIG_COMMIT_SUCCESS = 'CENTER_CONFIG_COMMIT_SUCCESS'
export const CENTER_CONFIG_COMMIT_FAILURE = 'CENTER_CONFIG_COMMIT_FAILURE'

const fetchCommitMessages = (clusterId, body, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/commits?${toQuerystring(query)}`
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_CONFIG_COMMIT_REQUEST,
        CENTER_CONFIG_COMMIT_SUCCESS, CENTER_CONFIG_COMMIT_FAILURE ],
      endpoint,
      schema: {},
      options: {
        body,
        method: 'POST',
      },
    },
  }
}

export const getCommitMessages = (clusterId, body, query) => dispatch => {
  return dispatch(fetchCommitMessages(clusterId, body, query))
}

export const CENTER_DELETE_REQUEST = 'CENTER_DELETE_REQUEST'
export const CENTER_DELETE_SUCCESS = 'CENTER_DELETE_SUCCESS'
export const CENTER_DELETE_FAILURE = 'CENTER_DELETE_FAILURE'

const DeleteCenter = (clusterId, query) => {
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/files?${toQuerystring(query)}`
  return {
    query,
    clusterId,
    [CALL_API]: {
      types: [ CENTER_DELETE_REQUEST, CENTER_DELETE_SUCCESS, CENTER_DELETE_FAILURE ],
      endpoint,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export const delCenterConfig = (clusterId, query) => dispatch => {
  return dispatch(DeleteCenter(clusterId, query))
}

export const CENTER_UPDATE_REQUEST = 'CENTER_UPDATE_REQUEST'
export const CENTER_UPDATE_SUCCESS = 'CENTER_UPDATE_SUCCESS'
export const CENTER_UPDATE_FAILURE = 'CENTER_UPDATE_FAILURE'

const UpdateCenter = (clusterId, yaml, query) => {
  const body = yaml
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/files?${toQuerystring(query)}`
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_UPDATE_REQUEST, CENTER_UPDATE_SUCCESS, CENTER_UPDATE_FAILURE ],
      endpoint,
      schema: {},
      options: {
        body,
        method: 'PUT',
        headers: {
          'Content-Type': CONTENT_TYPE_TEXT,
        },
      },
    },
  }
}

export const putCenterConfig = (clusterId, yaml, query) => dispatch => {
  return dispatch(UpdateCenter(clusterId, yaml, query))
}

export const CENTER_ADD_REQUEST = 'CENTER_ADD_REQUEST'
export const CENTER_ADD_SUCCESS = 'CENTER_ADD_SUCCESS'
export const CENTER_ADD_FAILURE = 'CENTER_ADD_FAILURE'

const addCenter = (clusterId, yaml, query) => {
  const body = yaml
  const endpoint = `${MSA_API_URL}/clusters/${clusterId}/configserver/files?${toQuerystring(query)}`
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_ADD_REQUEST, CENTER_ADD_SUCCESS, CENTER_ADD_FAILURE ],
      endpoint,
      schema: {},
      options: {
        headers: {
          'Content-Type': 'text/plain',
        },
        body,
        method: 'POST',
      },
    },
  }
}

export const addCenterConfig = (clusterId, yaml, query) => dispatch => {
  return dispatch(addCenter(clusterId, yaml, query))
}

export const CENTER_RELEASE_REQUEST = 'CENTER_RELEASE_REQUEST'
export const CENTER_RELEASE_SUCCESS = 'CENTER_RELEASE_SUCCESS'
export const CENTER_RELEASE_FAILURE = 'CENTER_RELEASE_FAILURE'

const ReleaseCenter = clusterID => {
  return {
    clusterID,
    [CALL_API]: {
      types: [ CENTER_RELEASE_REQUEST, CENTER_RELEASE_SUCCESS, CENTER_RELEASE_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${clusterID}/configserver/bus/refresh`,
      schema: {},
      options: {
        method: 'POST',
      },
    },
  }
}

export const releaseConfigService = clusterID => dispatch => {
  return dispatch(ReleaseCenter(clusterID))
}

export const CENTER_ENCRYPT_REQUEST = 'CENTER_ENCRYPT_REQUEST'
export const CENTER_ENCRYPT_SUCCESS = 'CENTER_ENCRYPT_SUCCESS'
export const CENTER_ENCRYPT_FAILURE = 'CENTER_ENCRYPT_FAILURE'

const fileEncrypt = (clusterId, body) => {
  return {
    body,
    clusterId,
    [CALL_API]: {
      types: [ CENTER_ENCRYPT_REQUEST, CENTER_ENCRYPT_SUCCESS, CENTER_ENCRYPT_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/configserver/encrypt`,
      schema: {},
      options: {
        body,
        method: 'POST',
      },
    },
  }
}

export const postEncrypt = (clusterId, body) => dispatch => {
  return dispatch(fileEncrypt(clusterId, body))
}

export const CENTER_DECRYPT_REQUEST = 'CENTER_DECRYPT_REQUEST'
export const CENTER_DECRYPT_SUCCESS = 'CENTER_DECRYPT_SUCCESS'
export const CENTER_DECRYPT_FAILURE = 'CENTER_DECRYPT_FAILURE'

const fileDecrypt = (clusterId, body) => {
  return {
    body,
    clusterId,
    [CALL_API]: {
      types: [ CENTER_DECRYPT_REQUEST, CENTER_DECRYPT_SUCCESS, CENTER_DECRYPT_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${clusterId}/configserver/decrypt`,
      schema: {},
      options: {
        body,
        method: 'POST',
      },
    },
  }
}

export const postDecrypt = (clusterId, body) => dispatch => {
  return dispatch(fileDecrypt(clusterId, body))
}

