/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * RouteManagement container
 *
 * 2018-10-12
 * @author zhouhaitao
 */

/*
import { API_CONFIG } from '../constants'
import { CALL_API } from '../middleware/api'
import { Schemas } from '../middleware/schemas'
import {APP_LIST_FAILURE, APP_LIST_REQUEST, APP_LIST_SUCCESS} from "./serviceMesh";

const { SERVICEMESH_API_URL } = API_CONFIG

export const NEW_ROUTE_REQUEST = 'NEW_ROUTE_REQUEST'
export const NEW_ROUTE_SUCCESS = 'NEW_ROUTE_SUCCESS'
export const NEW_ROUTE_FAILURE = 'NEW_ROUTE_FAILURE'

function createNewRoute(clusterID, body, callback) {
  const endpoint = `${SERVICEMESH_API_URL}/api/v3/servicemesh/clusters/:clusterId/networking/virtualservice`
  return {
    clusterID,
    [CALL_API]: {
      types: [ NEW_ROUTE_FAILURE, NEW_ROUTE_SUCCESS, NEW_ROUTE_FAILURE ],
      endpoint,
      schema: Schemas.APPS,
      options: {
        method: 'POST',
        body,
      },
    },
    callback,
  }
}
*/
