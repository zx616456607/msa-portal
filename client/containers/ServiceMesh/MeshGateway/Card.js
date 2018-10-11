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
import { Icon, Popover, Tooltip } from 'antd'
import TenxIcon from '@tenx-ui/icon'
import Ellipsis from '@tenx-ui/ellipsis'
import { getDeepValue } from '../../../common/utils'

export default class GatewayCard extends React.Component {
  popoverContent = rules => (
    <div className="mesh-gateway-popover-content">
      <span className="title">关联路由规则</span>
      {
        (rules.length ? rules : [ '暂无' ]).map(rule => (
          <span className="rule">
            <Ellipsis>{rule}</Ellipsis>
          </span>
        ))
      }
    </div>
  )
  outAddress = () => {
    const { ingressData, data } = this.props
    const id = data.spec.selector['istio-ingressgateway']
    const exposedIPs = getDeepValue(ingressData || {}, [ id, 'exposedIPs' ]) || []
    return exposedIPs.join(',')
  }
  render() {
    const { onDelete, showDetail, onEdit, data, id } = this.props
    const out = this.outAddress()
    const rules = data.referencedVirtualServices || []
    return (
      <div className="mesh-gateway-card">
        <div className="top">
          <TenxIcon type="routing-manage" className="top-icon"/>
          <span className="card-right">
            <div className="title">
              {`网关 ${data.metadata.name}`}
              {
                !out &&
                <Tooltip placement="top" title="该网关的服务网格出口已被删除，请编辑重新选择一个作为网络出口">
                  <Icon className="warning-no-out" type="warning" theme="outlined" />
                </Tooltip>
              }
            </div>
            <div className="out-address">{`出口地址: ${out || '--'}`}</div>
            <Popover content={this.popoverContent(rules)} placement="right">
              <Ellipsis lines={2} tooltip={false}>{`关联路由规则: ${rules.join(',') || '--'}`}</Ellipsis>
            </Popover>
          </span>
        </div>
        <div className="actions">
          <div className="action" onClick={() => showDetail(data)}><Icon type="eye"/> 查看详情</div>
          <span className="divider"/>
          <div className="action" onClick={() => onEdit(data)}><Icon type="edit"/> 编辑</div>
          <span className="divider"/>
          <div className="action" onClick={() => onDelete(id)}><Icon type="delete"/> 删除</div>
        </div>
      </div>
    )
  }
}
