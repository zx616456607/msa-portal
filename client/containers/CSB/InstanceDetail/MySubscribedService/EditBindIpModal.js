/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Edit Bind IP
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea

class EditBindIp extends React.Component {
  static propTypes = {
    // 关闭 Modal 的方法
    closeModalMethod: propTypes.func.isRequired,
    // 获取当前 Modal 的值，供父组件调用
    callback: propTypes.func.isRequired,
    // Modal.confirmLoading
    loading: propTypes.bool.isRequired,
    // 当前服务
    currentService: propTypes.object.isRequired,
  }

  handleOk = () => {
    const { form, callback } = this.props
    form.validateFields((errors, values) => {
      if (errors) return
      callback(values)
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  render() {
    const { form, loading, currentService } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    return <Modal
      title="修改绑定 IP"
      visible={true}
      closable={true}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      maskClosable={false}
      confirmLoading={loading}
      // wrapClassName=""
    >
      <Form>
        <FormItem
          label="绑定 IP"
          {...formItemLayout}
        >
          {
            getFieldDecorator('bindIps', {
              initialValue: currentService.bindIps ? currentService.bindIps : undefined,
              rules: [{
                validator: (rule, value, callback) => {
                  if (value && !/^(\d{1,3}(\.\d{1,3}){3})*(,\d{1,3}(\.\d{1,3}){3})*$/.test(value)) {
                    return callback('请输入正确的IP地址，多个IP用 "," 隔开')
                  }
                  return callback()
                },
              }],
            })(
              <TextArea placeholder='用于限制访问该服务的 IP 地址，空表示不需要限制 IP 访问；用"，"号隔开；'/>
            )
          }
        </FormItem>
      </Form>
    </Modal>
  }
}

export default Form.create()(EditBindIp)
