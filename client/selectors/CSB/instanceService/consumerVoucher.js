/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance Consumer Voucher selectors for get data from redux store
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
const getconsumerVouchers = state => state.CSB && state.CSB.consumerVouchers || {}
const getEntities = state => state.entities

export const consumeVoucherSlt = createSelector(
  [ getconsumerVouchers, getEntities, getInstanceID ],
  (getconsumerVouchers, getEntities, getInstanceID) => {
    const { csbInstanceConsumerVouchers } = getEntities
    const { ids, totalElements, size, isFetching } = getconsumerVouchers[getInstanceID] || {}
    return {
      content: ids ? ids.map(id => csbInstanceConsumerVouchers[id]) : [],
      totalElements,
      size,
      isFetching,
    }
  }
)
