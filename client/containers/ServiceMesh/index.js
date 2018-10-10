/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * ServiceMesh container
 *
 * 2018-09-30
 * @author
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { serviceMeshChildRoutes } from '../../RoutesDom'

class ServiceMesh extends React.Component {
  componentDidMount() {
    //
  }

  renderChildren = () => {
    const { children } = this.props
    // if (!apms || !apms.ids) {
    //   return renderLoading('加载 APM 中 ...')
    // }
    return [
      children,
      <Switch key="switch">
        {
          serviceMeshChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    return (
      <Layout className="service-mesh">
        <Content>
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = () => ({
  //
})

export default connect(mapStateToProps, {
  //
})(ServiceMesh)
