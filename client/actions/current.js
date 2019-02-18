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
import { DEFAULT } from '../constants'
import { normalize } from 'normalizr'

export const TOGGLE_COLLAPSED = 'TOGGLE_COLLAPSED'

export function toggleCollapsed(collapsed) {
  return {
    type: TOGGLE_COLLAPSED,
    collapsed,
  }
}

export const SET_CURRENT_CONFIG = 'SET_CURRENT_CONFIG'

export function setCurrentConfig(current) {
  return {
    current,
    type: SET_CURRENT_CONFIG,
  }
}

export const SET_PROJECT_CONFIG = 'SET_PROJECT_CONFIG'

export function setProjectConfig(current) {
  return {
    current,
    type: SET_PROJECT_CONFIG,
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

// export const USER_PROJECTS_REQUEST = 'USER_PROJECTS_REQUEST'
// export const USER_PROJECTS_SUCCESS = 'USER_PROJECTS_SUCCESS'
// export const USER_PROJECTS_FAILURE = 'USER_PROJECTS_FAILURE'

// // Get projects of user.
// // Relies on the custom API middleware defined in ../middleware/api.js.
// const fetchUserProjects = (userID, query) => {
//   return {
//     [CALL_API]: {
//       types: [ USER_PROJECTS_REQUEST, USER_PROJECTS_SUCCESS, USER_PROJECTS_FAILURE ],
//       endpoint: `/users/${userID}/projects?${toQuerystring(query)}`,
//       schema: Schemas.PROJECT_ARRAY_DATA,
//     },
//   }
// }

// // Fetches projects of user.
// // Relies on Redux Thunk middleware.
// export const getUserProjects = (userID, query) => dispatch => {
//   return dispatch(fetchUserProjects(userID, query))
// }

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
      endpoint: `/projects/${namespace}/visible-clusters?${toQuerystring(query)}`,
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

export const FETCH_ALL_CLUSTERS_REQUEST = 'FETCH_ALL_CLUSTERS_REQUEST'
export const FETCH_ALL_CLUSTERS_SUCCESS = 'FETCH_ALL_CLUSTERS_SUCCESS'
export const FETCH_ALL_CLUSTERS_FAILURE = 'FETCH_ALL_CLUSTERS_FAILURE'

// Get all clusters
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchAllClusters = query => {
  return {
    [CALL_API]: {
      types: [ FETCH_ALL_CLUSTERS_REQUEST, FETCH_ALL_CLUSTERS_SUCCESS, FETCH_ALL_CLUSTERS_FAILURE ],
      endpoint: `/clusters?${toQuerystring(query)}`,
      schema: Schemas.ALL_CLUSTERS_ARRAY_DATA,
    },
  }
}

// Fetches all clusters
// Relies on Redux Thunk middleware.

export const getAllClusters = query => dispatch => {
  return dispatch(fetchAllClusters(query))
}

export const FETCH_PROJECT_LIST_REQUEST = 'FETCH_PROJECT_LIST_REQUEST'
export const FETCH_PROJECT_LIST_SUCCESS = 'FETCH_PROJECT_LIST_SUCCESS'
export const FETCH_PROJECT_LIST_FAILURE = 'FETCH_PROJECT_LIST_FAILURE'

// Get clusters of projectList.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchProjectList = query => {
  return {
    [CALL_API]: {
      types: [ FETCH_PROJECT_LIST_REQUEST, FETCH_PROJECT_LIST_SUCCESS, FETCH_PROJECT_LIST_FAILURE ],
      // 使用新的api, 老的api查询速度特别慢
      // endpoint: `/projects/list?${toQuerystring(query)}`,
      endpoint: `/projects/listwithoutstatistic?${toQuerystring(query)}`,
      schema: Schemas.PROJECTLIST_ARRAY_DATA,
    },
  }
}

export const getProjectList = query => dispatch => {
  return dispatch(fetchProjectList(query))
}

export function setCurrentUser(user) {
  return {
    response: {
      result: {
        data: {
          user,
        },
      },
    },
    type: CURRENT_USER_SUCCESS,
  }
}

export function setListProjects(projects) {
  let response = {
    data: { projects },
  }
  response = normalize(response, Schemas.PROJECTLIST_ARRAY_DATA)
  return {
    response,
    type: FETCH_PROJECT_LIST_SUCCESS,
  }
}

export function setProjectClusters(namespace, clusters) {
  let response = {
    data: { clusters },
  }
  response = normalize(response, Schemas.CLUSTER_ARRAY_DATA)
  return {
    namespace,
    response,
    type: PROJECT_CLUSTERS_SUCCESS,
  }
}
