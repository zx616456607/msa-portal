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

export const allPolicesListSlt = createSelector(
  [ gateway, getEntities ],
  (gateway, getEntities) => {
    const { allPolicesList } = gateway
    const { isFetching, content, totalPages, totalElements } = allPolicesList
    if (!content || !content.length) {
      return {
        isFetching,
        allPolicesList: [],
        totalPages: 0,
        totalElements: 0,
      }
    }
    const { gatewayPolicies } = getEntities
    return {
      isFetching,
      allPolicesList: content.map(id => gatewayPolicies[id]),
      totalPages,
      totalElements,
    }
  }
)
