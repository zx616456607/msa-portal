/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: service control
 *
 * 2017-12-05
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import {
  Form, Input, Select, Switch, Icon, Tooltip, Row, Col,
} from 'antd'
import { API_GATEWAY_LIMIT_TYPES } from '../../../../constants'
import './style/ServiceControl.less'

const FormItem = Form.Item
const Option = Select.Option

export default class ServiceControl extends React.Component {
  render() {
    const { className, formItemLayout, form } = this.props
    const { getFieldDecorator } = form
    const classNames = ClassNames({
      'service-control': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <FormItem
          {...formItemLayout}
          label="API 流量限制"
          className="api-gateway-limit"
        >
          <Row gutter={16}>
            <Col span={6}>
              每
              {getFieldDecorator('apiGatewayLimitType', {
                initialValue: API_GATEWAY_LIMIT_TYPES[0].key,
              })(
                <Select>
                  {
                    API_GATEWAY_LIMIT_TYPES.map(type =>
                      <Option key={type.key}>{type.text}</Option>
                    )
                  }
                </Select>
              )}
            </Col>
            <Col span={12}>
              最大调用
              {getFieldDecorator('apiGatewayLimit', {
                initialValue: 0,
              })(
                <Input placeholder="请填写整数" />
              )}
              次 <Tooltip title="设置为0或者为空时代表不限制访问频度">
                <Icon type="question-circle-o" />
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="公开访问"
        >
          {getFieldDecorator('accessible', {
            valuePropName: 'checked',
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">此 API 无需授权即可访问</span>
        </FormItem>
        {/* <FormItem
          {...formItemLayout}
          label="可见域限制"
        >
          {getFieldDecorator('visibleDomain', {
            valuePropName: 'checked',
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">开启后，可设置谁可以看到并订阅消费该API</span>
        </FormItem> */}
      </div>
    )
  }
}
