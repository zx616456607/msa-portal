/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Subscription detail dock
 *
 * 2017-12-08
 * @author zhangpc
 */

import React from 'react'
import { Input } from 'antd'
import DetailPageDock from '../../../../components/Dock/DetailPageDock'
import './style/SubscriptionDetailDock.less'

export default class SubscriptionDetailDock extends React.Component {
  render() {
    return (
      <DetailPageDock
        dockStyle={{
          background: '#fff',
          cursor: 'initial',
        }}
        {...this.props}
      >
        <div className="sub-detail">
          <div className="sub-detail-header">
          订阅详情
          </div>
          <div className="sub-detail-body">
            <div>
              <div className="second-title">
              订阅详细信息
              </div>
              <div className="sub-detail-body-line">
                <div>
                  <span className="sub-label">订阅状态：</span>
                  <span className="success-status">已通过</span>
                </div>
                <div>
                  <span className="sub-label">消费凭证：</span>
                  <span className="desc-text">凭证</span>
                </div>
                <div>
                  <span className="sub-label">订阅时间：</span>
                  2017-01-19 14:22:33
                </div>
                <div>
                  <span className="sub-label">QPS：</span>
                  20000
                </div>
                <div className="bind-ip">
                  <span className="sub-label">绑定 IP：</span>
                  <Input.TextArea />
                </div>
              </div>
            </div>
            <div>
              <div className="second-title">
              服务详细信息
              </div>
              <div className="sub-detail-body-line">
                <div>
                  <span className="sub-label">服务名称：</span>
                  hello
                </div>
                <div>
                  <span className="sub-label">所属服务组：</span>
                  hello-group
                </div>
                <div>
                  <span className="sub-label">服务描述：</span>
                  hahaha~
                </div>
              </div>
            </div>
          </div>
        </div>
      </DetailPageDock>
    )
  }
}
