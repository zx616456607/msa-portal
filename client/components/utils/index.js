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
import { Menu, Spin, Badge } from 'antd'
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

/**
 * render service status of CSB instance
 *
 * @export
 * @param {number} serviceStatus status of service
 * @return {element} badge element
 */
export function renderCSBInstanceServiceStatus(serviceStatus) {
  let status
  let text
  switch (serviceStatus) {
    case 1:
      text = '已激活'
      status = 'success'
      break
    case 2:
      text = '已停用'
      status = 'error'
      break
    case 4:
      text = '已注销'
      status = 'default'
      break
    default:
      text = '未知'
      status = 'default'
      break
  }
  return <Badge status={status} text={text} />
}

/**
 * render service approve status of CSB instance
 *
 * @export
 * @param {number} serviceStatus status of service
 * @return {element} badge element
 */
export function renderCSBInstanceServiceApproveStatus(serviceStatus) {
  let status
  let text
  switch (serviceStatus) {
    case 1:
      text = '待审批'
      status = 'processing'
      break
    case 2:
      text = '已通过'
      status = 'success'
      break
    case 3:
      text = '已拒绝'
      status = 'error'
      break
    case 4:
      text = '已退订'
      status = 'default'
      break
    default:
      text = '未知'
      status = 'default'
      break
  }
  return <Badge status={status} text={text} />
}
