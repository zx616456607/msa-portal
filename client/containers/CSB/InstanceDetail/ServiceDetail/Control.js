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

export default class Control extends React.Component {
  render() {
    return (
      <div className="service-control">
        <div className="service-control-body row-table">
          <Row>
            <Col span={4}>每秒最大调用量</Col>
            <Col span={20}>
              <div className="txt-of-ellipsis">
              2000000
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={4}>允许不授权访问</Col>
            <Col span={20}>
              <div className="txt-of-ellipsis">
              允许
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
