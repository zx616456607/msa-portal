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

function user(state, action) {
  switch (action.type) {
    case ActionTypes.CURRENT_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.CURRENT_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        info: action.response.result.data,
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
          ids: action.response.result.data.cluster,
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

const current = (state = {
  config: { project: {}, cluster: {} },
  user: {},
  projects: {},
  clusters: {},
}, action) => {
  return {
    config: config(state.config, action),
    user: user(state.user, action),
    projects: projects(state.projects, action),
    clusters: clusters(state.clusters, action),
  }
}

export default current
