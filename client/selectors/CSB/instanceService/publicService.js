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
const getpublicService = state => state.CSB && state.CSB.publicService || {}
const getEntities = state => state.entities

export const publicServiceSlt = createSelector(
  [ getpublicService, getEntities, getInstanceID ],
  (getpublicService, getEntities, getInstanceID) => {
    const { cbsPublished } = getEntities
    const { ids, totalElements, size, isFetching } = getpublicService[getInstanceID] || {}
    return {
      content: ids ? ids.map(id => cbsPublished[id]) : [],
      totalElements,
      size,
      isFetching,
    }
  }
)
