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
import { Route, Switch } from 'react-router-dom'
import Sider from '../../components/Sider'
import Content from '../../components/Content'
import { msaOmChildRoutes } from '../../RoutesDom'
import { getMenuSelectedKeys } from '../../common/utils'
import { renderMenu } from '../../components/utils'
import msaComponent from '../../assets/img/log/msa-component.svg'

const menus = [
  {
    to: '/msa-om/components',
    text: '微服务组件',
    icon: (
      <svg className="menu-icon">
        <use xlinkHref={`#${msaComponent.id}`} />
      </svg>
    ),
  },
  {
    to: '/msa-om/log',
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
        <Sider key="sider" extra={false}>
          <Card
            className="left-menu-card"
            title={title}
            hoverable={false}
          >
            <Menu mode="inline"
              defaultSelectedKeys={getMenuSelectedKeys(location, menus)}
            >
              {
                menus.map(renderMenu)
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
