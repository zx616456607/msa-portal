/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Msa manage container
 *
 * 2017-09-12
 * @author zhangpc
 */


import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Card, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import { Route, Switch } from 'react-router-dom'
import { msaManageChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'

const { Content } = Layout

const menus = [
  {
    to: '/msa-manage',
    text: '微服务列表',
  },
  {
    to: '/msa-manage/config-center',
    text: '配置中心',
  },
  {
    to: '/msa-manage/call-link-tracking',
    text: '服务调用链',
  },
  {
    to: '/msa-manage/routing-manage',
    text: '路由管理',
  },
  {
    to: '/msa-manage/api-gateway',
    text: '服务限流',
  },
  {
    to: '/msa-manage/api-gateway-monitoring',
    text: 'API 网关监控',
  },
]

class MsaManage extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          msaManageChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location } = this.props
    const title = (
      <div>
        微服务治理
        <div className="apm-switch">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="SpringCloud">
                  SpringCloud
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link" href="#">
              基于 SpringCloud <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </div>
    )
    return (
      <Layout className="msa-manage">
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
  const { current } = state
  return {
    auth: state.entities.auth,
    current: current || {},
  }
}

export default connect(mapStateToProps, {
  //
})(MsaManage)
