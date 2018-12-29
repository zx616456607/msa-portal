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
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item
@withNamespaces('authZoneDetail')
class PasswordModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  state = {}

  handleConfirm = async () => {
    const { updateZoneUserPassword, detail, form, closeModal, t } = this.props
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
          message: t('tabUser.updatePwdFailed'),
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
        message: t('tabUser.updatePwdSuccess'),
      })
      closeModal()
    })
  }

  render() {
    const { loading } = this.state
    const { visible, closeModal, form, t } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }

    return (
      <Modal
        title={t('tabUser.updatePwdTitle')}
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleConfirm}
        confirmLoading={loading}
      >
        <Form hideRequiredMark={true}>
          <FormItem
            label={t('tabUser.oldPwd')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('oldPassword', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: t('tabUser.pleaseInputOldPwd'),
                }],
              })(
                <Input type={'password'} placeholder={t('tabUser.pleaseInputOldPwd')}/>
              )
            }
          </FormItem>
          <FormItem
            label={t('tabUser.newPwd')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: t('tabUser.newPwd'),
                }],
              })(
                <Input type={'password'} placeholder={t('tabUser.pleaseInputNewPwd')}/>
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
