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
