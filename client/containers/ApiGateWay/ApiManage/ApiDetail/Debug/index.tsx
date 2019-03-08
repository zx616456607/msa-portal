/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * component Debug
 *
 * @author ZhouHaitao
 * @date 2019-03-08 10:42
 */

import * as React from 'react'
import { Button, Row, Col, Input, Select, Form } from 'antd'

import './style/debug.less'

const { Option } = Select
const FormItem = Form.Item
const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
}
const reqParamId = 0

interface DebugProps {

}

class Debug extends React.Component<DebugProps> {
  render() {
    return <div className="api-debug">
      <Row>
        <Col span={12}>
          <h1>调试 API</h1>
          <Row className="url-config" gutter={16}>
            <Col span={4}>
              <Select style={{ width: '100%' }} defaultValue="GET">
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </Col>
            <Col span={12}>
              <Input/>
            </Col>
            <Col span={8}>
              <Button type="primary">发送</Button>
            </Col>
          </Row>
          <h1>认证</h1>
          <div className="auth">
            <FormItem
              label="认证方式"
              {...formLayout}
            >
              Basic_Auth
            </FormItem>
            <FormItem
              label="用户名"
              {...formLayout}
            >
              <Input placeholder="填写用户名"/>
            </FormItem>
            <FormItem
              label="密码"
              {...formLayout}
            >
              <Input.Password placeholder="请输入密码"/>
            </FormItem>
          </div>
          <h1>请求头参数 Headers</h1>
        </Col>
        <Col span={12}/>

      </Row>
    </div>
  }
}

export default Form.create()(Debug)
