/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Create Service Group Modal
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal, Form, Input, Button,
} from 'antd'

const { TextArea } = Input

const FormItem = Form.Item

class CreateServiceGroup extends React.Component {
  static propTypes = {
    // 关闭 Modal 的函数
    closeModalMethod: PropTypes.func.isRequired,
    // 点击确定按钮，获取 Modal 输入的值，供父组件调用
    callback: PropTypes.func.isRequired,
    // 当前进行的操作 create || edit
    handle: PropTypes.string.isRequired,
    // 确定按钮的 loading 态
    loading: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { handle } = this.props
    if (handle === 'edit') {
      const { form, initailValue } = this.props
      setTimeout(() => {
        form.setFieldsValue({
          tel: initailValue.tel,
        })
      }, 200)
    }
  }

  handleOk = () => {
    const { form, callback } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      callback(values)
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  render() {
    const { form, loading, handle } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    }
    return <Modal
      title="创建服务组"
      visible={true}
      closable={true}
      onCancel={this.handleCancel}
      maskClosable={false}
      wrapClassName="reset-modal-incloud-form"
      footer={[
        <Button key="cancel" size="large" onClick={this.handleCancel}>取消</Button>,
        <Button key="submit" size="large" type="primary" onClick={this.handleOk} loading={loading}>
          { handle === 'create' ? '创建' : '保存'}
        </Button>,
      ]}
    >
      <Form>
        <FormItem
          label="服务组名称"
          key="mame"
          {...formItemLayout}
        >
          {
            getFieldDecorator('name', {
              rules: [{
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('服务组名称不能为空')
                  }
                  if (!/^[a-zA-Z-]{3,63}$/.test(value)) {
                    return callback('支持1-63位字母、数字或中划线-组成')
                  }
                  return callback()
                },
              }],
            })(
              <Input placeholder="自定义服务组名称"/>
            )
          }
        </FormItem>
        <FormItem
          label="服务组负责人"
          key="charge"
          {...formItemLayout}
        >
          {
            getFieldDecorator('charge', {
              rules: [{
                required: true,
                message: '服务组负责人姓名不能为空',
              }],
            })(
              <Input placeholder="服务负责人姓名"/>
            )
          }
        </FormItem>
        <FormItem
          label="负责人邮件"
          key="email"
          {...formItemLayout}
        >
          {
            getFieldDecorator('email', {
              rules: [{
                required: true,
                message: '服务负责人邮件不能为空',
              }],
            })(
              <Input placeholder="服务负责人邮件"/>
            )
          }
        </FormItem>
        <FormItem
          label="负责人电话"
          key="tel"
          {...formItemLayout}
        >
          {
            getFieldDecorator('tel', {
              rules: [{
                required: true,
                message: '服务负责人电话不能为空',
              }],
            })(
              <Input placeholder="服务负责人电话"/>
            )
          }
        </FormItem>
        <FormItem
          label="服务组描述（可选）"
          key="desc"
          {...formItemLayout}
        >
          {
            getFieldDecorator('desc')(
              <TextArea placeholder="请输入服务组描述"/>
            )
          }
        </FormItem>
      </Form>
    </Modal>
  }
}

export default Form.create()(CreateServiceGroup)
