/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * detail of CSB instance
 * CSB 实例
 *
 * 2017-12-01
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon, Card, Breadcrumb } from 'antd'
import Sider from '../../../components/Sider'
import Content from '../../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { csbInstanceDetailChildRoutes } from '../../../RoutesDom'
import { getDefaultSelectedKeys } from '../../../common/utils'
import { renderMenu } from '../../../components/utils'
import './style/index.less'

class CSBInstanceDetail extends React.Component {
  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          csbInstanceDetailChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const { location, match } = this.props
    const { instanceID } = match.params
    const menus = [
      {
        to: `/csb-instances-available/${instanceID}`,
        text: '概览',
        key: 'available',
        icon: <Icon type="line-chart" />,
      },
      {
        type: 'SubMenu',
        text: '服务发布',
        icon: <Icon type="user" />,
        key: 'service-publish',
        children: [
          {
            to: `/csb-instances-available/${instanceID}/my-published-services`,
            text: '我发布的服务',
          },
          {
            to: `/csb-instances-available/${instanceID}/service-subscription-approval`,
            text: '服务订阅审批',
          },
        ],
      },
      {
        type: 'SubMenu',
        text: '服务订阅',
        icon: <Icon type="unlock" />,
        key: 'service-subscription',
        children: [
          {
            to: `/csb-instances-available/${instanceID}/my-subscribed-service`,
            text: '我订阅的服务',
          },
          {
            to: `/csb-instances-available/${instanceID}/subscription-services`,
            text: '可订阅服务',
          },
          {
            to: `/csb-instances-available/${instanceID}/consumer-vouchers`,
            text: '消费凭证',
          },
        ],
      },
    ]
    return (
      <div className="csb-instance-detail">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/csb-instances">CSB 实例列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>CSB 实例详情</Breadcrumb.Item>
        </Breadcrumb>
        <Layout>
          <Sider extra={false}>
            <Card
              className="left-menu-card"
              hoverable={false}
            >
              <Menu mode="inline"
                defaultSelectedKeys={getDefaultSelectedKeys(location, menus)}
                defaultOpenKeys={[ 'service-publish', 'service-subscription' ]}
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
      </div>
    )
  }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps, {
  //
})(CSBInstanceDetail)
