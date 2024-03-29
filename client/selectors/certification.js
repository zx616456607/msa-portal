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

export const zoneUserListSlt = createSelector(
  [ getCertification, getEntities ],
  (certification, entities) => {
    const { zoneUsers } = certification || { zoneUsers: {} }
    const { data, isFetching: usersFetching } = zoneUsers || { data: {}, isFetching: false }
    const { resources } = data || { resources: [] }
    const { uaaZoneUsers } = entities || { uaaZoneUsers: {} }
    return {
      zoneUsers: (resources || []).map(item => uaaZoneUsers[item]),
      usersFetching,
    }
  }
)

export const zoneGroupUserListSlt = createSelector(
  [ getCertification, getEntities ],
  (certification, entities) => {
    const { zoneGroupsDetail } = certification || { zoneGroupsDetail: {} }
    const {
      data, isFetching: groupUsersFetching,
    } = zoneGroupsDetail || { data: [], isFetching: false }
    const { uaaZoneGroupUsers } = entities || { uaaZoneGroupUsers: {} }
    return {
      zoneGroupUsers: (data || []).map(item => uaaZoneGroupUsers[item]),
      groupUsersFetching,
    }
  }
)
