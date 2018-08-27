/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * SecretText component
 *
 * 2018-01-15
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import TenxIcon from '@tenx-ui/icon'
import './style/index.less'

export default class SecretText extends React.Component {
  static propTypes = {
    secret: PropTypes.string,
    children: PropTypes.node,
  }

  state = {
    show: false,
  }

  genStars = (len = 6) => {
    return (new Array(len + 1)).join('*')
  }

  render() {
    const { secret, children, className, ...otherProps } = this.props
    if (!secret && !children) {
      return '-'
    }
    const { show } = this.state
    const icon = show ? 'eye-closed' : 'eye'
    const classNames = ClassNames('secret-text', {
      [className]: className,
    })
    let text = secret || children
    if (!show) {
      text = this.genStars(text.length)
    }
    return (
      <span className={classNames} {...otherProps}>
        <font>{text}</font>
        <TenxIcon
          type={icon}
          size={14}
          onClick={() => this.setState({ show: !show })}
          className="eye-icon"
        />
      </span>
    )
  }
}

