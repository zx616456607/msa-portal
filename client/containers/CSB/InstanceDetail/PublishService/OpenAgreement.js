/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: access agreement
 *
 * 2017-12-04
 * @author zhangpc
 */

import React from 'react'
import {
  Form, Input, Select,
} from 'antd'
import './style/OpenAgreement.less'

const FormItem = Form.Item
// const Option = Select.Option

export default class OpenAgreement extends React.Component {
  render() {
    const { formItemLayout, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const serviceName = getFieldValue('serviceName')
    const serviceVersion = getFieldValue('serviceVersion')
    let openUrlBefore = 'http://csbname:9081/'
    if (serviceName) {
      openUrlBefore += `${serviceName}/`
    } else {
      openUrlBefore += '<服务名称>/'
    }
    if (serviceVersion) {
      openUrlBefore += `${serviceVersion}/`
    } else {
      openUrlBefore += '<服务版本>/'
    }
    return (
      <div className="open-agreement">
        <div className="second-title">服务开放协议配置</div>
        <FormItem
          {...formItemLayout}
          label="服务名称"
        >
          {getFieldDecorator('serviceName', {
            rules: [{
              required: true, message: 'Please input serviceName!',
            }],
          })(
            <Input placeholder="可由1-63个中文字符、英文字母、数字或中划线“-”组成" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务版本"
        >
          {getFieldDecorator('serviceVersion', {
            rules: [{
              required: true, message: 'Please input serviceVersion!',
            }],
          })(
            <Input size="default" placeholder="自定义版本" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开放地址"
        >
          {getFieldDecorator('openUrl', {
            rules: [{
              required: true, message: 'Please input openUrl!',
            }],
          })(
            <Input
              addonBefore={openUrlBefore}
              size="default"
              placeholder="请自定义 URL 地址"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属服务组"
          key="requestType"
        >
          {getFieldDecorator('requestType')(
            <Select size="default" placeholder="请选择">
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务描述"
          key="responseType"
        >
          {getFieldDecorator('responseType')(
            <Input.TextArea size="default" placeholder="请输入描述，支持1-128个汉字或字符" />
          )}
        </FormItem>
      </div>
    )
  }
}
