/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
*/

/**
 *
 *  mesh gateway
 *
 * @author Songsz
 * @date 2018-09-12
 *
*/

import React from 'react'
import './style/Card.less'
import { Icon, Popover } from 'antd'
import TenxIcon from '@tenx-ui/icon'
import Ellipsis from '@tenx-ui/ellipsis'

export default class GatewayCard extends React.Component {
  popoverContent = () => (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  )
  render() {
    const { onDelete } = this.props
    return (
      <div className="mesh-gateway-card">
        <div className="top">
          <TenxIcon type="routing-manage" className="top-icon"/>
          <span
            className="card-right">
            <div className="title">网关 xxx</div>
            <div className="out-address">出口地址: http://192.168.5.223</div>
            <Popover content={this.popoverContent()} placement="right">
              <Ellipsis lines={2} tooltip={false}>
                关联灰度发布规则: xxx, bbbdsdsdsd,xcxdsdsdsds, ffffff, zzz=zzz+77777,
                xcxdsdsdsds, ffffff, zzz=zzz+77777, xcxdsdsdsds, ffffff,
                zzz=zzz+77777, xcxdsdsdsds, ffffff, zzz=zzz+77777</Ellipsis>
            </Popover>
          </span>
        </div>
        <div className="actions">
          <div className="action"><Icon type="eye"/> 查看详情</div>
          <span className="divider"/>
          <div className="action"><Icon type="edit"/> 编辑</div>
          <span className="divider"/>
          <div className="action" onClick={onDelete}><Icon type="delete"/> 删除</div>
        </div>
      </div>
    )
  }
}
