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
    key: '/',
    text: '总览',
  },
  {
    to: '/msa-manage',
    key: 'msa-manage',
    text: '微服务治理',
  },
  {
    to: '/csb-instances',
    key: 'csb-instances',
    text: 'CSB',
    title: 'Cloud Service Bus',
  },
  {
    to: '/apms',
    key: 'apms',
    text: '性能管理（APM）',
  },
  {
    to: '/msa-om',
    key: 'msa-om',
    text: '微服务运维',
  },
  {
    to: '/setting',
    key: 'setting',
    text: '系统设置',
  },
]

export default class Header extends React.Component {
  render() {
    const {
      location,
      currentUser,
    } = this.props
    const { pathname } = location
    const pathArray = pathname.split('/')
    const selectedKeys = [ pathArray[1] || '/' ]
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
          selectedKeys={selectedKeys}
        >
          {
            menus.map(menu => {
              const { key, to, text, ...otherProps } = menu
              return (
                <Menu.Item
                  key={key}
                  {...otherProps}
                >
                  <Link to={to}>
                    {text}
                  </Link>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </LayoutHeader>
    )
  }
}
