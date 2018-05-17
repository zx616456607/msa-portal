/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * siderNav Component
 *
 * @author songsz
 * @date 2018-05-16
 */
import React from 'react'
import { Layout, Menu, Icon } from 'antd'
// import styles from './style/index.less'
import logo from '../../assets/img/logo.svg'

const { Sider } = Layout
// const SubMenu = Menu.SubMenu

class SiderNav extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = collapsed => {
    this.setState({ collapsed })
  }
  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <svg className="logo">
          <use xlinkHref={`#${logo.id}`} />
        </svg>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[ '1' ]}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

export default SiderNav
