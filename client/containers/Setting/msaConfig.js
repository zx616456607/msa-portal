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
import { Row, Input, Button, Select } from 'antd'
export default class MsaConfig extends React.Component {
  render() {
    return (
      <Row className="layout-content-btns">
        <div className="title" style={{ marginRight: 0 }}>
          <span>微服务配置</span>
        </div>
        <div className="conten">
          <ul>
            <li>
              <span className="server">云服务中心 API Server</span>
              <Input className="server-ipt" placeholder="请输入云服务中心平台 API-Server 地址" />
              <Button className="close">取消</Button>
              <Button className="save" type="primary">保存</Button>
            </li>
            <li>
              <span className="exit">配置服务出口</span>
              <Input className="exit-ipt" placeholder="请输入服务的出口地址" />
              <Button className="edit" type="primary">编辑</Button>
            </li>
            <li>
              <span className="server-gitlab">Config Server Gitlab 地址</span>
              <Select className="gitlab-address"></Select>
            </li>
            <li>
              <Input className="gitlab" placeholder="请输入 Gitlab 地址（如 https://git.demo.com）" />
              <Button className="close">取消</Button>
              <Button className="save" type="primary">保存</Button>
            </li>
          </ul>
        </div>
      </Row>
    )
  }
}
