/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service detail dock
 *
 * 2017-12-07
 * @author zhangpc
 */

import React from 'react'
import DetailPageDock from '../../../../components/Dock/DetailPageDock'
import ServiceDetail from './'

export default class ServiceDetailDock extends React.Component {
  render() {
    const { detail, self, renderServiceStatusUI, instanceId, ...otherProps } = this.props
    return (
      <DetailPageDock {...otherProps}>
        <ServiceDetail
          self={self}
          detail={detail}
          instanceId={instanceId}
          renderServiceStatusUI={renderServiceStatusUI} />
      </DetailPageDock>
    )
  }
}
