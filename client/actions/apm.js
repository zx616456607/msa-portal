/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm aciton
 *
 * 2017-08-16
 * @author zhangpc
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
// import { toQuerystring } from '../common/utils'

export const APMS_REQUEST = 'APMS_REQUEST'
export const APMS_SUCCESS = 'APMS_SUCCESS'
export const APMS_FAILURE = 'APMS_FAILURE'

// Fetches a page of apms.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchApms = (clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = {
      project,
    }
  }
  return {
    clusterID,
    project,
    [CALL_API]: {
      types: [ APMS_REQUEST, APMS_SUCCESS, APMS_FAILURE ],
      endpoint: `/clusters/${clusterID}/apms`,
      schema: Schemas.APM_ARRAY_DATA,
      options: { headers },
    },
  }
}

// Fetches a page of apms.
// Relies on Redux Thunk middleware.
export const loadApms = (clusterID, project) => dispatch => {
  return dispatch(fetchApms(clusterID, project))
}

export const ADD_APM_REQUEST = 'ADD_APM_REQUEST'
export const ADD_APM_SUCCESS = 'ADD_APM_SUCCESS'
export const ADD_APM_FAILURE = 'ADD_APM_FAILURE'

const addApms = (body, clusterID, project) => {
  let headers
  if (project && project !== 'default') {
    headers = { project }
  }
  return {
    body,
    clusterID,
    [CALL_API]: {
      types: [ ADD_APM_REQUEST, ADD_APM_SUCCESS, ADD_APM_FAILURE ],
      endpoint: `/clusters/${clusterID}/apms`,
      options: {
        method: 'POST',
        body,
        headers,
      },
      schema: {},
    },
  }
}

export const postApm = (body, clusterID, project) => dispatch => {
  return dispatch(addApms(body, clusterID, project))
}

export const FETCH_APMSATTE_REQUEST = 'FETCH_APMSATTE_REQUEST'
export const FETCH_APMSTATE_SUCCESS = 'FETCH_APMSTATE_SUCCESS'
export const FETCH_APMSTATE_FAILURE = 'FETCH_APMSTATE_FAILURE'

const fetchApmState = (query, project) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    query,
    [CALL_API]: {
      types: [ FETCH_APMSATTE_REQUEST, FETCH_APMSTATE_SUCCESS, FETCH_APMSTATE_FAILURE ],
      endpoint: `/clusters/${query.cluster}/apms/${query.id}/state`,
      headers,
      schema: {},
    },
  }
}
export const getApmState = (query, project) => dispatch => {
  return dispatch(fetchApmState(query, project))
}

export const DELETE_APM_REQUEST = 'DELETE_APM_REQUEST'
export const DELETE_APM_SUCCESS = 'DELETE_APM_SUCCESS'
export const DELETE_APM_FAILURE = 'DELETE_APM_FAILURE'

const delApmRow = (body, project) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    body,
    project,
    [CALL_API]: {
      types: [ DELETE_APM_REQUEST, DELETE_APM_SUCCESS, DELETE_APM_FAILURE ],
      endpoint: `/clusters/${body.cluster}/apms/${body.id}`,
      options: {
        method: 'DELETE',
        headers,
      },
      schema: {},
    },
  }
}

export const removeApmRow = (body, project) => dispatch => {
  return dispatch(delApmRow(body, project))
}

export const FETCH_APMLIST_REQUEST = 'FETCH_APMLIST_REQUEST'
export const FETCH_APMLIST_SUCCESS = 'FETCH_APMLIST_SUCCESS'
export const FETCH_APMLIST_FAILURE = 'FETCH_APMLIST_FAILURE'

const fetchApmInfo = cluster => ({
  cluster,
  [CALL_API]: {
    types: [ FETCH_APMLIST_REQUEST, FETCH_APMLIST_SUCCESS, FETCH_APMLIST_FAILURE ],
    endpoint: `/clusters/${cluster}/apms`,
    options: {
      method: 'GET',
    },
    schema: {},
  },
})

export const getApms = cluster => dispatch => {
  return dispatch(fetchApmInfo(cluster))
}

export const FETCH_APMSERVICE_REQUEST = 'FETCH_APMSERVICE_REQUEST'
export const FETCH_APMSERVICE_SUCCESS = 'FETCH_APMSERVICE_SUCCESS'
export const FETCH_APMSERVICE_FAILURE = 'FETCH_APMSERVICE_FAILURE'

const fetchAPMService = (body, project) => {
  let headers
  if (project) {
    headers = { project }
  }
  return {
    body,
    [CALL_API]: {
      types: [ FETCH_APMSERVICE_REQUEST, FETCH_APMSERVICE_SUCCESS, FETCH_APMSERVICE_FAILURE ],
      endpoint: `/clusters/${body.id}/apms/deployed?type=${body.pinpoint}`,
      options: {
        headers,
        method: 'GET',
      },
      schema: {},
    },
  }
}

export const getApmService = (body, project) => dispatch => {
  return dispatch(fetchAPMService(body, project))
}

