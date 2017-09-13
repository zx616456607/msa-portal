/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * AddClientModal container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { Modal, Form, Input, Checkbox, Select } from 'antd'
import './style/AddClientModal.less'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const authModeOpts = [ 'authorization_code', 'refresh_token', 'password', 'client_credentials' ]
const authScopes = [ 'read', 'write', 'trust' ]

export default class AddClientModal extends React.Component {
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        title="添加认证客户端"
        okText="确认注册"
        width={720}
        className="add-client-modal"
        {...this.props}
      >
        <FormItem {...formItemLayout} label="客户端 ID">
          <Input placeholder="请填写客户端 ID" />
        </FormItem>
        <FormItem {...formItemLayout} label="客户端 Secret">
          <Input placeholder="请填写客户端 Secret"/>
        </FormItem>
        <FormItem {...formItemLayout} label="AccessToken 有效时间">
          <Input placeholder="请填写 AccessToken 有效时间" addonAfter="秒" />
        </FormItem>
        <FormItem {...formItemLayout} label="RefreshToken 有效时间">
          <Input placeholder="请填写 RefreshToken 有效时间" addonAfter="秒" />
        </FormItem>
        <FormItem {...formItemLayout} label="授权方式">
          <CheckboxGroup
            options={authModeOpts}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="授权范围">
          <Select style={{ width: '100%' }} placeholder="请选择授权范围">
            {
              authScopes.map(scope => <Option key={scope}>{scope}</Option>)
            }
          </Select>
        </FormItem>
        {/* <FormItem className="auto-auth" {...formItemLayout} label=" ">
          <Checkbox>全范围自动授权</Checkbox>
        </FormItem> */}
        <FormItem {...formItemLayout} label="可用资源 ID">
          <Select style={{ width: '100%' }} placeholder="请选择可用资源 ID">
            <Option key="test">test</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="注册跳转 URL">
          <Input.TextArea placeholder="一行输入一个地址" />
        </FormItem>
      </Modal>
    )
  }
}
