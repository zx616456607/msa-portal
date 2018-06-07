/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * User detail dock
 *
 * @author zhangxuan
 * @date 2018-06-07
 */
import React from 'react'
import DetailPageDock from '../../../../../../../components/Dock/DetailPageDock'
import UserDetail from './'

export default class UserDetailDock extends React.Component {
  render() {
    const { userId, propsFunc, ...otherProps } = this.props
    return (
      <DetailPageDock {...otherProps}>
        <UserDetail
          {...{ userId, propsFunc }}
        />
      </DetailPageDock>
    )
  }
}
