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
  Modal, Form, Input,
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
      const { name, ownerName, ownerEmail, ownerPhone, description } = initailValue
      setTimeout(() => {
        form.setFieldsValue({ name, ownerName, ownerEmail, ownerPhone, description })
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
      title={`${handle === 'create' ? '创建' : '编辑'}服务组`}
      wrapClassName="reset-modal-incloud-form"
      visible={true}
      closable={true}
      onCancel={this.handleCancel}
      onOk={this.handleOk}
      maskClosable={false}
      confirmLoading={loading}
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
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('服务组名称不能为空')
                  }
                  if (!/^[a-zA-Z][a-zA-Z0-9\-]{2,62}$/.test(value)) {
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
          key="ownerName"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerName', {
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
          key="ownerEmail"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerEmail', {
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
          key="ownerPhone"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerPhone', {
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
          key="description"
          {...formItemLayout}
        >
          {
            getFieldDecorator('description')(
              <TextArea placeholder="请输入服务组描述"/>
            )
          }
        </FormItem>
      </Form>
    </Modal>
  }
}

export default Form.create()(CreateServiceGroup)
