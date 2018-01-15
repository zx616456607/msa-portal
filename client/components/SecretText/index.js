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
import iconEye from '../../assets/img/components/secret-text/eye.svg'
import iconEyeClosed from '../../assets/img/components/secret-text/eye-closed.svg'
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
    const icon = show ? iconEyeClosed : iconEye
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
        <svg className="eye-icon" onClick={() => this.setState({ show: !show })}>
          <use xlinkHref={`#${icon.id}`} />
        </svg>
      </span>
    )
  }
}

