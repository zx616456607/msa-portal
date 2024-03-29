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
import App from './containers/App'
import LoadableWrapper from './components/LoadableWrapper'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'

export const appChildRoutes = [
  {
    path: '/',
    component: LoadableWrapper({
      path: 'overview', // path 是相对于 src/containers 的一个地址，且不能以 '/' 开头
      loader: () => import('./containers/overview' /* webpackChunkName: "index-page" */),
    }),
    exact: true,
    key: 'index',
  },
  {
    path: '/msa-manage',
    component: LoadableWrapper({
      path: 'MsaManage',
      loader: () => import('./containers/MsaManage' /* webpackChunkName: "msa-manage" */),
    }),
    key: 'msa-manage',
  },
  {
    path: '/distribute',
    component: LoadableWrapper({
      path: 'Distributed',
      loader: () => import('./containers/Distributed' /* webpackChunkName: "distributed" */),
    }),
    key: 'distribute',
  },
  {
    path: '/service-mesh',
    component: LoadableWrapper({
      path: 'ServiceMesh',
      loader: () => import('./containers/ServiceMesh' /* webpackChunkName: "servicemesh" */),
    }),
    key: 'ServiceMesh',
  },
  {
    path: '/msa-develop',
    component: LoadableWrapper({
      path: 'MsaDevelop',
      loader: () => import('./containers/MsaDevelop' /* webpackChunkName: "msa-develop" */),
    }),
    key: 'MsaDevelop',
  },
  {
    path: '/dubbo',
    component: LoadableWrapper({
      path: 'Dubbo',
      loader: () => import('./containers/Dubbo' /* webpackChunkName: "dubbo" */),
    }),
    key: 'dubbo',
  },
  {
    path: '/csb-instances',
    component: LoadableWrapper({
      path: 'CSB/Instances',
      loader: () => import('./containers/CSB/Instances' /* webpackChunkName: "csb-instances" */),
    }),
    key: 'csb-instances',
  },
  {
    path: '/apms',
    component: LoadableWrapper({
      path: 'Apm',
      loader: () => import('./containers/Apm' /* webpackChunkName: "apm" */),
    }),
    key: 'apms',
  },
  {
    path: '/msa-om',
    component: LoadableWrapper({
      path: 'MsaOm',
      loader: () => import('./containers/MsaOm' /* webpackChunkName: "msa-om" */),
    }),
    key: 'msa-om',
  },
  {
    path: '/setting',
    component: LoadableWrapper({
      path: 'Setting',
      loader: () => import('./containers/Setting' /* webpackChunkName: "setting" */),
    }),
    key: 'setting',
  },
  {
    path: '/api-gateway',
    component: LoadableWrapper({
      path: 'ApiGateWay',
      loader: () => import('./containers/ApiGateWay' /* webpackChunkName: "apiGateWay" */),
    }),
    key: 'apiGateWay',
  },
  {
    path: '/api-group',
    component: LoadableWrapper({
      path: 'ApiGroup',
      loader: () => import('./containers/ApiGroup' /* webpackChunkName: "api-group" */),
    }),
    key: 'api-group',
  },
]

export class AppWrapper extends React.Component {
  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <LocaleProvider locale={i18n.language === 'en' ? enUS : zhCN}>
          <App {...this.props} forceUpdateApp={() => this.forceUpdate()} />
        </LocaleProvider>
      </I18nextProvider>
    )
  }
}
