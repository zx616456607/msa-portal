/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service control detail
 *
 * 2017-12-22
 * @author zhangpc
 */

import React from 'react'
import {
  Row, Col,
} from 'antd'

const SECONDS_CONVERSION = {
  1: '秒',
  60: '分钟',
  [60 * 60]: '小时',
  [60 * 60 * 24]: '天',
}

export default class Control extends React.Component {
  render() {
    const { detail } = this.props
    const limitationDetail = JSON.parse(detail.limitationDetail) || {}
    const { limit, duration } = limitationDetail
    const limitationUnit = SECONDS_CONVERSION[parseInt(duration && duration.match(/[0-9]+/))] || '秒'
    return (
      <div className="service-control">
        <div className="service-control-body row-table">
          <Row>
            <Col span={4}>每{limitationUnit}最大调用量</Col>
            <Col span={20}>
              <div className="txt-of-ellipsis">
                { limit ? limit : '无限制' }
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={4}>允许不授权访问</Col>
            <Col span={20}>
              <div className="txt-of-ellipsis">
                { detail.accessible ? '允许' : '不允许' }
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
