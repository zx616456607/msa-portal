/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * overview.js page
 *
 * @author zhangtao
 * @date Tuesday December 18th 2018
 */

import { CALL_API } from '../middleware/api'
import { API_CONFIG } from '../constants'

const { PAAS_API_URL, CSB_API_URL } = API_CONFIG

// 治理Spring-Cloud
// 服务数量

export const SERVICE_BUS_REQUEST = 'SERVICE_BUS_REQUEST'
export const SERVICE_BUS_SUCCESS = 'SERVICE_BUS_SUCCESS'
export const SERVICE_BUS_FAILURE = 'SERVICE_BUS_FAILURE'

const fetchServiceBus = () => {
  const endpoint = `${CSB_API_URL}/overview/5`
  return {
    [CALL_API]: {
      types: [ SERVICE_BUS_REQUEST,
        SERVICE_BUS_SUCCESS,
        SERVICE_BUS_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getServiceBus() {
  return dispatch => {
    return dispatch(fetchServiceBus())
  }
}

// 判断当前集群是否开启了Dubbo

export const DUBBO_INSTALL_REQUEST = 'DUBBO_INSTALL_REQUEST'
export const DUBBO_INSTALL_SUCCESS = 'DUBBO_INSTALL_SUCCESS'
export const DUBBO_INSTALL_FAILURE = 'DUBBO_INSTALL_FAILURE'

const fetchDubboInstall = clusterID => {
  const endpoint = `${PAAS_API_URL}/projects/plugins/enabled?clusterID=${clusterID}`
  return {
    [CALL_API]: {
      types: [ DUBBO_INSTALL_REQUEST,
        DUBBO_INSTALL_SUCCESS,
        DUBBO_INSTALL_FAILURE ],
      endpoint,
      schema: {},
    },
  }
}

export function getDubboInstall(clusterID) {
  return dispatch => {
    return dispatch(fetchDubboInstall(clusterID))
  }
}
