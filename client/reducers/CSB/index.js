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
import {
  publicInstances, availableInstances, omInstances, instanceOverview,
  servicesInbounds, instanceLogs, instanceMonitor, instanceRealTimeMonitor,
} from './instance'
import {
  publishedService, serviceCAL, serviceOverview, subscribableServices,
  serviceDetailMap, cascadedServicePrerequisite, cascadedServicesWebsocket,
  cascadedServicesProgresses, serviceCascadedInfo, cascadedServiceDetail,
} from './instanceService'
import { serviceGroups, groupServices } from './instanceService/group'
import { consumerVouchers } from './instanceService/consumerVouchers'
import { mySubscribedServices } from './instanceService/mySubscribedServices'
import { serviceSubscribeApprove } from './instanceService/serviceSubscribeApprove'
import { publicService } from './instanceService/publicService'
import { cascadingLinkRule } from './cascadingLinkRules'

const CSB = (state = {
  myApplication: {},
  publicInstances: {},
  availableInstances: {},
  omInstances: {},
  publishedService: {},
  groupServices: {},
  instanceOverview: {},
  plubicService: {},
  cascadingLinkRule: {},
  serviceCascadedInfo: {},
  instanceLogs: {},
  cascadedServiceDetail: {},
  instanceMonitor: {},
  instanceRealTimeMonitor: {},
}, action) => {
  return {
    myApplication: myApplication(state.myApplication, action),
    publicInstances: publicInstances(state.publicInstances, action),
    availableInstances: availableInstances(state.availableInstances, action),
    omInstances: omInstances(state.omInstances, action),
    publishedService: publishedService(state.publishedService, action),
    serviceGroups: serviceGroups(state.serviceGroups, action),
    serviceCAL: serviceCAL(state.serviceCAL, action),
    serviceOverview: serviceOverview(state.serviceOverview, action),
    cascadedServicePrerequisite: cascadedServicePrerequisite(
      state.cascadedServicePrerequisite,
      action
    ),
    cascadedServicesWebsocket: cascadedServicesWebsocket(
      state.cascadedServicesWebsocket,
      action
    ),
    cascadedServicesProgresses: cascadedServicesProgresses(
      state.cascadedServicesProgresses,
      action
    ),
    groupServices: groupServices(state.groupServices, action),
    consumerVouchers: consumerVouchers(state.consumerVouchers, action),
    mySubscribedServices: mySubscribedServices(state.mySubscribedServices, action),
    serviceSubscribeApprove: serviceSubscribeApprove(state.serviceSubscribeApprove, action),
    subscribableServices: subscribableServices(state.subscribableServices, action),
    serviceDetailMap: serviceDetailMap(state.serviceDetailMap, action),
    instanceOverview: instanceOverview(state.instanceOverview, action),
    servicesInbounds: servicesInbounds(state.servicesInbounds, action),
    publicService: publicService(state.publicService, action),
    cascadingLinkRule: cascadingLinkRule(state.cascadingLinkRule, action),
    serviceCascadedInfo: serviceCascadedInfo(state.serviceCascadedInfo, action),
    instanceLogs: instanceLogs(state.instanceLogs, action),
    cascadedServiceDetail: cascadedServiceDetail(state.cascadedServiceDetail, action),
    instanceMonitor: instanceMonitor(state.instanceMonitor, action),
    instanceRealTimeMonitor: instanceRealTimeMonitor(state.instanceRealTimeMonitor, action),
  }
}

export default CSB
