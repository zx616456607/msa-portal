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

export const UPDATE_CSB_INSTANCE_SERVICE_REQUEST = 'UPDATE_CSB_INSTANCE_SERVICE_REQUEST'
export const UPDATE_CSB_INSTANCE_SERVICE_SUCCESS = 'UPDATE_CSB_INSTANCE_SERVICE_SUCCESS'
export const UPDATE_CSB_INSTANCE_SERVICE_FAILURE = 'UPDATE_CSB_INSTANCE_SERVICE_FAILURE'

// edit an instance services
// Relies on the custom API middleware defined in ../middleware/api.js
const uptateService = (instanceId, serviceId, body) => {
  return {
    [CALL_API]: {
      types: [
        UPDATE_CSB_INSTANCE_SERVICE_REQUEST,
        UPDATE_CSB_INSTANCE_SERVICE_SUCCESS,
        UPDATE_CSB_INSTANCE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const editService = (instanceId, serviceId, body) => dispatch => {
  return dispatch(uptateService(instanceId, serviceId, body))
}

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

// export const FETCH_CSB_INSTANCE_SERVICE_DETAIL_REQUEST = 'FETCH_CSB_INSTANCE_SERVICE_DETAIL_REQUEST'
// export const FETCH_CSB_INSTANCE_SERVICE_DETAIL_SUCCESS = 'FETCH_CSB_INSTANCE_SERVICE_DETAIL_SUCCESS'
// export const FETCH_CSB_INSTANCE_SERVICE_DETAIL_FAILURE = 'FETCH_CSB_INSTANCE_SERVICE_DETAIL_FAILURE'

// const fetchInstanceServiceDetail = (instanceId, serviceId) => {
//   return {
//     [CALL_API]: {
//       types: [
//         DEL_CSB_INSTANCE_SERVICE_ACL_REQUEST,
//         DEL_CSB_INSTANCE_SERVICE_ACL_SUCCESS,
//         DEL_CSB_INSTANCE_SERVICE_ACL_FAILURE,
//       ],
//       endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/access-control`,
//       schema: Schemas.CSB_INSTANCE_SERVICE_ACL_LIST_DATA,
//     },
//   }
// }

// // export const delInstanceServiceACL = (instanceId, serviceId) => dispatch => {
// //   return dispatch(fetchInstanceServiceDetail(instanceId, serviceId))
// // }

export const SUBSCRIBEABLE_SERVICES_REQUEST = 'SUBSCRIBEABLE_SERVICES_REQUEST'
export const SUBSCRIBEABLE_SERVICES_SUCCESS = 'SUBSCRIBEABLE_SERVICES_SUCCESS'
export const SUBSCRIBEABLE_SERVICES_FAILURE = 'SUBSCRIBEABLE_SERVICES_FAILURE'

// Create an subscribable service list
// Relies on the custom API middleware defined in ../middleware/api.js.

const fetchSubscribableServices = (instanceID, query) => {
  const _query = cloneDeep(query)
  const { page } = _query
  if (page !== undefined) {
    _query.page = page - 1
  }
  return {
    query,
    [CALL_API]: {
      types: [
        SUBSCRIBEABLE_SERVICES_REQUEST,
        SUBSCRIBEABLE_SERVICES_SUCCESS,
        SUBSCRIBEABLE_SERVICES_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/services/subscribable?${toQuerystring(_query)}`,
      schema: Schemas.CSB_SUBSCRIBE_LIST_DATA,
    },
  }
}

export const subscribableServices = (instanceID, query) =>
  dispatch => dispatch(fetchSubscribableServices(instanceID, query))

export const FETCH_CSB_SERVICE_OVERVIEW_REQUEST = 'FETCH_CSB_SERVICE_OVERVIEW_REQUEST'
export const FETCH_CSB_SERVICE_OVERVIEW_SUCCESS = 'FETCH_CSB_SERVICE_OVERVIEW_SUCCESS'
export const FETCH_CSB_SERVICE_OVERVIEW_FAILURE = 'FETCH_CSB_SERVICE_OVERVIEW_FAILURE'

const fetchServiceOverview = (instanceId, serviceIds) => {
  return {
    [CALL_API]: {
      types: [
        FETCH_CSB_SERVICE_OVERVIEW_REQUEST,
        FETCH_CSB_SERVICE_OVERVIEW_SUCCESS,
        FETCH_CSB_SERVICE_OVERVIEW_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceIds}/overview`,
      schema: {},
    },
  }
}

export const getInstanceServiceOverview = (instanceId, serviceIds) => dispatch => {
  return dispatch(fetchServiceOverview(instanceId, serviceIds))
}

export const FETCH_CSB_SERVICE_DETAIL_MAP_REQUEST = 'FETCH_CSB_SERVICE_DETAIL_MAP_REQUEST'
export const FETCH_CSB_SERVICE_DETAIL_MAP_SUCCESS = 'FETCH_CSB_SERVICE_DETAIL_MAP_SUCCESS'
export const FETCH_CSB_SERVICE_DETAIL_MAP_FAILURE = 'FETCH_CSB_SERVICE_DETAIL_MAP_FAILURE'

const fetchServiceDetailMap = (instanceId, serviceId, query) => {
  return {
    serviceId,
    instanceId,
    [CALL_API]: {
      types: [
        FETCH_CSB_SERVICE_DETAIL_MAP_REQUEST,
        FETCH_CSB_SERVICE_DETAIL_MAP_SUCCESS,
        FETCH_CSB_SERVICE_DETAIL_MAP_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/datediagram?${toQuerystring(query)}`,
      schema: Schemas.CSB_INSTANCE_SERVICE_DETAIL_LIST_DATA,
    },
  }
}

export const getInstanceServiceDetailMap = (instanceId, serviceId, query) => dispatch => {
  return dispatch(fetchServiceDetailMap(instanceId, serviceId, query))
}

export const PING_CSB_INSTANCE_SERVICE_REQUEST = 'PING_CSB_INSTANCE_SERVICE_REQUEST'
export const PING_CSB_INSTANCE_SERVICE_SUCCESS = 'PING_CSB_INSTANCE_SERVICE_SUCCESS'
export const PING_CSB_INSTANCE_SERVICE_FAILURE = 'PING_CSB_INSTANCE_SERVICE_FAILURE'

// Create an instance service group
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPingService = (instanceID, query) => {
  return {
    [CALL_API]: {
      types: [
        PING_CSB_INSTANCE_SERVICE_REQUEST,
        PING_CSB_INSTANCE_SERVICE_SUCCESS,
        PING_CSB_INSTANCE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/ping?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const pingService = (instanceID, query) =>
  dispatch => dispatch(fetchPingService(instanceID, query))

export const SUBSCRIBE_SERVICE_REQUEST = 'SUBSCRIBE_SERVICE_REQUEST'
export const SUBSCRIBE_SERVICE_SUCCESS = 'SUBSCRIBE_SERVICE_SUCCESS'
export const SUBSCRIBE_SERVICE_FAILURE = 'SUBSCRIBE_SERVICE_FAILURE'

const fetchSubscribeService = (instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        SUBSCRIBE_SERVICE_REQUEST,
        SUBSCRIBE_SERVICE_SUCCESS,
        SUBSCRIBE_SERVICE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/service-subscription`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const subscribeService = (instanceID, body) =>
  dispatch => dispatch(fetchSubscribeService(instanceID, body))

export const CSB_UPLOAD_MESSAGE_CONVERTERS_REQUEST = 'CSB_UPLOAD_MESSAGE_CONVERTERS_REQUEST'
export const CSB_UPLOAD_MESSAGE_CONVERTERS_SUCCESS = 'CSB_UPLOAD_MESSAGE_CONVERTERS_SUCCESS'
export const CSB_UPLOAD_MESSAGE_CONVERTERS_FAILURE = 'CSB_UPLOAD_MESSAGE_CONVERTERS_FAILURE'

const fetchUploadMsgConverters = (instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        CSB_UPLOAD_MESSAGE_CONVERTERS_REQUEST,
        CSB_UPLOAD_MESSAGE_CONVERTERS_SUCCESS,
        CSB_UPLOAD_MESSAGE_CONVERTERS_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/message-converters`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const uploadMsgConverters = (instanceID, body) =>
  dispatch => dispatch(fetchUploadMsgConverters(instanceID, body))

// cascaded-services/prerequisite
export const CSB_CASCADED_SERVICES_PREREQUISITE_REQUEST = 'CSB_CASCADED_SERVICES_PREREQUISITE_REQUEST'
export const CSB_CASCADED_SERVICES_PREREQUISITE_SUCCESS = 'CSB_CASCADED_SERVICES_PREREQUISITE_SUCCESS'
export const CSB_CASCADED_SERVICES_PREREQUISITE_FAILURE = 'CSB_CASCADED_SERVICES_PREREQUISITE_FAILURE'

const fetchCascadedServicesPrerequisite = (query = {}) => {
  const { pathId } = query
  return {
    pathId,
    [CALL_API]: {
      types: [
        CSB_CASCADED_SERVICES_PREREQUISITE_REQUEST,
        CSB_CASCADED_SERVICES_PREREQUISITE_SUCCESS,
        CSB_CASCADED_SERVICES_PREREQUISITE_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/cascaded-services/prerequisite?${toQuerystring(query)}`,
      schema: {},
    },
  }
}

export const getCascadedServicesPrerequisite = query =>
  dispatch => dispatch(fetchCascadedServicesPrerequisite(query))

// save cascaded services websocket to store
export const SAVE_CASCADED_SERVICES_WEBSOCKET = 'SAVE_CASCADED_SERVICES_WEBSOCKET'

export const saveCascadedServicesWs = ws => ({
  ws,
  type: SAVE_CASCADED_SERVICES_WEBSOCKET,
})

// remove cascaded services websocket from store
export const REMOVE_CASCADED_SERVICES_WEBSOCKET = 'REMOVE_CASCADED_SERVICES_WEBSOCKET'

export const removeCascadedServicesWs = () => ({
  type: REMOVE_CASCADED_SERVICES_WEBSOCKET,
})

// save cascaded services websocket progress to store
export const SAVE_CASCADED_SERVICES_PROGRESS = 'SAVE_CASCADED_SERVICES_PROGRESS'

export const saveCascadedServicesProgress = progress => ({
  progress,
  type: SAVE_CASCADED_SERVICES_PROGRESS,
})

// remove cascaded services websocket progress from store
export const REMOVE_CASCADED_SERVICES_PROGRESS = 'REMOVE_CASCADED_SERVICES_PROGRESS'

export const removeCascadedServicesProgress = (serviceName, serviceVersion) => ({
  serviceName,
  serviceVersion,
  type: REMOVE_CASCADED_SERVICES_PROGRESS,
})

// 黑白名单
export const CREATE_BLACK_AND_WHITE_LIST_REQUEST = 'CREATE_BLACK_AND_WHITE_LIST_REQUEST'
export const CREATE_BLACK_AND_WHITE_LIST_SUCCESS = 'CREATE_BLACK_AND_WHITE_LIST_SUCCESS'
export const CREATE_BLACK_AND_WHITE_LIST_FALIURE = 'CREATE_BLACK_AND_WHITE_LIST_FALIURE'

function fetchCreateBlackAndWhiteList(instanceId, serviceId, body) {
  return {
    [CALL_API]: {
      types: [
        CREATE_BLACK_AND_WHITE_LIST_REQUEST,
        CREATE_BLACK_AND_WHITE_LIST_SUCCESS,
        CREATE_BLACK_AND_WHITE_LIST_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/blackorwhite`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createBlackAndWhiteList = (instanceId, serviceId, body) =>
  dispatch => dispatch(fetchCreateBlackAndWhiteList(instanceId, serviceId, body))

// 获取当前服务的黑白名单
export const GET_SERVICE_BLACK_AND_WHITE_LIST_REQUEST = 'GET_SERVICE_BLACK_AND_WHITE_LIST_REQUEST'
export const GET_SERVICE_BLACK_AND_WHITE_LIST_SUCCESS = 'GET_SERVICE_BLACK_AND_WHITE_LIST_SUCCESS'
export const GET_SERVICE_BLACK_AND_WHITE_LIST_FALIURE = 'GET_SERVICE_BLACK_AND_WHITE_LIST_FALIURE'

function fetchGetServiceBlackAndWhiteList(instanceId, serviceId) {
  return {
    [CALL_API]: {
      types: [
        GET_SERVICE_BLACK_AND_WHITE_LIST_REQUEST,
        GET_SERVICE_BLACK_AND_WHITE_LIST_SUCCESS,
        GET_SERVICE_BLACK_AND_WHITE_LIST_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}/blackorwhite`,
      schema: {},
    },
  }
}

export const getServiceBlackAndWhiteList = (instanceId, serviceId) =>
  dispatch => dispatch(fetchGetServiceBlackAndWhiteList(instanceId, serviceId))

// 修改已发布的服务
export const EIDT_PUBLISHED_SERVICE_REQUEST = 'EIDT_PUBLISHED_SERVICE_REQUEST'
export const EIDT_PUBLISHED_SERVICE_SUCCESS = 'EIDT_PUBLISHED_SERVICE_SUCCESS'
export const EIDT_PUBLISHED_SERVICE_FALIURE = 'EIDT_PUBLISHED_SERVICE_FALIURE'

function fetchEditPublishedService(instanceId, serviceId, body) {
  return {
    [CALL_API]: {
      types: [
        EIDT_PUBLISHED_SERVICE_REQUEST,
        EIDT_PUBLISHED_SERVICE_SUCCESS,
        EIDT_PUBLISHED_SERVICE_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services/${serviceId}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: {},
    },
  }
}

export const editPublishedService = (instanceId, serviceId, body) =>
  dispatch => dispatch(fetchEditPublishedService(instanceId, serviceId, body))

// 获取服务详情中级联发布相关的信息
export const GET_SERVICE_CASCADED_INFO_REQUEST = 'GET_SERVICE_CASCADED_INFO_REQUEST'
export const GET_SERVICE_CASCADED_INFO_SUCCESS = 'GET_SERVICE_CASCADED_INFO_SUCCESS'
export const GET_SERVICE_CASCADED_INFO_FALIURE = 'GET_SERVICE_CASCADED_INFO_FALIURE'

function fetchGetServiceCascadedInfo(clusterId, serviceName, serviceVersion) {
  return {
    serviceName,
    [CALL_API]: {
      types: [
        GET_SERVICE_CASCADED_INFO_REQUEST,
        GET_SERVICE_CASCADED_INFO_SUCCESS,
        GET_SERVICE_CASCADED_INFO_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/clusters/${clusterId}/instance/${serviceName}/versions/${serviceVersion}/status`,
      schema: {},
    },
  }
}

export const getServiceCascadedInfo = (clusterId, serviceName, serviceVersion) =>
  dispatch => dispatch(fetchGetServiceCascadedInfo(clusterId, serviceName, serviceVersion))

// 获取某一个级联服务
export const GET_CASCADED_SERVICE_DETAIL_REQUEST = 'GET_CASCADED_SERVICE_DETAIL_REQUEST'
export const GET_CASCADED_SERVICE_DETAIL_SUCCESS = 'GET_CASCADED_SERVICE_DETAIL_SUCCESS'
export const GET_CASCADED_SERVICE_DETAIL_FAILURE = 'GET_CASCADED_SERVICE_DETAIL_FAILURE'

function fetchCascadedDetail(name, version) {
  return {
    [CALL_API]: {
      types: [
        GET_CASCADED_SERVICE_DETAIL_REQUEST,
        GET_CASCADED_SERVICE_DETAIL_SUCCESS,
        GET_CASCADED_SERVICE_DETAIL_FAILURE
      ],
      endpoint: `${CSB_API_URL}/cascaded-services/${name}/versions/${version}`,
      schema: {},
    }
  }
}

export const getCascadedDetail = (name, version) =>
  dispatch => dispatch(fetchCascadedDetail(name, version))
