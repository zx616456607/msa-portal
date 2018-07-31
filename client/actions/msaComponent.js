/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * msaOm aciton
 *
 * 2017-11-24
 * @author zhaoyb
 */

import { CALL_API } from '../middleware/api'

export const MSACOMPONENT_LIST_REQUEST = 'MSACOMPONENT_LIST_REQUEST'
export const MSACOMPONENT_LIST_SUCCESS = 'MSACOMPONENT_LIST_SUCCESS'
export const MSACOMPONENT_LIST_FAILURE = 'MSACOMPONENT_LIST_FAILURE'

const fetchMsaComponentInfo = (clusterID, apmID, project) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    apmID,
    clusterID,
    [CALL_API]: {
      types: [ MSACOMPONENT_LIST_REQUEST, MSACOMPONENT_LIST_SUCCESS, MSACOMPONENT_LIST_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${apmID.id}/components`,
      schema: {},
      options: {
        headers,
        method: 'GET',
      },
    },
  }
}

export const fetchMsaComponentList = (clusterID, apmID, project) => dispatch => {
  return dispatch(fetchMsaComponentInfo(clusterID, apmID, project))
}

export const START_COMPONENT_REQUEST = 'START_COMPONENT_REQUEST'
export const START_COMPONENT_SUCCESS = 'START_COMPONENT_SUCCESS'
export const START_COMPONENT_FALLURE = 'START_COMPONENT_FALLURE'

const startComponent = (clusterID, query) => {
  return {
    query,
    clusterID,
    [CALL_API]: {
      types: [ START_COMPONENT_REQUEST, START_COMPONENT_SUCCESS, START_COMPONENT_FALLURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${query.apmID}/components/${query.componentName}/start`,
      schema: {},
      options: {
        body: {},
        method: 'PUT',
      },
    },
  }
}

export const getStart = (clusterID, query) => dispatch => {
  return dispatch(startComponent(clusterID, query))
}

export const STOP_COMPONENT_REQUEST = 'STOP_COMPONENT_REQUEST'
export const STOP_COMPONENT_SUCCESS = 'STOP_COMPONENT_SUCCESS'
export const STOP_COMPONENT_FALLURE = 'STOP_COMPONENT_FALLURE'

const stopComponent = (clusterID, query) => {
  return {
    query,
    clusterID,
    [CALL_API]: {
      types: [ STOP_COMPONENT_REQUEST, STOP_COMPONENT_SUCCESS, STOP_COMPONENT_FALLURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${query.apmID}/components/${query.componentName}/stop`,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}

export const getStop = (clusterID, query) => dispatch => {
  return dispatch(stopComponent(clusterID, query))
}

export const REDEPLOY_COMPONENT_REQUEST = 'REDEPLOY_COMPONENT_REQUEST'
export const REDEPLOY_COMPONENT_SUCCESS = 'REDEPLOY_COMPONENT_SUCCESS'
export const REDEPLOY_COMPONENT_FALLURE = 'REDEPLOY_COMPONENT_FALLURE'

const redeployComponent = (clusterID, query) => {
  return {
    query,
    clusterID,
    [CALL_API]: {
      types: [ REDEPLOY_COMPONENT_REQUEST, REDEPLOY_COMPONENT_SUCCESS, REDEPLOY_COMPONENT_FALLURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${query.apmID}/components/${query.componentName}/redeploy`,
      schema: {},
      options: {
        method: 'PUT',
      },
    },
  }
}

export const getRedeploy = (clusterID, query) => dispatch => {
  return dispatch(redeployComponent(clusterID, query))
}

export const MANUALSCALE_COMPONENT_REQUEST = 'MANUALSCALE_COMPONENT_REQUEST'
export const MANUALSCALE_COMPONENT_SUCCESS = 'MANUALSCALE_COMPONENT_SUCCESS'
export const MANUALSCALE_COMPONENT_FAILURE = 'MANUALSCALE_COMPONENT_FAILURE'

const fetchManualScaleComponent = (clusterID, name, body) => {
  const { namespace } = body
  delete body.namespace
  return {
    [CALL_API]: {
      types: [
        MANUALSCALE_COMPONENT_REQUEST,
        MANUALSCALE_COMPONENT_SUCCESS,
        MANUALSCALE_COMPONENT_FAILURE,
      ],
      endpoint: `/clusters/${clusterID}/services/${name}/manualscale`,
      schema: {},
      options: {
        method: 'PUT',
        body,
        headers: {
          project: namespace || '',
        },
      },
    },
  }
}

export const manualScaleComponent = (clusterID, name, body) =>
  dispatch => dispatch(fetchManualScaleComponent(clusterID, name, body))
