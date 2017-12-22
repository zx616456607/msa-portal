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
import {
  API_CONFIG,
} from '../../../constants'

const { CSB_API_URL } = API_CONFIG

export const CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST'
export const CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS'
export const CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE = 'CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE'

// Create an instance
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchCreateGroup = (instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        CREATE_CSB_INSTANCE_SERVICE_GROUP_REQUEST,
        CREATE_CSB_INSTANCE_SERVICE_GROUP_SUCCESS,
        CREATE_CSB_INSTANCE_SERVICE_GROUP_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/groups`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createGroup = (instanceID, body) =>
  dispatch => dispatch(fetchCreateGroup(instanceID, body))
