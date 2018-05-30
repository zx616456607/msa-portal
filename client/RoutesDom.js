/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Routes
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import App from './containers/App'
// import IndexPage from './containers/IndexPage'
import MsaManage from './containers/MsaManage'
import RegisterMsa from './containers/MsaManage/MsaList/RegisterMsa'
import MsaList from './containers/MsaManage/MsaList/index'
import MsaDetail from './containers/MsaManage/MsaList/MsaDetail'
import MsaConfigCenter from './containers/MsaManage/ConfigCenter/ConfigCenter'
import CreateConfig from './containers/MsaManage/ConfigCenter/CreateConfig'
import MsaCallLinkTracking from './containers/MsaManage/CallLinkTracking'
import MsaRoutingManage from './containers/MsaManage/RoutingManage/index'
import ApiGateway from './containers/MsaManage/ApiGateway'
import ApiGatewayMonitoring from './containers/MsaManage/ApiGatewayMonitoring'
import BlownMonitoring from './containers/MsaManage/BlownMonitoring'
import CertificationManageAuthZone from './containers/MsaManage/CertificationManage/AuthZone'
import AuthZoneDetail from './containers/MsaManage/CertificationManage/AuthZone/AuthZoneDetail'
import CertificationManageAuthMode from './containers/MsaManage/CertificationManage/AuthMode'
import CertificationManageAuthScope from './containers/MsaManage/CertificationManage/AuthScope'
import Event from './containers/MsaManage/EventManage/Event/index'
import Apm from './containers/Apm'
import Topology from './containers/Apm/Topology'
import Performance from './containers/Apm/Performance'
import CallLinkTracking from './containers/Apm/CallLinkTracking'
import MsaOm from './containers/MsaOm'
import MsaOmLogs from './containers/MsaOm/Log'
import MsaComponents from './containers/MsaOm/Components'
import CSBInstanceOm from './containers/MsaOm/CSBInstanceOm'
import MsaOmCSBApproval from './containers/MsaOm/CSBApproval'
import CSBCascadingLinkRules from './containers/MsaOm/CSBCascadingLinkRules'
import CreateLinkRules from './containers/MsaOm/CSBCascadingLinkRules/CreateLinkRules'
import Setting from './containers/Setting'
import GlobalSetting from './containers/Setting/GlobalSetting'
import ApmSetting from './containers/Setting/Apm'
import MsaConfig from './containers/Setting/MsaConfig'
import CSBInstances from './containers/CSB/Instances'
import AvailableInstances from './containers/CSB/Instances/Available'
import PublicInstances from './containers/CSB/Instances/Public'
import MyApplication from './containers/CSB/Instances/MyApplication'
import CSBInstanceDetail from './containers/CSB/InstanceDetail'
import InstanceDetailOverview from './containers/CSB/InstanceDetail/Overview/'
import MyPublishedServices from './containers/CSB/InstanceDetail/MyPublishedServices'
import MyPublishedServicesGroups from './containers/CSB/InstanceDetail/MyPublishedServices/Groups'
import ServiceSubscriptionApproval from './containers/CSB/InstanceDetail/ServiceSubscriptionApproval'
import MySubscribedService from './containers/CSB/InstanceDetail/MySubscribedService'
import SubscriptionServices from './containers/CSB/InstanceDetail/SubscriptionServices'
import ConsumerVouchers from './containers/CSB/InstanceDetail/ConsumerVouchers'
import PublishService from './containers/CSB/InstanceDetail/PublishService'
import PublicServices from './containers/CSB/InstanceDetail/PublicService'

export const appChildRoutes = [
  {
    path: '/',
    // component: IndexPage,
    exact: true,
    render: () => <Redirect to="/msa-manage" component={MsaManage} />,
    key: 'index',
  },
  {
    path: '/msa-manage',
    component: MsaManage,
    key: 'msa-manage',
  },
  {
    path: '/csb-instances',
    component: CSBInstances,
    key: 'csb-instances',
  },
  {
    path: '/csb-instances-available/:instanceID',
    component: CSBInstanceDetail,
    key: 'csb-instances',
  },
  {
    path: '/apms',
    component: Apm,
    key: 'apms',
  },
  {
    path: '/msa-om',
    component: MsaOm,
    key: 'msa-om',
  },
  {
    path: '/setting',
    component: Setting,
    key: 'setting',
  },
]

export const msaManageChildRoutes = [
  {
    path: '/msa-manage',
    exact: true,
    component: MsaList,
    key: 'index',
  },
  {
    path: '/msa-manage/register',
    exact: true,
    component: RegisterMsa,
    key: 'register',
  },
  {
    path: '/msa-manage/detail/:name',
    exact: true,
    component: MsaDetail,
    key: 'msa-detail',
  },
  {
    path: '/msa-manage/config-center',
    exact: true,
    component: MsaConfigCenter,
    key: 'config-center',
  },
  {
    path: '/msa-manage/config-center/config/create',
    component: CreateConfig,
    exact: true,
    key: 'create-config',
  },
  {
    path: '/msa-manage/config-center/:id',
    component: CreateConfig,
    exact: true,
    key: 'config-detail',
  },
  {
    path: '/msa-manage/call-link-tracking',
    exact: true,
    component: MsaCallLinkTracking,
    key: 'call-link-tracking',
  },
  {
    path: '/msa-manage/routing-manage',
    exact: true,
    component: MsaRoutingManage,
    key: 'routing-manage',
  },
  {
    path: '/msa-manage/api-gateway',
    exact: true,
    component: ApiGateway,
    key: 'api-gateway',
  },
  {
    path: '/msa-manage/api-gateway-monitoring',
    exact: true,
    component: ApiGatewayMonitoring,
    key: 'api-gateway-monitoring',
  },
  {
    path: '/msa-manage/blown-monitoring',
    exact: true,
    component: BlownMonitoring,
    key: 'blown-monitoring',
  },
  {
    path: '/msa-manage/certification-manage',
    exact: true,
    render: () => <Redirect to="/msa-manage/certification-manage/auth-zone" component={CertificationManageAuthZone} />,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-zone',
    exact: true,
    component: CertificationManageAuthZone,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-zone/:zoneId',
    exact: true,
    component: AuthZoneDetail,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-mode',
    exact: true,
    component: CertificationManageAuthMode,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/certification-manage/auth-scope',
    exact: true,
    component: CertificationManageAuthScope,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/event-manage',
    exact: true,
    render: () => <Redirect to="/msa-manage/event-manage/event" component={Event}/>,
    key: 'certification-manage',
  },
  {
    path: '/msa-manage/event-manage/event',
    exact: true,
    component: Event,
    key: 'event-manage',
  },
]

