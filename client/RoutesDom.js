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
import { Route, Switch } from 'react-router-dom'
import App from './containers/App'
import IndexPage from './containers/IndexPage'
import TestPage from './containers/TestPage'

export default class RoutesDom extends React.Component {
  render() {
    const parent = props => (
      <App
        {...props}
        routes={
          <Switch>
            <Route exact path='/' component={IndexPage} />
            <Route path='/test' component={TestPage} />
          </Switch>
        }
      />
    )
    return <Route path="/" component={parent} />
  }
}
