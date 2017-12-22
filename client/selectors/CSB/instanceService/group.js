/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instanceService groups selectors for get data from redux store
 *
 * 2017-12-22
 * @author zhangpc
 */

import { createSelector } from 'reselect'
import { getQueryKey } from '../../../common/utils'

const getServiceGroups = state => state.CSB && state.CSB.serviceGroups || {}
const getEntities = state => state.entities

export const serviceGroupsSlt = createSelector(
  [ getServiceGroups, getEntities ],
  (serviceGroups, entities) => {
    const { csbInstanceServiceGroups } = entities
    const { ids, ...otherProps } = serviceGroups && serviceGroups[getQueryKey()] || {}
    return {
      content: ids && ids.map(id => csbInstanceServiceGroups[id]),
      ...otherProps,
    }
  }
)
