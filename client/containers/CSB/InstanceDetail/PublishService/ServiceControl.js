/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: service control
 *
 * 2017-12-05
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'

export default class ServiceControl extends React.Component {
  render() {
    const { className } = this.props
    const classNames = ClassNames({
      'service-control': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <h1>ServiceControl</h1>
      </div>
    )
  }
}
