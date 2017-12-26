/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance service subscribe approval selectors for get data from redux store
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
const getserviceSubscribeApprove = state => state.CSB && state.CSB.serviceSubscribeApprove || {}
const getEntities = state => state.entities

export const serviceSubscribeApproveSlt = createSelector(
  [ getserviceSubscribeApprove, getEntities, getInstanceID ],
  (getserviceSubscribeApprove, getEntities, getInstanceID) => {
    const { csbInstanceServiceSubscribeApprove } = getEntities
    const { ids, totalElements, size, isFetching } = getserviceSubscribeApprove[getInstanceID] || {}
    return {
      content: ids ? ids.map(id => csbInstanceServiceSubscribeApprove[id]) : [],
      totalElements,
      size,
      isFetching,
    }
  }
)
