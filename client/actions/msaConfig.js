/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm aciton
 *
 * 2017-11-02
 * @author zhaoyb
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
// import { toQuerystring } from '../common/utils'

export const SPRINGCLOUD_REQUEST = 'SPRINGCLOUD_REQUEST'
export const SPRINGCLOUD_SUCCESS = 'SPRINGCLOUD_SUCCESS'
export const SPRINGCLOUD_FAILURE = 'SPRINGCLOUD_FAILURE'

const fetchSpringCloud = (clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = { project }
  }
  return {
    clusterID,
    [CALL_API]: {
      types: [ SPRINGCLOUD_REQUEST, SPRINGCLOUD_SUCCESS, SPRINGCLOUD_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud`,
      schema: Schemas.SPRINGCLOUD_ARRAY_DATA,
      options: { headers },
    },
  }
}

export const loadSpringCloud = (clusterID, project) => dispatch => {
  return dispatch(fetchSpringCloud(clusterID, project))
}

export const FETCH_SPRINGCLOUD_REQUEST = 'FETCH_SPRINGCLOUD_REQUEST'
export const FETCH_SPRINGCLOUD_SUCCESS = 'FETCH_SPRINGCLOUD_SUCCESS'
export const FETCH_SPRINGCLOUD_FAILURE = 'FETCH_SPRINGCLOUD_FAILURE'

const fetchSpingCloudInfo = (clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = {
      project,
    }
  }
  return {
    clusterID,
    [CALL_API]: {
      types: [ FETCH_SPRINGCLOUD_REQUEST, FETCH_SPRINGCLOUD_SUCCESS, FETCH_SPRINGCLOUD_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/deployed`,
      schema: {},
      options: {
        headers,
        method: 'GET',
      },
    },
  }
}

export const fetchSpingCloud = (clusterID, project) => dispatch => {
  return dispatch(fetchSpingCloudInfo(clusterID, project))
}

export const MSA_STATE_REQUEST = 'MSA_STATE_REQUEST'
export const MSA_STATE_SUCCESS = 'MSA_STATE_SUCCESS'
export const MSA_STATE_FAILURE = 'MSA_STATE_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchMsaState = (clusterID, id, project) => {
  let headers
  if (project && project !== 'default') {
    headers = { project }
  }
  return {
    id,
    clusterID,
    [CALL_API]: {
      types: [ MSA_STATE_REQUEST, MSA_STATE_SUCCESS, MSA_STATE_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${id}/state`,
      schema: {},
      options: {
        headers,
        method: 'GET',
      },
    },
  }
}

// Fetches a page of apms.
// Relies on Redux Thunk middleware.
export const getMsaState = (clusterID, id, namespace) => dispatch => {
  return dispatch(fetchMsaState(clusterID, id, namespace))
}

export const MSA_INSTALL_REQUEST = 'MSA_INSTALL_REQUEST'
export const MSA_INSTALL_SUCCESS = 'MSA_INSTALL_SUCCESS'
export const MSA_INSTALL_FAILURE = 'MSA_INSTALL_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
const installMsa = (body, clusterID, project) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    body,
    clusterID,
    [CALL_API]: {
      types: [ MSA_INSTALL_REQUEST, MSA_INSTALL_SUCCESS, MSA_INSTALL_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud`,
      schema: {},
      options: {
        body,
        headers,
        method: 'POST',
      },
    },
  }
}

// Relies on Redux Thunk middleware.
export const installMsaConfig = (body, clusterID, project) => dispatch => {
  return dispatch(installMsa(body, clusterID, project))
}

export const MSA_UNINSTALL_REQUEST = 'MSA_INSTALL_REQUEST'
export const MSA_UNINSTALL_SUCCESS = 'MSA_INSTALL_SUCCESS'
export const MSA_UNINSTALL_FAILURE = 'MSA_INSTALL_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
const uninstallMsa = (clusterID, project, query) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    query,
    clusterID,
    [CALL_API]: {
      types: [ MSA_UNINSTALL_REQUEST, MSA_UNINSTALL_SUCCESS, MSA_UNINSTALL_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${query.id}`,
      schema: {},
      options: {
        headers,
        method: 'DELETE',
      },
    },
  }
}

// Relies on Redux Thunk middleware.
export const uninstallMsaConfig = (clusterID, project, query) => dispatch => {
  return dispatch(uninstallMsa(clusterID, project, query))
}
