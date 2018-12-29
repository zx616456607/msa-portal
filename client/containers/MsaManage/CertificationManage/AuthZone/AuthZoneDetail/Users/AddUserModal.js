/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Zone user modal
 *
 * @author zhangxuan
 * @date 2018-06-06
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Form, Input, notification } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { EMAIL_REG, PHONE_REG } from '../../../../../../constants'
import { createZoneUser, patchZoneUser } from '../../../../../../actions/certification'
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item

@withNamespaces('authZoneDetail')
class AddUserModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
    loadData: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
  }

  state = {}

  handleConfirm = async () => {
    const {
      form, currentUser, loadData, closeModal,
      createZoneUser, patchZoneUser, t,
    } = this.props
    const { validateFields } = form
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        loading: true,
      })
      const { userName, password, email, phone } = values
      const body = {
        userName,
        password,
        emails: [{
          value: email,
          primary: true,
        }],
        phoneNumbers: [{
          value: phone,
        }],
      }
      // 创建用户
      if (isEmpty(currentUser)) {
        const result = await createZoneUser(body)
        if (result.error) {
          this.setState({
            loading: false,
          })
          notification.warn({
            message: t('tabUser.createUserFailed'),
          })
          return
        }
        this.setState({
          loading: false,
        })
        notification.success({
          message: t('tabUser.createUserSuccess'),
        })
        loadData && loadData()
        closeModal()
        form.resetFields()
        return
      }
      // 修改用户
      const res = await patchZoneUser(currentUser, body)
      if (res.error) {
        this.setState({
          loading: false,
        })
        notification.warn({
          message: t('tabUser.updateUserFailed'),
        })
        return
      }
      this.setState({
        loading: false,
      })
      notification.success({
        message: t('tabUser.updateUserSuccess'),
      })
      loadData && loadData()
      closeModal()
      form.resetFields()
    })
  }

  confirmPasswordCheck = (rules, value, callback) => {
    const { getFieldValue } = this.props.form
    const { t } = this.props
    // if (!value) {
    //   callback('请输入确认密码')
    // }
    const password = getFieldValue('password')
    if (value && value !== password) {
      return callback(t('tabUser.pwdError'))
    }
    callback()
  }

  checkUserName = (rules, value, cb) => {
    const { t } = this.props
    if (!value) {
      return cb()// view have message
    }
    const { userList, currentUser } = this.props
    if (value.length < 3 || value.length > 64) {
      return cb(t('tabUser.nameCheckMsg1'))
    }
    const reg = /[%_]/
    if (reg.test(value)) {
      return cb(t('tabUser.nameCheckMsg2'))
    }
    if (isEmpty(currentUser)) {
      let hasUserName = false
      userList.every(item => {
        if (item.userName === value) {
          hasUserName = true
          return false
        }
        return true
      })
      if (hasUserName) {
        return cb(t('tabUser.nameCheckMsg3'))
      }
      return cb()
    }
    cb()
  }

  render() {
    const { loading } = this.state
    const { form, visible, closeModal, currentUser, t } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        visible={visible}
        title={isEmpty(currentUser) ? t('tabUser.addUser') : t('tabUser.updateUser')}
        onCancel={closeModal}
        onOk={this.handleConfirm}
        confirmLoading={loading}
        okText={t('public.confirm')}
        cancelText={t('public.cancel')}
      >
        <Form>
          <FormItem
            label={t('tabUser.userName')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: t('tabUser.nameCheckMsg4'),
                  },
                  {
                    validator: this.checkUserName,
                  },
                ],
                initialValue: !isEmpty(currentUser) ? currentUser.userName : '',
              })(
                <Input placeholder={t('tabUser.userName')}/>
              )
            }
          </FormItem>
          {
            isEmpty(currentUser) &&
            <React.Fragment>
              <FormItem
                label={t('tabUser.pwd')}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: t('tabUser.pwdRequired'),
                      },
                    ],
                    initialValue: !isEmpty(currentUser) ? currentUser.password : '',
                  })(
                    <Input type={'password'} placeholder={t('tabUser.pwdRequired')}/>
                  )
                }
              </FormItem>
              <FormItem
                label={t('tabUser.confirmPwd')}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('confirmPassword', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: t('tabUser.pleaseConfirmPwd'),
                      },
                      {
                        validator: this.confirmPasswordCheck,
                      },
                    ],
                    initialValue: !isEmpty(currentUser) ? currentUser.password : '',
                  })(
                    <Input type={'password'} placeholder={t('tabUser.pleaseConfirmPwdAgain')}/>
                  )
                }
              </FormItem>
            </React.Fragment>
          }
          <FormItem
            label={t('tabUser.email')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: EMAIL_REG,
                    message: t('tabUser.emailCheckMsg1'),
                  },
                ],
                initialValue: !isEmpty(currentUser) ? currentUser.emails[0].value : '',
              })(
                <Input placeholder={t('tabUser.emailCheckMsg2')}/>
              )
            }
          </FormItem>
          <FormItem
            label={t('tabUser.phone')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('phone', {
                rules: [
                  {
                    whitespace: true,
                    pattern: PHONE_REG,
                    message: t('tabUser.phoneCheckMsg1'),
                  },
                ],
                initialValue:
                  !isEmpty(currentUser) && !isEmpty(currentUser.phoneNumbers)
                    ? currentUser.phoneNumbers[0].value : '',
              })(
                <Input placeholder={t('tabUser.phoneCheckMsg2')}/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = () => {
  return {

  }
}

export default connect(mapStateToProps, {
  createZoneUser,
  patchZoneUser,
})(Form.create()(AddUserModal))
