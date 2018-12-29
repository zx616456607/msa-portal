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
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item
const TextArea = Input.TextArea

@withNamespaces('identityManage')
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
      closeModal, loadDate, currentAuthZone, t,
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
              message: t('addIdentityZones.identityZonesRepeat'),
            })
            this.setState({
              loading: false,
            })
            return
          }
          notification.warn({
            message: t('addIdentityZones.changeZoneFailed'),
          })
          this.setState({
            loading: false,
          })
          return
        }
        notification.success({
          message: t('addIdentityZones.changeZoneSuccess'),
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
            message: t('addIdentityZones.identityZonesRepeat'),
          })
          this.setState({
            loading: false,
          })
          return
        }
        notification.warn({
          message: t('addIdentityZones.createZoneFailed'),
        })
        this.setState({
          loading: false,
        })
        return
      }
      notification.success({
        message: t('addIdentityZones.createZoneSuccess'),
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
  checkName = (rule, value, callback) => {
    const { t } = this.props
    const reg = /[%_]/
    if (!(value.length >= 1 && value.length <= 255)) {
      return callback(t('addIdentityZones.input255Char'))
    }
    if (reg.test(value)) {
      return callback(t('addIdentityZones.notInpChar'))
    }
    return callback()
  }
  render() {
    const { loading } = this.state
    const { visible, currentAuthZone, form, t } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    }

    return (
      <Modal
        visible={visible}
        title={isEmpty(currentAuthZone) ? t('addIdentityZones.addIdentityZones') : t('addIdentityZones.editorIdentityZones')}
        onOk={this.handleConfirm}
        onCancel={this.handleClose}
        confirmLoading={loading}
      >
        <Form>
          <FormItem
            label={t('addIdentityZones.identityZonesName')}// {'认证域名称'}
            {...formItemLayout}
          >
            {
              getFieldDecorator('name', {
                initialValue: !isEmpty(currentAuthZone) ? currentAuthZone.name : '',
                rules: [
                  { required: true,
                    // max: 255, message: '请输入1~255个字符',
                    validator: this.checkName,
                  },
                ],
              })(
                <Input placeholder={t('addIdentityZones.inputZonesName')}/>
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
                  { required: true, max: 255, message: t('addIdentityZones.input255Char') },
                ],
              })(
                <Input placeholder={t('addIdentityZones.inputSubDomainName')}/>
              )
            }
          </FormItem>
          <FormItem
            label={t('addIdentityZones.desc')}
            {...formItemLayout}
          >
            {
              getFieldDecorator('description', {
                initialValue: !isEmpty(currentAuthZone) ? currentAuthZone.description : '',
                rules: [
                  { required: false, max: 255, message: t('addIdentityZones.input255Char') },
                ],
              })(
                <TextArea placeholder={t('addIdentityZones.inputDesc')}/>
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
