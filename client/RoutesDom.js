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
import { Route } from 'react-router-dom'
import App from './containers/App'
import LoadableWrapper from './components/LoadableWrapper'

export const appChildRoutes = [
  {
    path: '/',
    component: LoadableWrapper({
      path: 'IndexPage', // path 是相对于 src/containers 的一个地址，且不能以 '/' 开头
      loader: () => import('./containers/IndexPage' /* webpackChunkName: "index-page" */),
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
]

export class RoutesDom extends React.Component {
  render() {
    return <Route path="/" component={App} />
  }
}
