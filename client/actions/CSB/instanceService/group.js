/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance serivce group aciton
 *
 * 2017-12-11
 * @author zhangpc
 */

import { CALL_API } from '../../../middleware/api'
import { toQuerystring } from '../../../common/utils'
import {
  API_CONFIG,
} from '../../../constants'

const { CSB_API_URL } = API_CONFIG

export const CREATE_INSTANCE_REQUEST = 'CREATE_INSTANCE_REQUEST'
export const CREATE_INSTANCE_SUCCESS = 'CREATE_INSTANCE_SUCCESS'
export const CREATE_INSTANCE_FAILURE = 'CREATE_INSTANCE_FAILURE'

// Create an instance
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCreateInstance = (clusterID, query, body) => {
  return {
    [CALL_API]: {
      types: [ CREATE_INSTANCE_REQUEST, CREATE_INSTANCE_SUCCESS, CREATE_INSTANCE_FAILURE ],
      endpoint: `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createInstance = (clusterID, query, body) =>
  dispatch => dispatch(fetchCreateInstance(clusterID, query, body))
