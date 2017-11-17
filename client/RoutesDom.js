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
import IndexPage from './containers/IndexPage'
import MsaManage from './containers/MsaManage'
import RegisterMsa from './containers/MsaManage/MsaList/RegisterMsa'
import MsaList from './containers/MsaManage/MsaList/index'
import MsaDetail from './containers/MsaManage/MsaList/MsaDetail'
import MsaConfigCenter from './containers/MsaManage/ConfigCenter/ConfigCenter'
import CreateConfig from './containers/MsaManage/ConfigCenter/CreateConfig'
import MsaCallLinkTracking from './containers/MsaManage/CallLinkTracking'
import MsaRoutingManage from './containers/MsaManage/RoutingManage/RoutingManage'
import ApiGateway from './containers/MsaManage/ApiGateway'
import ApiGatewayMonitoring from './containers/MsaManage/ApiGatewayMonitoring'
import BlownMonitoring from './containers/MsaManage/BlownMonitoring'
// import CertificationManageClients from './containers/MsaManage/CertificationManage/Clients'
import CertificationManageAuthMode from './containers/MsaManage/CertificationManage/AuthMode'
import CertificationManageAuthScope from './containers/MsaManage/CertificationManage/AuthScope'
import Apm from './containers/Apm'
import Topology from './containers/Apm/Topology'
import Performance from './containers/Apm/Performance'
import CallLinkTracking from './containers/Apm/CallLinkTracking'
import MsaOm from './containers/MsaOm'
import MsaOmLogs from './containers/MsaOm/Logs'
import Setting from './containers/Setting'
import GlobalSetting from './containers/Setting/GlobalSetting'
import ApmSetting from './containers/Setting/Apm'
import MsaConfig from './containers/Setting/msaConfig'

export const appChildRoutes = [
  {
    path: '/',
    component: IndexPage,
    exact: true,
    key: 'index',
  },
  {
    path: '/msa-om',
    component: MsaOm,
    key: 'msa-om',
  },
  {
    path: '/msa-manage',
    component: MsaManage,
    key: 'msa-manage',
  },
  {
    path: '/apms',
    component: Apm,
    key: 'apms',
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
    render: () => <Redirect to="/msa-manage/certification-manage/auth-mode" component={CertificationManageAuthMode} />,
    key: 'certification-manage',
  },
  /* {
    path: '/msa-manage/certification-manage/clients',
    exact: true,
    component: CertificationManageClients,
    key: 'certification-manage',
  }, */
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
    render: () => <Redirect to="/msa-om/logs" component={MsaOmLogs} />,
    key: 'index',
  },
  {
    path: '/msa-om/logs',
    component: MsaOmLogs,
    exact: true,
    key: 'msa-om-logs',
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
    key: 'global_setting',
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

export class RoutesDom extends React.Component {
  render() {
    return <Route path="/" component={App} />
  }
}
