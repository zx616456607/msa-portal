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
// import { toQuerystring } from '../common/utils'

export const MSA_STATE_REQUEST = 'MSA_STATE_REQUEST'
export const MSA_STATE_SUCCESS = 'MSA_STATE_SUCCESS'
export const MSA_STATE_FAILURE = 'MSA_STATE_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchMsaState = (clusterID, id) => {
  return {
    id,
    clusterID,
    [CALL_API]: {
      types: [ MSA_STATE_REQUEST, MSA_STATE_SUCCESS, MSA_STATE_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${id}/state`,
      schema: {},
      options: {
        method: 'GET',
      },
    },
  }
}

// Fetches a page of apms.
// Relies on Redux Thunk middleware.
export const getMsaState = (clusterID, id) => dispatch => {
  return dispatch(fetchMsaState(clusterID, id))
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
export const installMsaConfig = (query, clusterID, project) => dispatch => {
  return dispatch(installMsa(query, clusterID, project))
}

export const MSA_UNINSTALL_REQUEST = 'MSA_INSTALL_REQUEST'
export const MSA_UNINSTALL_SUCCESS = 'MSA_INSTALL_SUCCESS'
export const MSA_UNINSTALL_FAILURE = 'MSA_INSTALL_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
const uninstallMsa = (clusterID, id) => {
  return {
    id,
    clusterID,
    [CALL_API]: {
      types: [ MSA_UNINSTALL_REQUEST, MSA_UNINSTALL_SUCCESS, MSA_UNINSTALL_FAILURE ],
      endpoint: `/clusters/${clusterID}/springcloud/${id}`,
      schema: {},
      options: {
        method: 'DELETE',
      },
    },
  }
}

// Relies on Redux Thunk middleware.
export const uninstallMsaConfig = (clusterID, id) => dispatch => {
  return dispatch(uninstallMsa(clusterID, id))
}
