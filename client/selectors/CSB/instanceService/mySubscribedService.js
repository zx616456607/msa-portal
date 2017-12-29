/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance My Subscribed Service selectors for get data from redux store
 *
 * 2017-12-26
 * @author zhangpc
 */

import { createSelector } from 'reselect'

const getInstanceID = (state, props) => {
  const { match } = props
  const { instanceID } = match.params
  return instanceID
}
const getmySubscribedServices = state => state.CSB && state.CSB.mySubscribedServices || {}
const getInstanceServiceOverview = state => state.CSB.serviceOverview
const getEntities = state => state.entities

export const mySbuscrivedServicesSlt = createSelector(
  [
    getmySubscribedServices,
    getInstanceServiceOverview,
    getEntities,
    getInstanceID,
  ],
  (getmySubscribedServices, serviceOverview, getEntities, getInstanceID) => {
    const { csbInstanceMySubscribedServices } = getEntities
    const { ids, totalElements, size, isFetching } = getmySubscribedServices[getInstanceID] || {}
    const content = (ids || []).map(id => {
      const service = csbInstanceMySubscribedServices[ id ]
      return Object.assign({},
        service,
        serviceOverview[ service.serviceId ]
      )
    })
    return {
      content,
      totalElements,
      size,
      isFetching,
    }
  }
)
