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
import ClassNames from 'classnames'

const LayoutSider = Layout.Sider

export default class Sider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    extra: PropTypes.bool,
  }

  static defaultProps = {
    extra: true,
  }

  render() {
    const { extra, children, ...otherProps } = this.props
    const classNames = ClassNames({
      'layout-sider': true,
      'layout-sider-extra': extra,
    })
    return (
      <LayoutSider className={classNames} style={{ position: 'fixed' }} {...otherProps}>
        { children }
      </LayoutSider>
    )
  }
}
