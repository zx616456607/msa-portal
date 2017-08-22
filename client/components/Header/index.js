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
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import './style/index.less'

const LayoutHeader = Layout.Header

export default class Header extends React.Component {
  render() {
    return (
      <LayoutHeader className="layout-header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[ '2' ]}
          className="layout-header-menu"
        >
          <Menu.Item key="1">
            <Link to="/">
            home
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/test">
            test
            </Link>
          </Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </LayoutHeader>
    )
  }
}
