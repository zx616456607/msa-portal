/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App aciton
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
  if (project) {
    headers = { project }
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

export const FETCH_APMLIST_REQUEST = 'FETCH_APMLIST_REQUEST'
export const FETCH_APMLIST_SUCCESS = 'FETCH_APMLIST_SUCCESS'
export const FETCH_APMLIST_FAILURE = 'FETCH_APMLIST_FAILURE'

const fetchApmList = id => ({
  id,
  [CALL_API]: {
    types: [ FETCH_APMLIST_REQUEST, FETCH_APMLIST_SUCCESS, FETCH_APMLIST_FAILURE ],
    endpoint: `clusters/:cluster/apms/${id}/state`,
    schema: {},
  },
})
export const fetchApmData = id => dispatch => {
  return dispatch(fetchApmList(id))
}

export const DELETE_APMLIST_REQUEST = 'DELETE_APMLIST_REQUEST'
export const DELETE_APMLIST_SUCCESS = 'DELETE_APMLIST_SUCCESS'
export const DELETE_APMLIST_FAILURE = 'DELETE_APMLIST_FAILURE'

const delApmInfo = id => ({
  id,
  [CALL_API]: {
    types: [ DELETE_APMLIST_REQUEST, DELETE_APMLIST_SUCCESS, DELETE_APMLIST_FAILURE ],
    endpoint: `/clusters/:cluster/apms/${id}`,
    schema: {},
  },
})

export const delApmRow = id => dispatch => {
  return dispatch(delApmInfo(id))
}

export const FETCH_APMSLIST_REQUEST = 'FETCH_APMSLIST_REQUEST'
export const FETCH_APMSLIST_SUCCESS = 'FETCH_APMSLIST_SUCCESS'
export const FETCH_APMSLIST_FAILURE = 'FETCH_APMSLIST_FAILURE'

const fetchApmsInfo = cluster => ({
  cluster,
  [CALL_API]: {
    types: [ FETCH_APMSLIST_REQUEST, FETCH_APMSLIST_SUCCESS, FETCH_APMSLIST_FAILURE ],
    endpoint: `clusters/${cluster}/apms`,
  },
})

export const fetcheApms = cluster => dispatch => {
  return dispatch(fetchApmsInfo(cluster))
}

