/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Current aciton
 *
 * 2017-08-29
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import { toQuerystring } from '../common/utils'
import { USER_CURRENT_CONFIG, DEFAULT } from '../constants'

export const SET_CURRENT_CONFIG = 'SET_CURRENT_CONFIG'

export function setCurrentConfig(current) {
  if (localStorage) {
    const config = localStorage.getItem(USER_CURRENT_CONFIG)
    let [ namespace, clusterID ] = config && config.split(',') || []
    if (current.project) {
      namespace = current.project.namespace
    }
    if (current.cluster) {
      clusterID = current.cluster.id
    }
    if (namespace && clusterID) {
      localStorage.setItem(USER_CURRENT_CONFIG, `${namespace},${clusterID}`)
    }
  }
  return {
    current,
    type: SET_CURRENT_CONFIG,
  }
}

export const CURRENT_USER_REQUEST = 'CURRENT_USER_REQUEST'
export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const CURRENT_USER_FAILURE = 'CURRENT_USER_FAILURE'

// Get current user info.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCurrentUser = userID => {
  return {
    userID,
    [CALL_API]: {
      types: [ CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE ],
      endpoint: `/users/${userID}`,
      schema: {},
    },
  }
}

// Fetches current user info.
// Relies on Redux Thunk middleware.
export const getCurrentUser = userID => dispatch => {
  return dispatch(fetchCurrentUser(userID))
}

export const USER_PROJECTS_REQUEST = 'USER_PROJECTS_REQUEST'
export const USER_PROJECTS_SUCCESS = 'USER_PROJECTS_SUCCESS'
export const USER_PROJECTS_FAILURE = 'USER_PROJECTS_FAILURE'

// Get projects of user.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUserProjects = (userID, query) => {
  return {
    [CALL_API]: {
      types: [ USER_PROJECTS_REQUEST, USER_PROJECTS_SUCCESS, USER_PROJECTS_FAILURE ],
      endpoint: `/users/${userID}/projects?${toQuerystring(query)}`,
      schema: Schemas.PROJECT_ARRAY_DATA,
    },
  }
}

// Fetches projects of user.
// Relies on Redux Thunk middleware.
export const getUserProjects = (userID, query) => dispatch => {
  return dispatch(fetchUserProjects(userID, query))
}

export const PROJECT_CLUSTERS_REQUEST = 'PROJECT_CLUSTERS_REQUEST'
export const PROJECT_CLUSTERS_SUCCESS = 'PROJECT_CLUSTERS_SUCCESS'
export const PROJECT_CLUSTERS_FAILURE = 'PROJECT_CLUSTERS_FAILURE'

// Get clusters of project.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchProjectClusters = (namespace, query) => {
  return {
    namespace,
    [CALL_API]: {
      types: [ PROJECT_CLUSTERS_REQUEST, PROJECT_CLUSTERS_SUCCESS, PROJECT_CLUSTERS_FAILURE ],
      endpoint: `/projects/${namespace}/clusters?${toQuerystring(query)}`,
      schema: Schemas.CLUSTER_ARRAY_DATA,
    },
  }
}

// Fetches clusters of project.
// Relies on Redux Thunk middleware.
export const getProjectClusters = (namespace, query) => dispatch => {
  return dispatch(fetchProjectClusters(namespace, query))
}

export const DEFAULT_CLUSTERS_REQUEST = 'DEFAULT_CLUSTERS_REQUEST'
export const DEFAULT_CLUSTERS_SUCCESS = 'DEFAULT_CLUSTERS_SUCCESS'
export const DEFAULT_CLUSTERS_FAILURE = 'DEFAULT_CLUSTERS_FAILURE'

// Get clusters of project.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchDefaultClusters = query => {
  const namespace = DEFAULT
  return {
    namespace,
    [CALL_API]: {
      types: [ DEFAULT_CLUSTERS_REQUEST, DEFAULT_CLUSTERS_SUCCESS, DEFAULT_CLUSTERS_FAILURE ],
      endpoint: `/clusters/${namespace}?${toQuerystring(query)}`,
      schema: Schemas.CLUSTERS_ARRAY_DATA,
      options: {
        isSpi: true,
      },
    },
  }
}

// Fetches clusters of project.
// Relies on Redux Thunk middleware.
export const getDefaultClusters = query => dispatch => {
  return dispatch(fetchDefaultClusters(query))
}
