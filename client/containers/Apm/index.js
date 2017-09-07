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
import { Layout, Menu, Icon, Card, Dropdown, Spin } from 'antd'
import { Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import { loadApms } from '../../actions/apm'
import { loadPPApps } from '../../actions/pinpoint'
import { Route, Switch } from 'react-router-dom'
import { apmChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'
import topologyIcon from '../../assets/img/apm/topology.svg'
import performanceIcon from '../../assets/img/apm/performance.svg'
import callLinkTrackingIcon from '../../assets/img/apm/call-link-tracking.svg'
import './style/index.less'

const { Content } = Layout
const menus = [
  {
    to: '/apms/topology',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={topologyIcon.url} />
      </svg>
    ),
    text: '微服务拓扑',
  },
  {
    to: '/apms/performance',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={performanceIcon.url} />
      </svg>
    ),
    text: '微服务性能',
  },
  {
    to: '/apms/call-link-tracking',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={callLinkTrackingIcon.url} />
      </svg>
    ),
    text: '调用链路跟踪',
  },
]

class Apm extends React.Component {
  componentWillMount() {
    const { loadApms, current, loadPPApps } = this.props
    const clusterID = current.config.cluster.id
    loadApms(clusterID).then(res => {
      if (!res.error) {
        const { apms } = res.response.result.data
        return loadPPApps(clusterID, apms[0])
      }
    })
  }

  renderLoading = tip => (
    <div className="loading">
      <Spin size="large" tip={tip} />
    </div>
  )

  renderChildren = () => {
    const { apms, children } = this.props
    if (!apms || !apms.ids) {
      return this.renderLoading('加载 APM 中 ...')
    }
    return [
      children,
      <Switch key="switch">
        {
          apmChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location } = this.props
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
            className="left-menu-card"
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
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms } = state
  const { project, cluster } = current.config
  let apms = queryApms[project.namespace] || {}
  apms = apms[cluster.id] || {}
  return {
    errorMessage: state.errorMessage,
    auth: state.entities.auth,
    current: current || {},
    apms,
  }
}

export default connect(mapStateToProps, {
  loadApms,
  loadPPApps,
})(Apm)
