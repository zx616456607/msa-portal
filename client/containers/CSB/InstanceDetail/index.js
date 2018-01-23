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
import { Layout, Icon, Breadcrumb } from 'antd'
import Sider from '../../../components/Sider'
import Content from '../../../components/Content'
import { Route, Switch } from 'react-router-dom'
import { csbInstanceDetailChildRoutes } from '../../../RoutesDom'
import { renderLoading } from '../../../components/utils'
import {
  UNUSED_CLUSTER_ID,
} from '../../../constants'
import { getInstanceByID } from '../../../actions/CSB/instance'
import './style/index.less'

class CSBInstanceDetail extends React.Component {
  state = {
    error: null,
  }

  componentDidMount() {
    const { instanceID, getInstanceByID } = this.props
    getInstanceByID(UNUSED_CLUSTER_ID, instanceID).then(res => {
      if (res.error) {
        this.setState({
          error: res.error,
        })
      }
    })
  }

  renderChildren = () => {
    const { children, currentInstance, location } = this.props
    if (this.state.error) {
      return <div className="loading">
        加载实例信息失败，请
        <a href={location.pathname}>刷新重试</a>
        或联系管理员。
      </div>
    }
    if (!currentInstance) {
      return renderLoading('加载实例中 ...')
    }
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
    const { location, instanceID, currentInstance } = this.props
    const instanceName = currentInstance
      && currentInstance.instance
      && currentInstance.instance.name
    const menus = [
      {
        to: `/csb-instances-available/${instanceID}`,
        text: '概览',
        icon: <Icon type="dashboard" />,
      },
      {
        type: 'SubMenu',
        text: '服务发布',
        icon: <Icon type="user" />,
        key: 'service-publish',
        skiped: currentInstance && currentInstance.role === 1,
        children: [
          {
            to: `/csb-instances-available/${instanceID}/my-published-services`,
            includePaths: [
              `/csb-instances-available/${instanceID}/my-published-services-groups`,
              `/csb-instances-available/${instanceID}/publish-service`,
            ],
            text: '我发布的服务',
          },
          /* {
            to: `/csb-instances-available/${instanceID}/my-published-services-groups`,
            text: '我的服务组',
          }, */
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
            skiped: currentInstance && currentInstance.role === 2,
          },
          {
            to: `/csb-instances-available/${instanceID}/subscription-services`,
            text: '可订阅服务',
            skiped: currentInstance && currentInstance.role === 2,
          },
          {
            to: `/csb-instances-available/${instanceID}/public-services`,
            text: '公开服务',
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
          <Breadcrumb.Item className="instance-name-bread" title={instanceName}>
            {instanceName || '...'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Layout>
          <Sider
            key="sider"
            extra={false}
            location={location}
            menu={{
              items: menus,
              defaultOpenKeys: [ 'service-publish', 'service-subscription' ],
            }}
          />
          <Content>
            {this.renderChildren()}
          </Content>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { csbAvaInstances } = entities
  const { match } = ownProps
  const { instanceID } = match.params
  return {
    instanceID,
    currentInstance: csbAvaInstances && csbAvaInstances[instanceID],
  }
}

export default connect(mapStateToProps, {
  getInstanceByID,
})(CSBInstanceDetail)
