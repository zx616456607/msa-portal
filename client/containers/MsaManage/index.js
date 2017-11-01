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
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { msaManageChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'
import configCenterIcon from '../../assets/img/msa-manage/config-center.svg'
import routingManageIcon from '../../assets/img/msa-manage/routing-manage.svg'
import apiGatewayIcon from '../../assets/img/msa-manage/api-gateway.svg'
// import apiGatewayMonitoringIcon from '../../assets/img/msa-manage/api-gateway-monitoring.svg'
import certificationManageIcon from '../../assets/img/msa-manage/certification-manage.svg'

const SubMenu = Menu.SubMenu

const menus = [
  {
    to: '/msa-manage',
    text: '微服务列表',
    icon: <Icon type="bars" style={{ fontSize: 16 }} />,
  },
  {
    to: '/msa-manage/config-center',
    text: '配置中心',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={configCenterIcon.url} />
      </svg>
    ),
  },
  {
    to: '/msa-manage/call-link-tracking',
    text: '服务调用链',
    icon: <Icon type="link" />,
  },
  {
    to: '/msa-manage/routing-manage',
    text: '路由管理',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={routingManageIcon.url} />
      </svg>
    ),
  },
  {
    to: '/msa-manage/api-gateway',
    text: '服务限流',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={apiGatewayIcon.url} />
      </svg>
    ),
  },
  /* {
    to: '/msa-manage/api-gateway-monitoring',
    text: 'API 网关监控',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={apiGatewayMonitoringIcon.url} />
      </svg>
    ),
  }, */
  {
    type: 'SubMenu',
    text: '认证管理',
    to: '/msa-manage/certification-manage',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={certificationManageIcon.url} />
      </svg>
    ),
    children: [
      {
        to: '/msa-manage/certification-manage/clients',
        text: '客户端管理',
      },
      {
        to: '/msa-manage/certification-manage/auth-mode',
        text: '授权方式查看',
      },
      {
        to: '/msa-manage/certification-manage/auth-scope',
        text: '授权范围查看',
      },
    ],
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

  renderMenu = menu => {
    if (menu.type === 'SubMenu') {
      return (
        <SubMenu
          key={menu.to}
          title={
            <span>
              {menu.icon}
              <span className="nav-text">{menu.text}</span>
            </span>
          }
        >
          {menu.children.map(this.renderMenu)}
        </SubMenu>
      )
    }
    return (
      <Menu.Item key={menu.to}>
        <Link to={menu.to}>
          {menu.icon}
          <span className="nav-text">{menu.text}</span>
        </Link>
      </Menu.Item>
    )
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
                menus.map(this.renderMenu)
              }
            </Menu>
          </Card>
        </Sider>
        <Content>
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
