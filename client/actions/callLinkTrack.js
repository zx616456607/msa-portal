/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * call link track action
 *
 * @author zhangxuan
 * @date 2018-06-29
 */
import { CALL_API } from '../middleware/api'
// import { Schemas } from '../middleware/schemas'
// import { toQuerystring } from '../common/utils'
import {
  API_CONFIG,
} from '../constants'
const { ZIPKIN_API_URL } = API_CONFIG

export const GET_ZIPKIN_SERVICES_REQUEST = 'GET_ZIPKIN_SERVICES_REQUEST'
export const GET_ZIPKIN_SERVICES_SUCCESS = 'GET_ZIPKIN_SERVICES_SUCCESS'
export const GET_ZIPKIN_SERVICES_FAILURE = 'GET_ZIPKIN_SERVICES_FAILURE'

const fetchZipkinServices = () => {
  return {
    [CALL_API]: {
      types: [
        GET_ZIPKIN_SERVICES_REQUEST,
        GET_ZIPKIN_SERVICES_SUCCESS,
        GET_ZIPKIN_SERVICES_FAILURE,
      ],
      endpoint: `${ZIPKIN_API_URL}/services`,
      schema: {},
    },
  }
}

export const getZipkinServices = () =>
  dispatch => dispatch(fetchZipkinServices())
