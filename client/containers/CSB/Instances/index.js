/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instances
 * CSB 实例
 *
 * 2017-12-01
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Card } from 'antd'
import Sider from '../../../components/Sider'
import Content from '../../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { csbInstancesChildRoutes } from '../../../RoutesDom'
import { getMenuSelectedKeys } from '../../../common/utils'
import { renderMenu } from '../../../components/utils'
import './style/index.less'

const menus = [
  {
    type: 'SubMenu',
    text: '我的实例',
    icon: <Icon type="user" />,
    key: 'mine-csb-instances',
    children: [
      {
        to: '/csb-instances/available',
        text: '可用实例',
      },
      {
        to: '/csb-instances/my-application',
        text: '我的申请',
      },
    ],
  },
  {
    type: 'SubMenu',
    text: '可申请实例',
    icon: <Icon type="unlock" />,
    key: 'public-csb-instances',
    children: [
      {
        to: '/csb-instances/public',
        text: '可申请实例',
      },
    ],
  },
]

class CSBInstances extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          csbInstancesChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location } = this.props
    const title = (
      <div>
        CSB 实例
      </div>
    )
    return (
      <Layout className="csb-instances">
        <Sider extra={false}>
          <Card
            className="left-menu-card"
            title={title}
            hoverable={false}
          >
            <Menu mode="inline"
              selectedKeys={getMenuSelectedKeys(location, menus)}
              defaultOpenKeys={[ 'mine-csb-instances', 'public-csb-instances' ]}
            >
              {
                menus.map(renderMenu)
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

const mapStateToProps = () => ({})

export default connect(mapStateToProps, {
  //
})(CSBInstances)
