/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB reducers for redux
 *
 * 2017-12-15
 * @author zhangpc
 */
import { myApplication } from './myApplication'
import { publicInstances, availableInstances, omInstances } from './instance'
import { publishedService } from './instanceService'
import { serviceGroups } from './instanceService/group'

const CSB = (state = {
  myApplication: {},
  publicInstances: {},
  availableInstances: {},
  omInstances: {},
  publishedService: {},
}, action) => {
  return {
    myApplication: myApplication(state.myApplication, action),
    publicInstances: publicInstances(state.publicInstances, action),
    availableInstances: availableInstances(state.availableInstances, action),
    omInstances: omInstances(state.omInstances, action),
    publishedService: publishedService(state.publishedService, action),
    serviceGroups: serviceGroups(state.serviceGroups, action),
  }
}

export default CSB