export const apmChildRoutes = [
  {
    path: '/apms',
    exact: true,
    render: () => <Redirect to="/apms/topology" component={Topology} />,
    key: 'index',
  },
  {
    path: '/apms/topology',
    component: Topology,
    exact: true,
    key: 'topology',
  },
  {
    path: '/apms/performance',
    component: Performance,
    exact: true,
    key: 'performance',
  },
  {
    path: '/apms/call-link-tracking',
    component: CallLinkTracking,
    exact: true,
    key: 'call-link-tracking',
  },
]

export const msaOmChildRoutes = [
  {
    path: '/msa-om',
    exact: true,
    render: () => <Redirect to="/msa-om/components" component={MsaComponents} />,
    key: 'index',
  },
  {
    path: '/msa-om/log',
    component: MsaOmLogs,
    exact: true,
    key: 'msa-om-logs',
  },
  {
    path: '/msa-om/components',
    component: MsaComponents,
    exact: true,
    key: 'msa-om-components',
  },
  {
    path: '/msa-om/csb-instance-om',
    component: CSBInstanceOm,
    exact: true,
    key: 'csb-instance-om',
  },
  {
    path: '/msa-om/csb-instance-approval',
    component: MsaOmCSBApproval,
    exact: true,
    key: 'csb-instance-approval',
  },
  {
    path: '/msa-om/csb-cascading-link-rules',
    component: CSBCascadingLinkRules,
    exact: true,
    key: 'csb-cascading-link-rules',
  },
  {
    path: '/msa-om/csb-cascading-link-rules/create',
    component: CreateLinkRules,
    exact: true,
    key: 'csb-cascading-link-rules-create',
  },
]

export const settingChildRoutes = [
  {
    path: '/setting',
    exact: true,
    render: () => <Redirect to="/setting/global-setting" component={GlobalSetting} />,
    key: 'index',
  },
  {
    path: '/setting/global-setting',
    component: GlobalSetting,
    exact: true,
    key: 'global-setting',
  },
  {
    path: '/setting/msa-config',
    component: MsaConfig,
    exact: true,
    key: 'apms',
  },
  {
    path: '/setting/apms',
    component: ApmSetting,
    exact: true,
    key: 'apms',
  },
]

export const csbInstancesChildRoutes = [
  {
    path: '/csb-instances',
    exact: true,
    render: () => <Redirect to="/csb-instances/available" component={AvailableInstances} />,
    key: 'index',
  },
  {
    path: '/csb-instances/available',
    component: AvailableInstances,
    exact: true,
    key: 'available',
  },
  {
    path: '/csb-instances/public',
    component: PublicInstances,
    exact: true,
    key: 'public',
  },
  {
    path: '/csb-instances/my-application',
    component: MyApplication,
    exact: true,
    key: 'my-application',
  },
]

export const csbInstanceDetailChildRoutes = [
  {
    path: '/csb-instances-available',
    exact: true,
    render: () => <Redirect to="/csb-instances/available" component={AvailableInstances} />,
    key: 'index',
  },
  {
    path: '/csb-instances-available/:instanceID',
    component: InstanceDetailOverview,
    exact: true,
    key: 'my-published-services',
  },
  {
    path: '/csb-instances-available/:instanceID/my-published-services',
    component: MyPublishedServices,
    exact: true,
    key: 'my-published-services',
  },
  {
    path: '/csb-instances-available/:instanceID/my-published-services-groups',
    component: MyPublishedServicesGroups,
    exact: true,
    key: 'my-published-services-groups',
  },
  {
    path: '/csb-instances-available/:instanceID/service-subscription-approval',
    component: ServiceSubscriptionApproval,
    exact: true,
    key: 'service-subscription-approval',
  },
  {
    path: '/csb-instances-available/:instanceID/my-subscribed-service',
    component: MySubscribedService,
    exact: true,
    key: 'my-subscribed-service',
  },
  {
    path: '/csb-instances-available/:instanceID/subscription-services',
    component: SubscriptionServices,
    exact: true,
    key: 'subscription-services',
  },
  {
    path: '/csb-instances-available/:instanceID/public-services',
    component: PublicServices,
    exact: true,
    key: 'plubic-services',
  },
  {
    path: '/csb-instances-available/:instanceID/consumer-vouchers',
    component: ConsumerVouchers,
    exact: true,
    key: 'consumer-vouchers',
  },
  {
    path: '/csb-instances-available/:instanceID/publish-service',
    component: PublishService,
    exact: true,
    key: 'publish-service',
  },
]

export class RoutesDom extends React.Component {
  render() {
    return <Route path="/" component={App} />
  }
}
