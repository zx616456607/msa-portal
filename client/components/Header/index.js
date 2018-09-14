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
import {
  Layout, Tag,
  Menu, Dropdown, Icon,
} from 'antd'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
// import cloneDeep from 'lodash/cloneDeep'
// import { getMenuSelectedKeys } from '../../common/utils'
// import { ROLE_SYS_ADMIN } from '../../constants'
import { ROLE_USER, ROLE_SYS_ADMIN, ROLE_BASE_ADMIN, ROLE_PLATFORM_ADMIN } from '../../constants'
// import logo from '../../assets/img/logo.svg'
import './style/index.less'

const LayoutHeader = Layout.Header
// const MENUS = [
//   /* {
//     to: '/',
//     key: '/',
//     text: '总览',
//   }, */
//   {
//     to: '/msa-manage',
//     key: 'msa-manage',
//     text: '微服务治理',
//   },
//   {
//     to: '/csb-instances',
//     key: 'csb-instances',
//     text: '服务总线',
//     title: 'Cloud Service Bus',
//   },
//   {
//     to: '/apms',
//     key: 'apms',
//     text: '性能管理（APM）',
//   },
//   {
//     to: '/msa-om',
//     key: 'msa-om',
//     text: '微服务运维',
//   },
//   {
//     to: '/setting',
//     key: 'setting',
//     text: '系统设置',
//   },
// ]

export default class Header extends React.Component {
  render() {
    const {
      // location,
      currentUser,
    } = this.props
    // const { pathname } = location
    // const pathArray = pathname.split('/')
    // let key = pathArray[1]
    // if (key) {
    //   if (key === 'csb-instances-available') {
    //     key = 'csb-instances'
    //   }
    // } else {
    //   key = '/'
    // }

    const { children, collapsed } = this.props
    const containerStyles = classNames({
      'layout-header': true,
      'width-wide': collapsed,
      'width-small': !collapsed,
      'layout-border': true,
    })
    const roleName = role => {
      switch (role) {
        case ROLE_SYS_ADMIN:
          return '系统管理员'
        case ROLE_PLATFORM_ADMIN:
          return '平台管理员'
        case ROLE_BASE_ADMIN:
          return '基础设施管理员'
        case ROLE_USER:
          return '普通成员'
        default:
          break
      }
    }
    return (
      <LayoutHeader className={containerStyles}>
        {children}
        {/* <div/>作为占位符, 当children不存在时, 防止name跑到左侧 */}
        <div />
        <div>
          <Dropdown
            overlay={
              <Menu style={{ top: 55 }}>
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
            {/* <div>
              <a className="ant-dropdown-link">
                {currentUser.userName || '...'}
              </a>
              <span className="role">系统管理员</span>
              <Icon type="down" />
            </div> */}
            <div className="user-panel-trigger userBtn">
              <div className="userBtnText">
                <div className="ant-dropdown-link">{currentUser.userName || '...'}</div>
                <div>
                  <Tag>
                    {
                      roleName(currentUser.role)
                    }
                  </Tag>
                </div>
              </div>
              <div className="userBtnIcon">
                <Icon type="down" />
              </div>
            </div>
          </Dropdown>
        </div>
        {/*
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
          defaultSelectedKeys={getMenuSelectedKeys(location, menus)}
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
        </Menu>*/}
      </LayoutHeader>
    )
  }
}
