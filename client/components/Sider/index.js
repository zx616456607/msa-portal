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
import { Layout } from 'antd'

const LayoutSider = Layout.Sider

export default class Sider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, ...otherProps } = this.props
    return (
      <LayoutSider className="layout-sider" style={{ position: 'fixed' }} {...otherProps}>
        { children }
      </LayoutSider>
    )
  }
}
