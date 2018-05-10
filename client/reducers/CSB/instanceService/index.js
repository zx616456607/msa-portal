/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * InstanceService reducers for redux
 *
 * 2017-12-22
 * @author zhaoyb
 */
import * as ActionTypes from '../../../actions/CSB/instanceService'
import { getQueryKey } from '../../../common/utils'
import union from 'lodash/union'
import pick from 'lodash/pick'

export const publishedService = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_INSTANCE_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        },
      }
    case ActionTypes.FETCH_CSB_INSTANCE_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const serviceCAL = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_SUCCESS:
      return {
        ...state,
        [key]: {
          isFetching: false,
          data: action.response.result,
        },
      }
    case ActionTypes.FETCH_CSB_INSTANCE_SERVICE_ACL_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const subscribableServices = (state = {}, action) => {
  const { type, query } = action
  const key = getQueryKey(query)
  switch (type) {
    case ActionTypes.SUBSCRIBEABLE_SERVICES_REQUEST:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: true,
        }),
      }
    case ActionTypes.SUBSCRIBEABLE_SERVICES_SUCCESS:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
          ids: action.response.result.data.content,
          totalElements: action.response.result.data.totalElements,
          size: action.response.result.data.size,
        }),
      }
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_FAILURE:
      return {
        ...state,
        [key]: Object.assign({}, state[key], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const serviceOverview = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.response.result.data,
      }
    case ActionTypes.FETCH_CSB_SERVICE_OVERVIEW_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

export const cascadedServicePrerequisite = (state = {}, action) => {
  const { type, pathId } = action
  switch (type) {
    case ActionTypes.CSB_CASCADED_SERVICES_PREREQUISITE_REQUEST:
      return {
        ...state,
        [pathId]: {
          isFetching: true,
        },
      }
    case ActionTypes.CSB_CASCADED_SERVICES_PREREQUISITE_SUCCESS:
      return {
        ...state,
        [pathId]: {
          isFetching: false,
          ...action.response.result.data,
        },
      }
    case ActionTypes.CSB_CASCADED_SERVICES_PREREQUISITE_FAILURE:
      return {
        ...state,
        [pathId]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

export const serviceDetailMap = (state = {}, action) => {
  const { type, serviceId } = action
  switch (type) {
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_REQUEST:
      return {
        ...state,
        [serviceId]: Object.assign({}, state[serviceId], {
          isFetching: true,
        }),
      }
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_SUCCESS:
      return {
        ...state,
        [serviceId]: {
          isFetching: false,
          data: action.response.result.data,
        },
      }
    case ActionTypes.FETCH_CSB_SERVICE_DETAIL_MAP_FAILURE:
      return {
        ...state,
        [serviceId]: Object.assign({}, state[serviceId], {
          isFetching: false,
        }),
      }
    default:
      return state
  }
}

export const cascadedServicesWebsocket = (state = {}, action) => {
  const { type, ws } = action
  switch (type) {
    case ActionTypes.SAVE_CASCADED_SERVICES_WEBSOCKET:
      return ws
    case ActionTypes.REMOVE_CASCADED_SERVICES_WEBSOCKET:
      return null
    default:
      return state
  }
}

export const cascadedServicesProgresses = (state = {}, action) => {
  const { type, progress, serviceName, serviceVersion } = action
  const cascadedService = progress && progress.action && progress.action.cascadedService
  let fullname
  if (cascadedService) {
    fullname = `${cascadedService.serviceName}:${cascadedService.serviceVersion}`
  }
  switch (type) {
    case ActionTypes.SAVE_CASCADED_SERVICES_PROGRESS:
      return {
        ...state,
        [fullname]: union(state[fullname], [ progress ]),
      }
    case ActionTypes.REMOVE_CASCADED_SERVICES_PROGRESS:
      return pick(state, Object.keys(state).filter(key => key !== `${serviceName}:${serviceVersion}`))
    default:
      return state
  }
}

export const serviceCascadedInfo = (state = {}, action) => {
  const { serviceName, type } = action
  switch (type) {
    case ActionTypes.GET_SERVICE_CASCADED_INFO_REQUEST:
      return {
        ...state,
        [serviceName]: {
          isFetching: true,
        },
      }
    case ActionTypes.GET_SERVICE_CASCADED_INFO_SUCCESS:
      return {
        ...state,
        [serviceName]: {
          isFetching: false,
          result: action.response.result.data,
        },
      }
    case ActionTypes.GET_SERVICE_CASCADED_INFO_FALIURE:
      return {
        ...state,
        [serviceName]: {
          isFetching: false,
        },
      }
    default:
      return state
  }
}

export const cascadedServiceDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_CASCADED_SERVICE_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case ActionTypes.GET_CASCADED_SERVICE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.response.result.data,
      })
    case ActionTypes.GET_CASCADED_SERVICE_DETAIL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}
