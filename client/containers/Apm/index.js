/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apm container
 *
 * 2017-08-23
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import { loadApms } from '../../actions/apm'
import { Route, Switch } from 'react-router-dom'
import { apmChildRoutes } from '../../RoutesDom'
import './style/index.less'

const { Content } = Layout

class Apm extends React.Component {
  test = a => <h2>{a}</h2>

  componentWillMount() {
    const { loadApms } = this.props
    loadApms('test')
  }

  render() {
    const { children } = this.props
    return (
      <Layout className="apm">
        <Sider>
          <div className="apm-title">性能管理 APM</div>
          <Menu mode="inline" defaultSelectedKeys={[ '4' ]}>
            <Menu.Item key="topology">
              <Link to="/apms/topology">
                <Icon type="user" />
                <span className="nav-text">微服务拓扑</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/apms/performance">
                <Icon type="video-camera" />
                <span className="nav-text">微服务性能</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/apms/call-link-tracking">
                <Icon type="upload" />
                <span className="nav-text">调用链路跟踪</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="layout-content">
          { children }
          <Switch>
            {
              apmChildRoutes.map(routeProps => <Route {...routeProps} />)
            }
          </Switch>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  errorMessage: state.errorMessage,
  auth: state.entities.auth,
})

export default connect(mapStateToProps, {
  loadApms,
})(Apm)
