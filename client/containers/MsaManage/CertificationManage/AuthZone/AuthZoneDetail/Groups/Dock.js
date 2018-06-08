/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Groups detail dock
 *
 * @author zhaoyb
 * @date 2018-06-08
 */
import React from 'react'
import DetailPageDock from '../../../../../../components/Dock/DetailPageDock'
import GroupsDetail from './GroupsDetail'

export default class GroupsDetailDock extends React.Component {
  render() {
    const { groupInfo, ...otherProps } = this.props
    return (
      <DetailPageDock {...otherProps}>
        <GroupsDetail
          {...{ groupInfo }}
        />
      </DetailPageDock>
    )
  }
}
