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
import { Layout, Menu, Dropdown, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { getDefaultSelectedKeys } from '../../common/utils'
import logo from '../../assets/img/logo.svg'
import './style/index.less'

const LayoutHeader = Layout.Header
const menus = [
  {
    to: '/',
    text: '总览',
  },
  {
    to: '/msa-manage',
    text: '微服务治理',
  },
  {
    to: '/apms',
    text: '性能管理（APM）',
  },
  {
    to: '/test2',
    text: '微服务运维',
    disabled: true,
  },
  {
    to: '/setting',
    text: '系统设置',
  },
]

export default class Header extends React.Component {
  render() {
    const {
      location,
      currentUser,
    } = this.props
    return (
      <LayoutHeader className="layout-header">
        <Link to="/">
          <svg className="logo">
            <use xlinkHref={`#${logo.id}`} />
          </svg>
        </Link>
        <div className="user">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="apm-setting">
                  <Link to="/setting/apms">
                  APM 配置
                  </Link>
                </Menu.Item>
                <Menu.Item key="test2">
                  <Link to="/setting/msa-config">
                  微服务配置
                  </Link>
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link">
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
