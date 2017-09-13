/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetailLogs
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { Row, Col, Icon } from 'antd'
import './style/index.less'

export default class MsaDetailLogs extends React.Component {
  render() {
    return (
      <div className="msaDetailLogs">
        <Row className="msaDetailLogs-header" type="flex" justify="space-between" align="middle">
          <Col span={2} className="msaDetailLogs-header-title">
            结果查询页
          </Col>
          <Col span={1} offset={21}>
            <Icon type="arrows-alt" className="pointer"/>
          </Col>
        </Row>
        <div className="msaDetailLogs-body">
        </div>
      </div>
    )
  }
}
