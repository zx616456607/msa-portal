/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: step 3
 *
 * 2018-01-09
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import ErrorCode from './ErrorCode'

export default class Step2 extends React.Component {

  render() {
    const {
      className, data, ...otherProps
    } = this.props
    const classNames = ClassNames({
      // fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <ErrorCode data={data} {...otherProps} />
      </div>,
    ]
  }
}
