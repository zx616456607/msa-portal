/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Utils functions for components
 *
 * 2017-12-01
 * @author zhangpc
 */

import React from 'react'
import { Menu, Spin } from 'antd'
import { Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu

/**
 * render menus in sider
 *
 * @export
 * @param {array} menu menu list
 * @return {element} menu element
 */
export function renderMenu(menu) {
  const { type, to, icon, text, children, ...otherProps } = menu
  if (type === 'SubMenu') {
    return (
      <SubMenu
        key={to}
        title={
          <span>
            {icon}
            <span className="nav-text">{text}</span>
          </span>
        }
        {...otherProps}
      >
        {children.map(renderMenu)}
      </SubMenu>
    )
  }
  return (
    <Menu.Item key={to} {...otherProps}>
      <Link to={to}>
        {icon}
        <span className="nav-text">{text}</span>
      </Link>
    </Menu.Item>
  )
}

export function renderLoading(tip) {
  return <div className="loading">
    <Spin size="large" tip={tip} />
  </div>
}
