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
import { Layout, Menu, Icon, Card, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import { loadApms } from '../../actions/apm'
import { Route, Switch } from 'react-router-dom'
import { apmChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'
import './style/index.less'

const { Content } = Layout
const menus = [
  {
    to: '/apms/topology',
    icon: <Icon type="api" />,
    text: '微服务拓扑',
  },
  {
    to: '/apms/performance',
    icon: <Icon type="bar-chart" />,
    text: '微服务性能',
  },
  {
    to: '/apms/call-link-tracking',
    icon: <Icon type="compass" />,
    text: '调用链路跟踪',
  },
]

class Apm extends React.Component {
  componentWillMount() {
    // const { loadApms } = this.props
    // loadApms('test')
  }
  render() {
    const { children, location } = this.props
    const title = (
      <div>
        性能管理 APM
        <div className="apm-switch">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout">
                  PinPoint
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link" href="#">
              基于 PinPoint <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </div>
    )
    return (
      <Layout className="apm">
        <Sider>
          <Card
            title={title}
            noHovering={false}
          >
            <Menu mode="inline"
              defaultSelectedKeys={getDefaultSelectedKeys(location, menus)}
            >
              {
                menus.map(menu => (
                  <Menu.Item key={menu.to}>
                    <Link to={menu.to}>
                      {menu.icon}
                      <span className="nav-text">{menu.text}</span>
                    </Link>
                  </Menu.Item>
                ))
              }
            </Menu>
          </Card>
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
