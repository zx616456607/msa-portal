/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Header component
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { Layout, Menu, Dropdown, Icon, Button } from 'antd'
import { Link } from 'react-router-dom'
import { getDefaultSelectedKeys } from '../../common/utils'
import './style/index.less'

const LayoutHeader = Layout.Header
const menus = [
  {
    to: '/',
    text: '总览',
    disabled: true,
  },
  {
    to: '/test1',
    text: '微服务治理',
    disabled: true,
  },
  {
    to: '/apms',
    text: '性能管理 APM',
  },
  {
    to: '/test2',
    text: '微服务运维',
    disabled: true,
  },
  {
    to: '/test3',
    text: '系统设置',
    disabled: true,
  },
]

const testClusters = [
  {
    clusterID: 'CID-fe23111d77cb',
    clusterName: '时速云测试环境',
  },
  {
    clusterID: 'CID-fe23111d7test',
    clusterName: '不要删除修改测试集群',
  },
]

export default class Header extends React.Component {
  state = {
    clustersText: '切换集群',
  }

  componentDidMount() {
    const [ firstCluster ] = testClusters
    this.setState({
      clustersText: firstCluster.clusterName,
    })
    this.props.setCurrent({
      cluster: {
        id: firstCluster.clusterID,
      },
    })
  }

  handleClusterChange = ({ item, key }) => {
    const { setCurrent } = this.props
    this.setState({
      clustersText: item.props.children,
    })
    setCurrent({
      cluster: {
        id: key,
      },
    })
  }

  render() {
    const { location, currentUser } = this.props
    const { clustersText } = this.state
    return (
      <LayoutHeader className="layout-header">
        <Link to="/apms">
          <div className="logo" />
        </Link>
        <div className="clusters">
          <Dropdown
            overlay={
              <Menu onSelect={this.handleClusterChange}>
                {
                  testClusters.map(cluster => (
                    <Menu.Item key={cluster.clusterID}>
                      {cluster.clusterName}
                    </Menu.Item>
                  ))
                }
              </Menu>
            }
            trigger={[ 'click' ]}>
            <Button type="ghost" style={{ marginLeft: 8 }} title={clustersText}>
              {clustersText} <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <div className="user">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout">
                  退 出
                </Menu.Item>
                <Menu.Item key="test1">
                  test1
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="test2">
                  test2
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link" href="#">
              {currentUser.userName || '...'} <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={getDefaultSelectedKeys(location, menus)}
          className="layout-header-menu"
        >
          {
            menus.map(menu => (
              <Menu.Item
                key={menu.to}
                disabled={menu.disabled}>
                <Link to={menu.to}>
                  {menu.text}
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </LayoutHeader>
    )
  }
}
