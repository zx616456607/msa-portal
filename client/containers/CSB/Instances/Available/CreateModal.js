/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Available instances modal
 *
 * 2017-12-04
 * @author zhangxuan
 */

import React from 'react'
import { Modal, Form, Input, Radio } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class InstanceModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visible: oldVisible } = this.props
    const { visible: newVisible } = nextProps
    if (oldVisible !== newVisible) {
      this.setState({
        visible: newVisible,
      })
    }
  }

  confirmModal = () => {
    const { closeCreateModal } = this.props
    closeCreateModal()
  }

  cancelModal = () => {
    const { closeCreateModal } = this.props
    closeCreateModal()
  }
  render() {
    const { form, currentInstance } = this.props
    const { visible } = this.state
    const { getFieldDecorator, getFieldError, isFieldTouched } = form
    const userNameError = isFieldTouched('userName') && getFieldError('userName')
    const passwordError = isFieldTouched('password') && getFieldError('password')

    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    }
    return (
      <Modal
        title={currentInstance ? '修改 CSB 实例' : '创建 CSB 实例'}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={this.cancelModal}
      >
        <Form>
          <FormItem
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
            label="实例名称"
            {...formItemLayout}
          >
            {getFieldDecorator('userName')(
              <Input placeholder="请输入实例名称" />
            )}
          </FormItem>
          <FormItem
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
            label="实例描述"
            {...formItemLayout}
          >
            {getFieldDecorator('description')(
              <Input type="textarea" placeholder="请输入至少五个字符" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="谁可以使用"
          >
            {getFieldDecorator('radio-group')(
              <RadioGroup>
                <Radio value="a">私有（仅自己）</Radio>
                <Radio value="b">公开（全部用户可申请使用）</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(InstanceModal)
