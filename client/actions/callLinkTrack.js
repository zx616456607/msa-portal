/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * call link track action
 *
 * @author zhaoyb
 * @date 2018-06-29
 */
import { CALL_API } from '../middleware/api'
import { toQuerystring } from '../common/utils'
import {
  API_CONFIG,
} from '../constants'
const { ZIPKIN_API_URL } = API_CONFIG

export const GET_ZIPKIN_SERVICES_REQUEST = 'GET_ZIPKIN_SERVICES_REQUEST'
export const GET_ZIPKIN_SERVICES_SUCCESS = 'GET_ZIPKIN_SERVICES_SUCCESS'
export const GET_ZIPKIN_SERVICES_FAILURE = 'GET_ZIPKIN_SERVICES_FAILURE'

const fetchZipkinServices = clusterId => {
  const endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/services`
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_SERVICES_REQUEST,
        GET_ZIPKIN_SERVICES_SUCCESS,
        GET_ZIPKIN_SERVICES_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export const getZipkinServices = clusterId =>
  dispatch => dispatch(fetchZipkinServices(clusterId))

export const GET_ZIPKIN_SPANS_REQUEST = 'GET_ZIPKIN_SPANS_REQUEST'
export const GET_ZIPKIN_SPANS_SUCCESS = 'GET_ZIPKIN_SPANS_SUCCESS'
export const GET_ZIPKIN_SPANS_FAILURE = 'GET_ZIPKIN_SPANS_FAILURE'

const fetchZipkinSpans = (clusterId, query) => {
  let endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/spans`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_SPANS_REQUEST,
        GET_ZIPKIN_SPANS_SUCCESS,
        GET_ZIPKIN_SPANS_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export const getZipkinSpans = (clusterId, query) =>
  dispatch => dispatch(fetchZipkinSpans(clusterId, query))

export const GET_ZIPKIN_TRACES_REQUEST = 'GET_ZIPKIN_TRACES_REQUEST'
export const GET_ZIPKIN_TRACES_SUCCESS = 'GET_ZIPKIN_TRACES_SUCCESS'
export const GET_ZIPKIN_TRACES_FAILURE = 'GET_ZIPKIN_TRACES_FAILURE'

const fetchZipkinTracesList = (clusterId, query = {}, options) => {
  let endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/traces`
  if (query.traceId) {
    endpoint += `/${query.traceId}`
  } else {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    traceId: query.traceId,
    serviceName: query.serviceName,
    options,
    [CALL_API]: {
      types: [
        GET_ZIPKIN_TRACES_REQUEST,
        GET_ZIPKIN_TRACES_SUCCESS,
        GET_ZIPKIN_TRACES_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export const getZipkinTracesList = (clusterId, query, options) =>
  dispatch => dispatch(fetchZipkinTracesList(clusterId, query, options))

export const GET_ZIPKIN_TRACE_REQUEST = 'GET_ZIPKIN_TRACE_REQUEST'
export const GET_ZIPKIN_TRACE_SUCCESS = 'GET_ZIPKIN_TRACE_SUCCESS'
export const GET_ZIPKIN_TRACE_FAILURE = 'GET_ZIPKIN_TRACE_FAILURE'

const fetchZipkinTrace = (clusterId, traceId) => {
  const endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/traces/${traceId}`
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_TRACE_REQUEST,
        GET_ZIPKIN_TRACE_SUCCESS,
        GET_ZIPKIN_TRACE_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export const getZipkinTrace = (clusterId, traceId) =>
  dispatch => dispatch(fetchZipkinTrace(clusterId, traceId))

export const GET_ZIPKIN_DEPENDENCIES_REQUEST = 'GET_ZIPKIN_DEPENDENCIES_REQUEST'
export const GET_ZIPKIN_DEPENDENCIES_SUCCESS = 'GET_ZIPKIN_DEPENDENCIES_SUCCESS'
export const GET_ZIPKIN_DEPENDENCIES_FAILURE = 'GET_ZIPKIN_DEPENDENCIES_FAILURE'

const fetchZipkinDependencies = (clusterId, query) => {
  let endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/dependencies`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_DEPENDENCIES_REQUEST,
        GET_ZIPKIN_DEPENDENCIES_SUCCESS,
        GET_ZIPKIN_DEPENDENCIES_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}

export const getZipkinDependencies = (clusterId, query) =>
  dispatch => dispatch(fetchZipkinDependencies(clusterId, query))

export const PUT_ZIPKIN_ANALYSE_REQUEST = 'PUT_ZIPKIN_ANALYSE_REQUEST'
export const PUT_ZIPKIN_ANALYSE_SUCCESS = 'PUT_ZIPKIN_ANALYSE_SUCCESS'
export const PUT_ZIPKIN_ANALYSE_FAILURE = 'PUT_ZIPKIN_ANALYSE_FAILURE'
const putZipkinAnalyse = (clusterId, query) => {
  let endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/analyse`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    [CALL_API]: {
      types: [
        PUT_ZIPKIN_ANALYSE_REQUEST,
        PUT_ZIPKIN_ANALYSE_SUCCESS,
        PUT_ZIPKIN_ANALYSE_FAILURE,
      ],
      endpoint,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}
export const callZipkinAnalyse = (clusterId, query) =>
  dispatch => dispatch(putZipkinAnalyse(clusterId, query))

export const GET_ZIPKIN_ANALYSE_STATUS_REQUEST = 'GET_ZIPKIN_ANALYSE_STATUS_REQUEST'
export const GET_ZIPKIN_ANALYSE_STATUS_SUCCESS = 'GET_ZIPKIN_ANALYSE_STATUS_SUCCESS'
export const GET_ZIPKIN_ANALYSE_STATUS_FAILURE = 'GET_ZIPKIN_ANALYSE_STATUS_FAILURE'
const getZipkinAnalyseStatus = clusterId => {
  const endpoint = `${ZIPKIN_API_URL}/clusters/${clusterId}/trace/zipkin/analyse/status`
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_ANALYSE_STATUS_REQUEST,
        GET_ZIPKIN_ANALYSE_STATUS_SUCCESS,
        GET_ZIPKIN_ANALYSE_STATUS_FAILURE,
      ],
      endpoint,
      schema: {},
    },
  }
}
export const callZipkinAnalyseStatus = clusterId =>
  dispatch => dispatch(getZipkinAnalyseStatus(clusterId))

// 给被点击的调用链上的node添加active: true 属性
export const ACTIVE_RElATION_CHART_NODE = 'ACTIVE_RElATION_CHART_NODE'

const fetchActiveRelationChartNode = (lname, operationType) => {
  return {
    type: ACTIVE_RElATION_CHART_NODE,
    lname,
    operationType,
  }
}

export const getActiveRelationChartNode = (lname, operationType) =>
  dispatch => dispatch(fetchActiveRelationChartNode(lname, operationType))

