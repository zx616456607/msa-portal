/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Client selectors for get data from redux store
 *
 * 2018-05-15
 * @author zhangxuan
 */

import { createSelector } from 'reselect'

const getCertification = state => state.certification
const getEntities = state => state.entities

export const clientListSlt = createSelector(
  [ getCertification, getEntities ],
  (certification, entities) => {
    const { clientList } = certification || { clientList: {} }
    const { resources } = clientList || { resources: [] }
    const { msaClientList } = entities || { msaClientList: {} }
    return {
      clientList: (resources || []).map(item => msaClientList[item]),
    }
  }
)

export const identityZoneListSlt = createSelector(
  [ getCertification, getEntities ],
  (certification, entities) => {
    const { identityZoneList } = certification || { identityZoneList: {} }
    const { data, isFetching: zonesFetching } = identityZoneList || { data: [], isFetching: false }
    const { msaClientIdentityZoneList } = entities || { msaClientIdentityZoneList: {} }
    return {
      identityZoneList: (data || []).map(item => msaClientIdentityZoneList[item]),
      zonesFetching,
    }
  }
)
