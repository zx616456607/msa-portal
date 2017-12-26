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
const getEntities = state => state.entities

export const mySbuscrivedServicesSlt = createSelector(
  [ getmySubscribedServices, getEntities, getInstanceID ],
  (getmySubscribedServices, getEntities, getInstanceID) => {
    const { csbInstanceMySubscribedServices } = getEntities
    const { ids, totalElements, size, isFetching } = getmySubscribedServices[getInstanceID] || {}
    return {
      content: ids ? ids.map(id => csbInstanceMySubscribedServices[id]) : [],
      totalElements,
      size,
      isFetching,
    }
  }
)
