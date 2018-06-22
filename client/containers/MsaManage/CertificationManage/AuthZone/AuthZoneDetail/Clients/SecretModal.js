/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 *
 *
 * @author zhangxuan
 * @date 2018-05-17
 */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Form, Input, notification } from 'antd'
import { changeClientSecret } from '../../../../../../actions/certification'

const FormItem = Form.Item

class SecretModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    client_id: PropTypes.string.isRequired,
    loadData: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
  }

  state = {}

  handleConfirm = async () => {
    const { form, changeClientSecret, client_id, loadData, closeModal } = this.props
    const { validateFields } = form
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        loading: true,
      })
      const body = {
        ...values,
        clientId: client_id,
        changeMode: 'UPDATE',
      }

      const result = await changeClientSecret(body)
      if (result.error) {
        this.setState({
          loading: false,
        })
        notification.warn({
          message: '修改密码失败',
        })
        return
      }
      this.setState({
        loading: false,
      })
      form.resetFields()
      notification.success({
        message: '修改密码成功',
      })
      loadData && loadData()
      closeModal()
    })
  }

  render() {
    const { form, visible, closeModal } = this.props
    const { loading } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    }
    return (
      <Modal
        title="修改客户端 Secret"
        onCancel={closeModal}
        onOk={this.handleConfirm}
        visible={visible}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form>
          <FormItem {...formItemLayout} label="旧客户端 Secret">
            {
              getFieldDecorator('oldSecret', {
                initialValue: '',
              })(
                <Input type="password" placeholder="请输入客户端旧密码"/>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="新客户端 Secret">
            {
              getFieldDecorator('secret', {
                rules: [
                  {
                    required: true,
                    message: '新密码不能为空',
                  },
                ],
              })(
                <Input type="password" placeholder="请输入客户端新密码"/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {
  changeClientSecret,
})(Form.create()(SecretModal))
