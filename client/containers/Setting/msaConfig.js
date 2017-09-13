/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * msaConfig
 *
 * 2017-09-13
 * @author zhaoyb
 */

import React from 'react'
import './style/msaConfig.less'
import { Row, Col, Input, Button, Select } from 'antd'
export default class MsaConfig extends React.Component {
  render() {
    return (
      <div className="layout-content-btns">
        <div className="title" style={{ marginRight: 0 }}>
          <span>微服务配置</span>
        </div>
        <div className="conten">
          <div>
            <Row className="apiServer">
              <Col span={6}>云服务中心 API Server</Col>
              <Col span={18}>
                <Input style={{ width: 300 }} placeholder="请输入云服务中心平台 API-Server 地址" />
                <Button className="close">取消</Button>
                <Button className="save" type="primary">保存</Button>
              </Col>
            </Row>
            <Row className="apiServer">
              <Col span={6}>配置服务出口</Col>
              <Col span={18}>
                <Input style={{ width: 300 }} className="exit-ipt" placeholder="请输入服务的出口地址" />
                <Button className="edit" type="primary">编辑</Button>
              </Col>
            </Row>
            <Row className="apiServer">
              <Col span={6}>Config Server Gitlab 地址</Col>
              <Col span={18}>
                <Select style={{ width: 300 }} className="gitlab-address"></Select>
              </Col>
            </Row>
            <Row className="apiServer">
              <Col span={6}>
              </Col>
              <Col span={18}>
                <Input style={{ width: 300 }} className="gitlab" placeholder="请输入 Gitlab 地址（如 https://git.demo.com）" />
                <Button className="close">取消</Button>
                <Button className="save" type="primary">保存</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
