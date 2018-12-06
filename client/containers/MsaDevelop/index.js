/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDevelop Component
 *
 * 2018-10-24
 * @author zhouhaitao
 */

import React from 'react'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { msaDevelopChildRoutes } from '../../RoutesDom'

class MsaDevelop extends React.Component {
  renderChildren = () => {
    const { children } = this.props

    return [
      children,
      <Switch key="switch">
        {
          msaDevelopChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }
  render() {
    return <Layout className="msa-develop">
      <Content>
        {this.renderChildren()}
      </Content>
    </Layout>
  }
}
export default MsaDevelop
