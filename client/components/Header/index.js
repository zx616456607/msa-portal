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
import { Layout,
  Menu, Dropdown, Icon,
} from 'antd'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
// import cloneDeep from 'lodash/cloneDeep'
// import { getMenuSelectedKeys } from '../../common/utils'
// import { ROLE_SYS_ADMIN } from '../../constants'
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
    })
    return (
      <LayoutHeader className={containerStyles}>
        {children}
        <div className="">
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
        {/* <Link to="/">
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
