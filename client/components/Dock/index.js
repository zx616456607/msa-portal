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
    dimStyle: {
      backgroundColor: 'rgba(55, 55, 55, .6)',
    },
  }

  state = {
    size: this.props.defaultSize || DEFAULT_SIZE,
  }

  componentWillReceiveProps(nextProps) {
    const { size: newSize } = nextProps
    const { size: oldSize } = this.props
    if (newSize !== oldSize) {
      this.setState({
        size: newSize,
      })
    }
  }

  onSizeChange = size => {
    const { minSize, maxSize, onSizeChange } = this.props
    if (size >= minSize && size <= maxSize) {
      this.setState({ size })
      onSizeChange && onSizeChange(size)
    }
  }

  render() {
    const { children, position, isVisible, dimMode, dimStyle, ...otherProps } = this.props
    const { size } = this.state
    return (
      <ReactDock
        position={position}
        isVisible={isVisible}
        dimMode={dimMode}
        dimStyle={dimStyle}
        size={size}
        onSizeChange={this.onSizeChange}
        {...otherProps}
      >
        {children}
      </ReactDock>
    )
  }
}
