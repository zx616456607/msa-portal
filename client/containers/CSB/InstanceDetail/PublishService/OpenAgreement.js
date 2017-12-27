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
  Form, Input, Select, Radio, Switch,
} from 'antd'
import ClassNames from 'classnames'
import './style/OpenAgreement.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export default class OpenAgreement extends React.Component {
  render() {
    const { formItemLayout, form, className, serviceGroups } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const name = getFieldValue('name')
    const version = getFieldValue('version')
    const ssl = getFieldValue('ssl')
    let openUrlBefore = `${ssl ? 'https' : 'http'}://csbname:9081/`
    if (name) {
      openUrlBefore += `${name}/`
    } else {
      openUrlBefore += '<服务名称>/'
    }
    if (version) {
      openUrlBefore += `${version}/`
    } else {
      openUrlBefore += '<服务版本>/'
    }
    const serviceProtocol = getFieldValue('serviceProtocol') || []
    const classNames = ClassNames({
      'open-agreement': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <div className="second-title">服务开放协议配置</div>
        <FormItem
          {...formItemLayout}
          label="服务名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Please input name!',
            }],
          })(
            <Input placeholder="可由1-63个中文字符、英文字母、数字或中划线“-”组成" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务版本"
        >
          {getFieldDecorator('version', {
            rules: [{
              required: true, message: 'Please input version!',
            }],
          })(
            <Input placeholder="自定义版本" />
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
              placeholder="请自定义 URL 地址"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属服务组"
          key="serviceGroup"
        >
          {getFieldDecorator('groupId', {
            rules: [{
              required: true, message: 'Please select serviceGroup!',
            }],
          })(
            <Select placeholder="请选择">
              {
                serviceGroups.map(group => <Option key={group.id}>{group.name}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务描述"
        >
          {getFieldDecorator('description')(
            <Input.TextArea placeholder="请输入描述，支持1-128个汉字或字符" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="选择服务开放接口"
          className="service-protocols"
        >
          {getFieldDecorator('serviceProtocol', {
            initialValue: 'Restful-API',
            rules: [{
              required: true,
              message: 'Please select protocols!',
            }],
          })(
            <RadioGroup>
              <Radio value="Restful-API">Restful-API</Radio>
              <Radio value="WebService" disabled>WebService</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="SSL 加密"
          className="service-ssl"
        >
          {getFieldDecorator('ssl', {
            valuePropName: 'checked',
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">开启后将提高 API 访问的安全性</span>
        </FormItem>
        {
          serviceProtocol === 'Restful-API' &&
          <FormItem
            {...formItemLayout}
            label="Restful Path"
          >
            {getFieldDecorator('restfulPath')(
              <Input placeholder="请提供 Restful Path" />
            )}
          </FormItem>
        }
      </div>
    )
  }
}
