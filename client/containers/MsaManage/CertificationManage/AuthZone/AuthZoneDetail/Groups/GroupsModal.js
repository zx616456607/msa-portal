/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Groups of auth zones
 *
 * @author zhaoyb
 * @date 2018-06-11
 */

import React from 'react'
import { connect } from 'react-redux'
import { Modal, Input, Form, notification } from 'antd'
import { createGroup, updateGroup } from '../../../../../../actions/certification'
import { withNamespaces } from 'react-i18next'
const FormItem = Form.Item

@withNamespaces('authZoneDetail')
class GroupsModal extends React.Component {

  handleOk = () => {
    const { createGroup, updateGroup, form,
      editGroup, editData, closeModal, loadGroup, t } = this.props
    const { validateFields } = form
    validateFields(async (err, value) => {
      if (err) {
        return
      }
      const body = {
        displayName: value.groupName,
        description: value.desc,
      }
      let result
      if (editGroup) {
        const query = {
          id: editData.id,
          match: editData.meta.version,
        }
        result = await updateGroup(query, body, { isHandleError: true })
      } else {
        result = await createGroup(body, { isHandleError: true })
      }
      if (result.error) {
        if (editGroup && result.error.indexOf('already exists') || result.status === 409) {
          notification.warn({
            message: t('groupDetail.groupExist', {
              replace: { name: value.groupName },
            }),
          })
          return
        }
        notification.warn({
          message: editGroup ? t('groupDetail.groupUpdateFailed', {
            replace: { name: value.groupName },
          }) : t('groupDetail.groupAddFailed', {
            replace: { name: value.groupName },
          }),
        })
        return
      }
      notification.success({
        message: editGroup ? t('groupDetail.groupUpdateSuccess', {
          replace: { name: value.groupName },
        }) : t('groupDetail.groupAddSuccess', {
          replace: { name: value.groupName },
        }),
      })
      loadGroup()
      closeModal()
      form.resetFields()
    })
  }
  checkUserName = (rules, value, cb) => {
    const { t } = this.props
    if (!(value.length >= 1 && value.length <= 64)) {
      return cb(t('groupDetail.nameCheckMsg1'))
    }
    const reg = /[%_]/
    if (reg.test(value)) {
      return cb(t('groupDetail.nameCheckMsg2'))
    }
    return cb()

  }
  render() {
    const { form, editGroup, editData, visible, closeModal, t } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        title={`${editGroup ? t('groupDetail.editGroup') : t('groupDetail.addGroup')}`}
        visible={visible}
        onOk={this.handleOk}
        onCancel={closeModal}
        okText={t('public.confirm')}
        cancelText={t('public.cancel')}
      >
        <FormItem {...formItemLayout} label={t('groupDetail.groupName')}>
          {
            getFieldDecorator('groupName', {
              rules: [{
                required: true,
                message: t('groupDetail.groupName'),
              }, {
                validator: this.checkUserName,
              }],
              initialValue: editGroup ? editData.displayName : '',
            })(
              <Input placeholder={t('groupDetail.pleaseInputGroupName')} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={t('public.description')}>
          {
            getFieldDecorator('desc', {
              initialValue: editGroup ? editData.description : '',
            })(
              <Input placeholder={t('public.inputDescription')} />
            )
          }
        </FormItem>
      </Modal>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  createGroup,
  updateGroup,
})(Form.create()(GroupsModal))
