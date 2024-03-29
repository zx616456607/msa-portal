/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instanceService selectors for get data from redux store
 *
 * 2017-12-21
 * @author zhaoyb
 */

import { createSelector } from 'reselect'
import { getQueryKey } from '../../../common/utils'
import {
  CSB_RELEASE_INSTANCES_SERVICE_FLAG,
  CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG,
} from '../../../constants'

const getInstancesServiceTypesByFlag = flag => {
  let instancesServiceType
  let instancesServiceEntitiesType
  switch (flag) {
    case CSB_RELEASE_INSTANCES_SERVICE_FLAG:
      instancesServiceType = 'publishedService'
      instancesServiceEntitiesType = 'cbsPublished'
      break
    case CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG:
      instancesServiceType = 'subscribableServices'
      instancesServiceEntitiesType = 'csbSubscribe'
      break
    default:
      break
  }
  return {
    instancesServiceType,
    instancesServiceEntitiesType,
  }
}
export const getQueryAndFuncs = flag => {
  const defaultQuery = {
    flag,
    page: 1,
    size: 10,
  }

  const mergeQuery = query => Object.assign(
    {},
    defaultQuery,
    query
  )

  return {
    defaultQuery,
    mergeQuery,
  }
}

const getInstanceService = (flag, state, props) => {
  const { instancesServiceType } = getInstancesServiceTypesByFlag(flag)
  const { location } = props
  const { CSB } = state
  const { mergeQuery } = getQueryAndFuncs(flag)
  const applysKey = getQueryKey(mergeQuery(location.query))
  return CSB[instancesServiceType][applysKey] || {}
}

const getInstanceServiceOverview = state => state.CSB.serviceOverview

const getEntities = state => state.entities

export const csbInstanceServiceSltMaker = flag => createSelector(
  [
    getInstanceService.bind(this, flag),
    getInstanceServiceOverview,
    getEntities,
  ],
  (csbApplys, serviceOverview, entities) => {
    const { ids, ...other } = csbApplys
    const { instancesServiceEntitiesType } = getInstancesServiceTypesByFlag(flag)
    const applyEntities = entities[instancesServiceEntitiesType]
    const content = (ids || []).map(id => Object.assign(
      {},
      applyEntities[id],
      serviceOverview[id]
    ))
    return {
      content,
      ...other,
    }
  }
)

