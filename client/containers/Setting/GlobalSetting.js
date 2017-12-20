/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * GlobalSetting
 *
 * 2017-11-14
 * @author zhangcz
 */

import React, { Component } from 'react'
import QueueAnim from 'rc-queue-anim'
import './style/GlobalSetting.less'
import {
  Card, Form, Input,
  Row, Col,
} from 'antd'
import APIAddress from '../../assets/img/system-settings/API-address.png'
import { API_CONFIG } from '../../constants/index.js'

const FormItem = Form.Item
const { PAAS_API_PROTOCOL, PAAS_API_HOST, MSA_API } = API_CONFIG

class GlobalSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    return <QueueAnim>
      <div key="GlobalSetting">
        <Card
          id="GlobalSetting"
          title="全局配置"
        >
          <div className="API_address">
            <div className="second-title">开放 API 地址</div>
            <Row>
              <Col span="4" className="img_col">
                <img src={APIAddress} alt=""/>
              </Col>
              <Col span="20" className="form_col">
                <Form>
                  <FormItem
                    {...formItemLayout}
                    label="微服务引擎  API"
                    key="container"
                  >
                    {getFieldDecorator('container', {
                      initialValue: `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}`,
                      rules: [{
                        // required: true,
                        message: '请配置微服务底层 API 地址（即 API Server）',
                      }],
                    })(
                      <Input placeholder="请填写容器引擎API" disabled/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="SpringCloud API"
                    key="integration"
                  >
                    {getFieldDecorator('integration', {
                      initialValue: `${MSA_API}`,
                      rules: [{
                        // required: true,
                        message: 'SpringCloud API 地址',
                      }],
                    })(
                      <Input placeholder="请填写集成部署API" disabled/>
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </QueueAnim>
  }
}

export default Form.create()(GlobalSetting)
