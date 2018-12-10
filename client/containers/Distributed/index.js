/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Dubbo Component
 *
 * 2018-10-24
 * @author zhouhaitao
 */

import React from 'react'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import DistributedList from './DistributedList'
import ExecutionRecord from './ExecutionRecord'

const distributeChildRoutes = [
  {
    path: '/distribute/list',
    component: DistributedList,
    key: 'distribute-list',
  },
  {
    path: '/distribute/distribute-record',
    exact: true,
    component: ExecutionRecord,
    key: 'distribute-record',
  },
]

class Distributed extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          distributeChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }
  render() {
    return <Layout className="dubbo">
      <Content>
        {this.renderChildren()}
      </Content>
    </Layout>
  }
}
export default Distributed
