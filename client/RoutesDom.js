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
import TestPage from './containers/TestPage'
import Apm from './containers/Apm'
import Topology from './containers/Apm/Topology'
import Performance from './containers/Apm/Performance'
import CallLinkTracking from './containers/Apm/CallLinkTracking'

export const appChildRoutes = [
  {
    path: '/',
    component: IndexPage,
    exact: true,
    key: 'index',
  },
  {
    path: '/test',
    component: TestPage,
    exact: true,
    key: 'test',
  },
  {
    path: '/apms',
    component: Apm,
    key: 'apms',
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

export class RoutesDom extends React.Component {
  render() {
    return <Route path="/" component={App} />
  }
}
