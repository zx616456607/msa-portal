/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instances selectors for get data from redux store
 *
 * 2017-12-18
 * @author zhangpc
 */

import { createSelector } from 'reselect'
import {
  CSB_PUBLIC_INSTANCES_FLAG,
  CSB_AVAILABLE_INSTANCES_FLAG,
  CSB_OM_INSTANCES_FLAG,
} from '../../constants'
import {
  getQueryKey,
} from '../../common/utils'

const getInstancesTypesByFlag = flag => {
  let instancesType
  let instancesEntitiesType
  switch (flag) {
    case CSB_AVAILABLE_INSTANCES_FLAG:
      instancesType = 'availableInstances'
      instancesEntitiesType = 'csbAvaInstances'
      break
    case CSB_OM_INSTANCES_FLAG:
      instancesType = 'omInstances'
      instancesEntitiesType = 'csbOmInstances'
      break
    case CSB_PUBLIC_INSTANCES_FLAG:
    default:
      instancesType = 'publicInstances'
      instancesEntitiesType = 'csbPubInstances'
      break
  }
  return {
    instancesType,
    instancesEntitiesType,
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

const getCsbInstances = (flag, state, props) => {
  const { instancesType } = getInstancesTypesByFlag(flag)
  const { location } = props
  const { CSB } = state
  const { mergeQuery } = getQueryAndFuncs(flag)
  const instancesKey = getQueryKey(mergeQuery(location.query))
  return CSB[instancesType][instancesKey] || {}
}

const getEntities = state => state.entities

export const instancesSltMaker = flag => createSelector(
  [
    getCsbInstances.bind(this, flag),
    getEntities,
  ],
  (csbInstances, entities) => {
    const { ids, ...other } = csbInstances
    const { clusters } = entities
    const { instancesEntitiesType } = getInstancesTypesByFlag(flag)
    const instancesEntities = entities[instancesEntitiesType]
    const content = (ids || []).map(id => {
      const instance = instancesEntities[id]
      if (instance.clusterId) {
        instance.cluster = clusters[instance.clusterId] || {}
      } else if (instance.instance && instance.instance.clusterId) {
        instance.instance.cluster = clusters[instance.instance.clusterId] || {}
      }
      return instance
    })
    return {
      content,
      ...other,
    }
  }
)
