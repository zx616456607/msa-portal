/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: Security head customization
 *
 * 2017-12-06
 * @author zhangpc
 */

import React from 'react'
import {
  Form, Input, Radio, Switch, Modal,
} from 'antd'
import './style/SecurityHeaderModal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group

export default class SecurityHeaderModal extends React.Component {
  render() {
    const { form, formItemLayout, ...otherProps } = this.props
    const { getFieldDecorator, getFieldValue } = form
    return (
      <Modal
        width={600}
        {...otherProps}
        title="设置 Header"
        wrapClassName="security-header-modal"
      >
        <FormItem
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: 'Please input username!',
            }],
          })(
            <Input placeholder="请输入用户名" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input password!',
            }],
          })(
            <Input type="password" placeholder="请输入用密码" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Header 类型"
        >
          {getFieldDecorator('securityHeaderType', {
            initialValue: 'normal',
          })(
            <RadioGroup>
              <Radio value="normal">标准 Header</Radio>
              <Radio value="WSS">WSS Header</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          getFieldValue('securityHeaderType') === 'WSS' &&
          [
            <FormItem
              {...formItemLayout}
              label="PasswordType"
              key="passwordType"
            >
              {getFieldDecorator('passwordType', {
                initialValue: 'PasswordText',
              })(
                <RadioGroup>
                  <Radio value="PasswordText">PasswordText</Radio>
                  <Radio value="PasswordDigest">PasswordDigest</Radio>
                </RadioGroup>
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="可选单元"
              key="optionalUnit"
              className="optional-unit"
            >
              {getFieldDecorator('optionalUnit')(
                <Switch checkedChildren="开" unCheckedChildren="关" />
              )}
              <span className="desc-text">Nonce&Created</span>
            </FormItem>,
          ]
        }
        <FormItem
          {...formItemLayout}
          label="模版内容"
        >
          {getFieldDecorator('template', {
            rules: [{
              required: true, message: 'Please input template!',
            }],
          })(
            <Input.TextArea />
          )}
        </FormItem>
      </Modal>
    )
  }
}
