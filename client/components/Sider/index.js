/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Sider component
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Layout, Card, Menu } from 'antd'
import ClassNames from 'classnames'
import { getMenuSelectedKeys } from '../../common/utils'

const LayoutSider = Layout.Sider
const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

export default class Sider extends React.Component {
  static propTypes = {
    title: PropTypes.node, // 侧边栏标题
    extra: PropTypes.bool, // 是否需要展示 title 以外的内容
    location: PropTypes.object.isRequired, // react-router 对应的 location，用于处理菜单选中状态
    menu: PropTypes.objectOf({ // 菜单相关配置
      mode: PropTypes.string, // 菜单模式
      items: PropTypes.array.isRequired, // menu items json 配置
      defaultOpenKeys: PropTypes.array, // 默认展开的 SubMenu
    }).isRequired,
  }

  static defaultProps = {
    extra: true,
    menu: {
      mode: 'inline',
    },
  }

  /**
   * render menu in sider
   *
   * @param {object} menu menu object
   * @return {element} menu element
   */
  renderMenu = menu => {
    const { type, to, icon, text, children, skiped, ...otherProps } = menu
    if (skiped) {
      return
    }
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
          {children.map(this.renderMenu)}
        </SubMenu>
      )
    }
    return (
      <MenuItem key={to} {...otherProps}>
        <Link to={to}>
          {icon}
          <span className="nav-text">{text}</span>
        </Link>
      </MenuItem>
    )
  }

  render() {
    const { title, extra, location, menu, ...otherProps } = this.props
    const classNames = ClassNames({
      'layout-sider': true,
      'layout-sider-extra': extra,
    })
    const { items, ...otherMenuProps } = menu
    return (
      <LayoutSider className={classNames} style={{ position: 'fixed' }} {...otherProps}>
        <Card
          className="left-menu-card"
          title={title}
        >
          <Menu mode="inline"
            selectedKeys={getMenuSelectedKeys(location, items)}
            {...otherMenuProps}
          >
            {
              items.map(this.renderMenu)
            }
          </Menu>
        </Card>
      </LayoutSider>
    )
  }
}
