/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaOm container
 *
 * 2017-11-10
 * @author zhangpc
 */

import React from 'react'
import { Layout, Menu, Icon, Card } from 'antd'
import { Route, Switch, Link } from 'react-router-dom'
import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { msaOmChildRoutes } from '../../RoutesDom'
import { getDefaultSelectedKeys } from '../../common/utils'

const menus = [
  {
    to: '/msa-om/logs',
    text: '日志查询',
    icon: <Icon type="file-text" style={{ fontSize: 15 }} />,
  },
]

export default class MsaOm extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          msaOmChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location } = this.props
    const title = (
      <div>
        微服务运维
      </div>
    )
    return (
      <Layout className="msa-om">
        <Sider key="sider">
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
        <Content key="content">
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}