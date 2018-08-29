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

const FormItem = Form.Item

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
      createZoneUser, patchZoneUser,
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
            message: '创建用户失败',
          })
          return
        }
        this.setState({
          loading: false,
        })
        notification.success({
          message: '创建用户成功',
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
          message: '修改用户失败',
        })
        return
      }
      this.setState({
        loading: false,
      })
      notification.success({
        message: '修改用户成功',
      })
      loadData && loadData()
      closeModal()
      form.resetFields()
    })
  }

  confirmPasswordCheck = (rules, value, callback) => {
    const { getFieldValue } = this.props.form
    if (!value) {
      return callback('请输入确认密码')
    }
    const password = getFieldValue('password')
    if (value !== password) {
      return callback('两次密码不一致')
    }
    callback()
  }

  render() {
    const { loading } = this.state
    const { form, visible, closeModal, currentUser } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        visible={visible}
        title={isEmpty(currentUser) ? '添加用户' : '修改用户'}
        onCancel={closeModal}
        onOk={this.handleConfirm}
        confirmLoading={loading}
      >
        <Form
          hideRequiredMark={true}
        >
          <FormItem
            label={'用户名'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请填写用户名称',
                  },
                ],
                initialValue: !isEmpty(currentUser) ? currentUser.userName : '',
              })(
                <Input placeholder="用户名称"/>
              )
            }
          </FormItem>
          {
            isEmpty(currentUser) &&
            <React.Fragment>
              <FormItem
                label={'密码'}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写密码',
                      },
                    ],
                    initialValue: !isEmpty(currentUser) ? currentUser.password : '',
                  })(
                    <Input type={'password'} placeholder="请输入密码"/>
                  )
                }
              </FormItem>
              <FormItem
                label={'确认密码'}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('confirmPassword', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写确认密码',
                      },
                      {
                        validator: this.confirmPasswordCheck,
                      },
                    ],
                    initialValue: !isEmpty(currentUser) ? currentUser.password : '',
                  })(
                    <Input type={'password'} placeholder="请再次输入密码"/>
                  )
                }
              </FormItem>
            </React.Fragment>
          }
          <FormItem
            label={'邮箱'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: EMAIL_REG,
                    message: '请填写正确的邮箱地址',
                  },
                ],
                initialValue: !isEmpty(currentUser) ? currentUser.emails[0].value : '',
              })(
                <Input placeholder="用户邮箱，需要验证"/>
              )
            }
          </FormItem>
          <FormItem
            label={'手机'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('phone', {
                rules: [
                  {
                    whitespace: true,
                    pattern: PHONE_REG,
                    message: '请填写正确的手机号',
                  },
                ],
                initialValue:
                  !isEmpty(currentUser) && !isEmpty(currentUser.phoneNumbers)
                    ? currentUser.phoneNumbers[0].value : '',
              })(
                <Input placeholder="用户手机"/>
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
