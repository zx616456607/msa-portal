/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
*/

/**
 *
 * MsaConfigInstallModal
 *
 * @author Songsz
 * @date 2018-12-06
 *
*/

import React from 'react'
import { Form, Modal, Select, Input } from 'antd'

const FormItem = Form.Item
const { Option } = Select

export default class MsaConfigInstallModal extends React.PureComponent {

  render() {
    const { visible, onCancel, onOk, gitLab, form, loading } = this.props
    const { configDetail } = gitLab && Object.keys(gitLab).length > 0 && JSON.parse(gitLab)
    const { gitUrl, gitUser, gitPassword, gitToken } = configDetail || {}
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        title="微服务配置"
        className={'msa_config_install_modal'}
        confirmLoading={loading}
      >
        <FormItem
          label={'基础服务'}
          {...formItemLayout}
        >
          {
            getFieldDecorator('service', {
              initialValue: 'SpringCloud',
            })(
              <Select style={{ width: 300 }}>
                <Option value="SpringCloud">SpringCloud</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label={'Gitlab 项目地址'}
          {...formItemLayout}
        >
          {
            getFieldDecorator('gitUrl', {
              rules: [{
                required: true,
                message: 'Gitlab 地址不能为空',
              }, {
                type: 'url',
                message: '请输入 http 协议地址',
              }],
              initialValue: gitUrl || '',
            })(
              <Input
                style={{ width: 300 }}
                placeholder="Config Server Gitlab 地址（如 https://git.demo.com）"
              />
            )
          }
        </FormItem>
        <FormItem
          label={'用户名'}
          {...formItemLayout}
        >
          {
            getFieldDecorator('gitUser', {
              rules: [{
                required: true,
                message: 'Gitlab 用户名不能为空',
              }],
              initialValue: gitUser || '',
            })(
              <Input
                style={{ width: 300 }}
                placeholder="请输入 Gitlab 用户名"
              />
            )
          }
        </FormItem>
        <FormItem
          label={'密码'}
          {...formItemLayout}
        >
          {
            getFieldDecorator('gitPassword', {
              rules: [{
                required: true,
                message: 'Gitlab 密码不能为空',
              }],
              initialValue: gitPassword || '',
            })(
              <Input
                style={{ width: 300 }}
                type={'password'}
                placeholder="请输入 Gitlab 密码"
              />
            )
          }
        </FormItem>
        <FormItem
          label={'Token'}
          {...formItemLayout}
        >
          {
            getFieldDecorator('gitToken', {
              rules: [{
                required: true,
                message: 'token 不能为空',
              }],
              initialValue: gitToken || '',
            })(
              <Input
                style={{ width: 300 }}
                type={'password'}
                placeholder="Private Token:（位于 Profile Settings → Account）"
              />
            )
          }
        </FormItem>
      </Modal>
    )
  }
}

