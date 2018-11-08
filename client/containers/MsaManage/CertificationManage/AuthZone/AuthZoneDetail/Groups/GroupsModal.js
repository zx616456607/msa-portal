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
const FormItem = Form.Item

class GroupsModal extends React.Component {

  handleOk = () => {
    const { createGroup, updateGroup, form,
      editGroup, editData, closeModal, loadGroup } = this.props
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
            message: `${value.groupName}组名称已存在`,
          })
          return
        }
        notification.warn({
          message: editGroup ? `${value.groupName}组更新失败` : `${value.groupName}组添加失败`,
        })
        return
      }
      notification.success({
        message: editGroup ? `${value.groupName}组更新成功` : `${value.groupName}组添加成功`,
      })
      loadGroup()
      closeModal()
      form.resetFields()
    })
  }

  render() {
    const { form, editGroup, editData, visible, closeModal } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        title={`${editGroup ? '编辑组' : '添加组'}`}
        visible={visible}
        onOk={this.handleOk}
        onCancel={closeModal}
      >
        <FormItem {...formItemLayout} label="组名称">
          {
            getFieldDecorator('groupName', {
              rules: [{
                required: true,
                message: '请输入组名称',
              }],
              initialValue: editGroup ? editData.displayName : '',
            })(
              <Input placeholder="请输入组名称" />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {
            getFieldDecorator('desc', {
              initialValue: editGroup ? editData.description : '',
            })(
              <Input placeholder="请输入描述" />
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
