/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Event selectors for get data from redux store
 *
 * @author zhangxuan
 * @date 2018-05-25
 */

import { createSelector } from 'reselect'

const getEvent = state => state.eventManage
const getEntities = state => state.entities

export const eventListSlt = createSelector(
  [ getEvent, getEntities ],
  (event, entities) => {
    const { eventList } = event || {}
    const { content } = eventList || { content: [] }
    const { msaEventList } = entities || {}
    return {
      eventList: (content || []).map(item => msaEventList[item]),
    }
  }
)
