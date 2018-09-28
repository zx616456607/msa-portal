/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Auth zone modal
 *
 * @author zhangxuan
 * @date 2018-06-04
 */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Form, Input, notification } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { createIdentityZones, updateIdentityZone } from '../../../../actions/certification'

const FormItem = Form.Item
const TextArea = Input.TextArea

class AuthZoneModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    currentAuthZone: PropTypes.object,
    closeModal: PropTypes.func.isRequired,
    loadDate: PropTypes.func,
  }

  state = {}

  handleConfirm = async () => {
    const {
      form, createIdentityZones, updateIdentityZone,
      closeModal, loadDate, currentAuthZone,
    } = this.props
    form.validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        loading: true,
      })
      if (!isEmpty(currentAuthZone)) {
        const mergeBody = Object.assign({}, values, { id: currentAuthZone.id })
        const updateRes = await updateIdentityZone(mergeBody, { isHandleError: true })
        if (updateRes.error) {
          if (updateRes.status === 409) {
            notification.warn({
              message: '认证域名称重复',
            })
            this.setState({
              loading: false,
            })
            return
          }
          notification.warn({
            message: '修改认证域失败',
          })
          this.setState({
            loading: false,
          })
          return
        }
        notification.success({
          message: '修改认证域成功',
        })
        this.setState({
          loading: false,
        })
        closeModal()
        loadDate && loadDate()
        return
      }
      const createRes = await createIdentityZones(values, { isHandleError: true })
      if (createRes.error) {
        if (createRes.status === 409) {
          notification.warn({
            message: '认证域名称重复',
          })
          this.setState({
            loading: false,
          })
          return
        }
        notification.warn({
          message: '创建认证域失败',
        })
        this.setState({
          loading: false,
        })
        return
      }
      notification.success({
        message: '创建认证域成功',
      })
      this.setState({
        loading: false,
      })
      closeModal()
      loadDate && loadDate()
    })
  }

  handleClose = () => {
    const { closeModal } = this.props
    closeModal && closeModal()
  }

  render() {
    const { loading } = this.state
    const { visible, currentAuthZone, form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    }

    return (
      <Modal
        visible={visible}
        title={`${isEmpty(currentAuthZone) ? '添加' : '编辑'}认证域`}
        onOk={this.handleConfirm}
        onCancel={this.handleClose}
        confirmLoading={loading}
      >
        <Form>
          <FormItem
            label={'认证域名称'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('name', {
                initialValue: !isEmpty(currentAuthZone) ? currentAuthZone.name : '',
                rules: [
                  { required: true, max: 255, message: '请输入1~255个字符' },
                ],
              })(
                <Input placeholder={'请输入认证域名称'}/>
              )
            }
          </FormItem>
          <FormItem
            label={'SubDomain'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('subdomain', {
                initialValue: !isEmpty(currentAuthZone) ? currentAuthZone.subdomain : '',
                rules: [
                  { required: true, max: 255, message: '请输入1~255个字符' },
                ],
              })(
                <Input placeholder={'请输入 SubDomain 名称'}/>
              )
            }
          </FormItem>
          <FormItem
            label={'描述'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('description', {
                initialValue: !isEmpty(currentAuthZone) ? currentAuthZone.description : '',
                rules: [
                  { required: false, max: 255, message: '请输入1~255个字符' },
                ],
              })(
                <TextArea placeholder={'请输入描述'}/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {
  createIdentityZones,
  updateIdentityZone,
})(Form.create()(AuthZoneModal))
