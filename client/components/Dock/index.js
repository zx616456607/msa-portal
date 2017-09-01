/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Dock component
 *
 * 2017-08-31
 * @author zhangpc
 */

import React from 'react'
import ReactDock from 'react-dock'
import PropTypes from 'prop-types'

const DEFAULT_SIZE = 0.5

export default class Dock extends React.Component {
  static propTypes = {
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
  }

  static defaultProps = {
    minSize: 0.1,
    maxSize: 0.95,
  }

  state = {
    size: this.props.defaultSize || DEFAULT_SIZE,
  }

  onSizeChange = size => {
    const { minSize, maxSize } = this.props
    if (size >= minSize && size <= maxSize) {
      this.setState({ size })
      this.props.onSizeChange(size)
    }
  }

  render() {
    const { children, position, isVisible, dimMode, dimStyle } = this.props
    const { size } = this.state
    return (
      <ReactDock
        position={position}
        isVisible={isVisible}
        dimMode={dimMode}
        dimStyle={dimStyle}
        size={size}
        onSizeChange={this.onSizeChange}
      >
        {children}
      </ReactDock>
    )
  }
}
