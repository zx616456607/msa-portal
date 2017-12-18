/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB apply selectors for get data from redux store
 *
 * 2017-12-18
 * @author zhaoyb
 */

import { createSelector } from 'reselect'
import { getQueryKey } from '../../common/utils'

export const getQueryAndFuncs = flag => {
  const defaultQuery = {
    flag,
    page: 1,
    size: 10,
  }

  const mergeQuery = (userId, query) => Object.assign(
    {},
    defaultQuery,
    query,
    { userId }
  )

  return {
    defaultQuery,
    mergeQuery,
  }
}

const getApply = (flag, state, props) => {
  const { location } = props
  const { current, CSB } = state
  const userID = current.user.info.userID
  const { mergeQuery } = getQueryAndFuncs(flag)
  const applysKey = getQueryKey(mergeQuery(userID, location.query))
  return CSB.myApplication[applysKey] || {}
}

const getEntities = state => state.entities

export const csbApplySltMaker = flag => createSelector(
  [
    getApply.bind(this, flag),
    getEntities,
  ],
  (csbApplys, entities) => {
    const { ids, ...other } = csbApplys
    const applyEntities = entities.csbApply
    const content = (ids || []).map(id => applyEntities[id])
    return {
      content,
      ...other,
    }
  }
)

