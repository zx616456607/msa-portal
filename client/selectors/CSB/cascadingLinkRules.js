/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CSB Cascading Link Rules selectors for get data from redux store
 *
 * 2018-1-18
 * @author zhangcz
 */

import { createSelector } from 'reselect'

const getCascadingLinkRule = state => state.CSB && state.CSB.cascadingLinkRule || {}
const getEntities = state => state.entities

export const cascadingLinkRuleSlt = createSelector(
  [ getCascadingLinkRule, getEntities ],
  (getCascadingLinkRule, getEntities) => {
    const { csbCascadingLinkRule } = getEntities
    const { ids = [] } = getCascadingLinkRule
    return {
      content: ids.map(id => csbCascadingLinkRule[id]),
      ...getCascadingLinkRule,
    }
  }
)
