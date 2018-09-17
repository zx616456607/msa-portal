/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa selectors for get data from redux store
 *
 * 2017-11-06
 * @author zhangpc
 */

import { createSelector } from 'reselect'

const getMsa = state => state.msa
const getEntities = state => state.entities

export const msaListSlt = createSelector(
  [ getMsa, getEntities ],
  (msa, entities) => {
    const { msaNameList } = msa || {}
    const { data: msaData } = msaNameList || { data: [] }
    const { msaList } = entities || {}
    function getServiceUpSum(data) {
      if (!data.length) return 0
      let upSum = 0
      data.forEach(item => {
        if (item.status === 'UP') {
          upSum++
        }
      })
      return upSum
    }
    function formateList(source) {
      return source.map(item => {
        return Object.assign(item, { upSum: getServiceUpSum(item.instances) })
      })
    }
    return {
      msaList: formateList(msaData && msaData.length && msaData.map(item => msaList[item]) || []),
      msaListLoading: msaNameList.isFetching,
    }
  }
)
