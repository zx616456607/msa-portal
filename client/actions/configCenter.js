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

const fetchBranch = query => {
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_BRANCH_LIST_REQUEST, CENTER_BRANCH_LIST_SUCCESS, CENTER_BRANCH_LIST_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${query.clusterId}/configserver/branches?project_url=${query.url}`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getBranchList = query => dispatch => {
  return dispatch(fetchBranch(query))
}

export const CENTER_SERVICE_INFO_REQUEST = 'CENTER_SERVICE_INFO_REQUEST'
export const CENTER_SERVICE_INFO_SUCCESS = 'CENTER_SERVICE_INFO_SUCCESS'
export const CENTER_SERVICE_INFO_FAILURE = 'CENTER_SERVICE_INFO_FAILURE'

const fetchCenterEvn = query => {
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_SERVICE_INFO_REQUEST, CENTER_SERVICE_INFO_SUCCESS, CENTER_SERVICE_INFO_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${query.clusterId}/configserver/files?project_url=${query.url}&branch_name=${query.branchName}`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getCenterEvn = query => dispatch => {
  return dispatch(fetchCenterEvn(query))
}

export const CENTER_CONFIG_INFO_REQUEST = 'CENTER_CONFIG_INFO_REQUEST'
export const CENTER_CONGIG_INFO_SUCCESS = 'CENTER_CONGIG_INFO_SUCCESS'
export const CENTER_CONFIG_INFO_FAILURE = 'CENTER_CONFIG_INFO_FAILURE'

const fetchCenterConfig = query => {
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_CONFIG_INFO_REQUEST, CENTER_CONGIG_INFO_SUCCESS, CENTER_CONFIG_INFO_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${query.clusterId}/configserver/files/${query.id}?project_url=${query.url}`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

export const getCenterConfig = query => dispatch => {
  return dispatch(fetchCenterConfig(query))
}

export const CENTER_DELETE_REQUEST = 'CENTER_DELETE_REQUEST'
export const CENTER_DELETE_SUCCESS = 'CENTER_DELETE_SUCCESS'
export const CENTER_DELETE_FAILURE = 'CENTER_DELETE_FAILURE'

const DeleteCenter = query => {
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_DELETE_REQUEST, CENTER_DELETE_SUCCESS, CENTER_DELETE_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${query.clusterId}/configserver/files?project_url=${query.url}&branch_name=${query.branchName}&file_path=${query.configName}&commit_message=${query.message}`,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

export const delCenterConfig = query => dispatch => {
  return dispatch(DeleteCenter(query))
}

export const CENTER_UPDATE_REQUEST = 'CENTER_UPDATE_REQUEST'
export const CENTER_UPDATE_SUCCESS = 'CENTER_UPDATE_SUCCESS'
export const CENTER_UPDATE_FAILURE = 'CENTER_UPDATE_FAILURE'

const UpdateCenter = query => {
  return {
    query,
    [CALL_API]: {
      types: [ CENTER_UPDATE_REQUEST, CENTER_UPDATE_SUCCESS, CENTER_UPDATE_FAILURE ],
      endpoint: `${MSA_API_URL}/clusters/${query.clusterId}/configserver/files?project_url=${query.url}&branch_name=${query.branchName}&file_path=${query.configName}&commit_message=${query.message}`,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}

export const putCenterConfig = query => dispatch => {
  return dispatch(UpdateCenter(query))
}

