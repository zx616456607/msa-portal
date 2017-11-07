/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Content component
 *
 * 2017-11-01
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'

const LayoutContent = Layout.Content

export default class Content extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, ...otherProps } = this.props
    return (
      <Layout className="layout-content" {...otherProps}>
        <LayoutContent key="layout-content">
          { children }
        </LayoutContent>
      </Layout>
    )
  }
}
