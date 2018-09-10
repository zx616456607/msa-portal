/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Current reducers for redux
 *
 * 2017-08-29
 * @author zhangpc
 */

import * as ActionTypes from '../actions/current'

function config(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CONFIG:
      return {
        ...state,
        ...action.current,
      }
    default:
      return state
  }
}

function projectConfig(state, action) {
  switch (action.type) {
    case ActionTypes.SET_PROJECT_CONFIG:
      return {
        ...state,
        ...action.current,
      }
    default:
      return state
  }
}

function user(state, action) {
  const { userID, type } = action
  switch (type) {
    case ActionTypes.CURRENT_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.CURRENT_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        info: Object.assign({ userID }, action.response.result.data),
      }
    case ActionTypes.CURRENT_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

function projects(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_PROJECTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.USER_PROJECTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.result.data,
      }
    case ActionTypes.USER_PROJECTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

function projectsList(state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECT_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_PROJECT_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.result.data.projects,
      }
    case ActionTypes.FETCH_PROJECT_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

function clusters(state = {}, action) {
  const { namespace, type } = action
  switch (type) {
    case ActionTypes.PROJECT_CLUSTERS_REQUEST:
    case ActionTypes.DEFAULT_CLUSTERS_REQUEST:
      return {
        ...state,
        [namespace]: {
          isFetching: true,
        },
      }
    case ActionTypes.PROJECT_CLUSTERS_SUCCESS:
      return {
        ...state,
        [namespace]: {
          isFetching: false,
          ids: action.response.result.data.clusters,
        },
      }
    case ActionTypes.DEFAULT_CLUSTERS_SUCCESS:
      return {
        ...state,
        [namespace]: {
          isFetching: false,
          ids: action.response.result.clusters,
        },
      }
    case ActionTypes.PROJECT_CLUSTERS_FAILURE:
    case ActionTypes.DEFAULT_CLUSTERS_FAILURE:
      return {
        ...state,
        [namespace]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

function allClusters(state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_CLUSTERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_ALL_CLUSTERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.result.clusters,
      }
    case ActionTypes.FETCH_ALL_CLUSTERS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
function ui(state = {
  collapsed: false,
}, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_COLLAPSED:
      return {
        ...state,
        collapsed: action.collapsed,
      }
    default:
      return state
  }
}
const current = (state = {
  config: { project: {}, cluster: {} },
  projectConfig: { project: {}, cluster: {} },
  user: {},
  projects: {},
  projectsList: {},
  clusters: {},
  ui: { collapsed: false },
}, action) => {
  return {
    config: config(state.config, action),
    projectConfig: projectConfig(state.projectConfig, action),
    user: user(state.user, action),
    projects: projects(state.projects, action),
    clusters: clusters(state.clusters, action),
    projectsList: projectsList(state.projectsList, action),
    allClusters: allClusters(state.allClusters, action),
    ui: ui(state.ui, action),
  }
}

export default current
