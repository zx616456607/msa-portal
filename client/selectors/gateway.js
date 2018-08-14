/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Gateway selectors for get data from redux store
 *
 * 2017-11-06
 * @author zhangpc
 */

import { createSelector } from 'reselect'

const gateway = state => state.gateway
const getEntities = state => state.entities

export const gatewayPolicesListSlt = createSelector(
  [ gateway, getEntities ],
  (gateway, getEntities) => {
    const { policesList } = gateway
    const { isFetching, content, totalPages, totalElements } = policesList
    if (!content || !content.length) {
      return {
        isFetching,
        policesList: [],
        totalPages: 0,
        totalElements: 0,
      }
    }
    const { gatewayPolicies } = getEntities
    return {
      isFetching,
      policesList: content.map(id => gatewayPolicies[id]),
      totalPages,
      totalElements,
    }
  }
)

export const gatewayHasOpenPolicySlt = createSelector(
  [ gateway, getEntities ],
  (gateway, getEntities) => {
    const { gatewayHasOpenPolicy } = gateway
    const { isFetching, content, totalPages, totalElements } = gatewayHasOpenPolicy
    if (!content || !content.length) {
      return {
        isFetching,
        gatewayHasOpenPolicy: [],
        totalPages: 0,
        totalElements: 0,
      }
    }
    return {
      isFetching,
      gatewayHasOpenPolicy: content.map(id => getEntities.gatewayHasOpenPolicy[id]),
      totalPages,
      totalElements,
    }
  }
)

export const gatewayRoutesListSlt = createSelector(
  [ gateway, getEntities ],
  (gateway, getEntities) => {
    const { routesList } = gateway
    const { isFetching, content, totalPages, totalElements } = routesList
    if (!content || !content.length) {
      return {
        isFetching,
        routesList: [],
        totalPages: 0,
        totalElements: 0,
      }
    }
    const { gatewayRoutes } = getEntities
    return {
      isFetching,
      routesList: content.map(id => gatewayRoutes[id]),
      totalPages,
      totalElements,
    }
  }
)
