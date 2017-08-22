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
import IndexPage from './containers/IndexPage'
import TestPage from './containers/TestPage'

export const childRoutes = [
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
]

export class RoutesDom extends React.Component {
  render() {
    return <Route path="/" component={App} />
  }
}
