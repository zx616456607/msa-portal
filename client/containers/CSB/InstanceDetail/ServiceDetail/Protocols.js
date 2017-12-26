/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service protocols detail
 *
 * 2017-12-22
 * @author zhangpc
 */

import React from 'react'
import {
  Row, Col, Tag,
} from 'antd'

export default class Protocols extends React.Component {
  render() {
    const { detail } = this.props
    console.log(detail)
    return (
      <div className="service-protocols">
        <div className="service-protocols-body row-table">
          <Row>
            <Col span={4}>接入接口协议</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                {detail.type}
              </div>
            </Col>
            <Col span={4}>开放接口协议</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                {
                  detail.type === 'rest' ? <Tag color="blue">Restful-API</Tag> :
                    <Tag color="blue">WebService</Tag>
                }
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={4}>端点</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                {detail.targetDetail}
              </div>
            </Col>
            <Col span={4}>开放地址</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                --
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={4}>请求格式</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                --
              </div>
            </Col>
            <Col span={4}>方法</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                --
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={4}>消息格式转换</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                --
              </div>
            </Col>
            <Col span={4}>响应格式</Col>
            <Col span={8}>
              <div className="txt-of-ellipsis">
                --
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
