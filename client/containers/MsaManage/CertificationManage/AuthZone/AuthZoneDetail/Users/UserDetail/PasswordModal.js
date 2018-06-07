/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Zone user password modal
 *
 * @author zhangxuan
 * @date 2018-06-07
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Modal, Input, notification } from 'antd'
import { updateZoneUserPassword } from '../../../../../../../actions/certification'

const FormItem = Form.Item

class PasswordModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  state = {}

  handleConfirm = async () => {
    const { updateZoneUserPassword, detail, form, closeModal } = this.props
    form.validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        loading: true,
      })
      const result = await updateZoneUserPassword(detail, values)
      if (result.error) {
        notification.warn({
          message: '修改密码失败',
        })
        this.setState({
          loading: false,
        })
        return
      }
      this.setState({
        loading: false,
      })
      notification.success({
        message: '修改密码成功',
      })
      closeModal()
    })
  }

  render() {
    const { loading } = this.state
    const { visible, closeModal, form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }

    return (
      <Modal
        title={'修改用户密码'}
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleConfirm}
        confirmLoading={loading}
      >
        <Form hideRequiredMark={true}>
          <FormItem
            label={'旧密码'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('oldPassword', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入旧密码',
                }],
              })(
                <Input type={'password'} placeholder="请输入旧密码"/>
              )
            }
          </FormItem>
          <FormItem
            label={'新密码'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入新密码',
                }],
              })(
                <Input type={'password'} placeholder="请输入新密码"/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {
  updateZoneUserPassword,
})(Form.create()(PasswordModal))
