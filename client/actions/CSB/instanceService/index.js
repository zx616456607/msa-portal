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
import {
  CSB_RELEASE_INSTANCES_SERVICE_FLAG,
  CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG,
} from '../../../constants'

const { CSB_API_URL } = API_CONFIG

export const CSB_RELEASE_INSTANCE_REQUEST = 'CSB_RELEASE_INSTANCE_REQUEST'
export const CSB_RELEASE_INSTANCE_SUCCESS = 'CSB_RELEASE_INSTANCE_SUCCESS'
export const CSB_RELEASE_INSTANCE_FAILURE = 'CSB_RELEASE_INSTANCE_FAILURE'

export const CSB_SUBSCRIBE_INSTANCE_REQUEST = 'CSB_SUBSCRIBE_INSTANCE_REQUEST'
export const CSB_SUBSCRIBE_INSTANCE_SUCCESS = 'CSB_SUBSCRIBE_INSTANCE_SUCCESS'
export const CSB_SUBSCRIBE_INSTANCE_FAILURE = 'CSB_SUBSCRIBE_INSTANCE_FAILURE'

const fetchInstanceServiceList = (instanceId, query = {}) => {
  const _query = cloneDeep(query)
  const { page, flag } = _query
  if (page !== undefined) {
    _query.page = page - 1
  }
  let types
  let schema
  switch (flag) {
    case CSB_RELEASE_INSTANCES_SERVICE_FLAG:
      types = [
        CSB_RELEASE_INSTANCE_REQUEST,
        CSB_RELEASE_INSTANCE_SUCCESS,
        CSB_RELEASE_INSTANCE_FAILURE,
      ]
      schema = Schemas.CSB_PUBLISHED_LIST_DATA
      break
    case CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG:
      types = [
        CSB_SUBSCRIBE_INSTANCE_REQUEST,
        CSB_SUBSCRIBE_INSTANCE_SUCCESS,
        CSB_SUBSCRIBE_INSTANCE_FAILURE,
      ]
      schema = Schemas.CSB_SUBSCRIBE_LIST_DATA
      break
    default:
      break
  }
  return {
    instanceId,
    query,
    [CALL_API]: {
      types,
      endpoint: `${CSB_API_URL}/instances/${instanceId}/services?${toQuerystring(_query)}`,
      schema,
    },
  }
}

export const getInstanceService = (instanceId, query) => dispatch => {
  return dispatch(fetchInstanceServiceList(instanceId, query))
}

