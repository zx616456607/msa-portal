/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Instance detail dock
 *
 * 2018-2-1
 * @author zhangcz
 */

import React from 'react'
import DetailPageDock from '../../../../components/Dock/DetailPageDock'
import InstanceDetail from './'

export default class InstanceDetailDock extends React.Component {
  render() {
    const { detail, callback, instanceId, ...otherProps } = this.props
    return (
      <DetailPageDock {...otherProps}>
        <InstanceDetail
          callback={callback}
          detail={detail}
          instanceId={instanceId}
        />
      </DetailPageDock>
    )
  }
}
