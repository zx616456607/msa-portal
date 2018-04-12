/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Create Service Group Modal
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Modal, Form, Input, notification,
} from 'antd'
import {
  createGroup,
  updateGroup,
} from '../../../../../actions/CSB/instanceService/group'
import confirm from '../../../../../components/Modal/confirm'

const { TextArea } = Input

const FormItem = Form.Item

class CreateServiceGroupModal extends React.Component {
  static propTypes = {
    // 关闭 Modal 的函数
    closeModalMethod: PropTypes.func.isRequired,
    // 当前进行的操作 create || edit
    handle: PropTypes.string,
    // 编辑时初始值
    initailValue: PropTypes.object,
    // 实例 ID
    instanceID: PropTypes.string.isRequired,
    // 加载数据
    loadData: PropTypes.func,
    // 来源：服务列表或服务组
    from: PropTypes.oneOf([ 'services', 'group' ]),
  }

  state = {
    // 确定按钮的 loading 态
    confirmLoading: false,
  }

  componentDidMount() {
    const { handle } = this.props
    if (handle === 'edit') {
      const { form, initailValue } = this.props
      const { name, ownerName, ownerEmail, ownerPhone, description } = initailValue
      setTimeout(() => {
        form.setFieldsValue({ name, ownerName, ownerEmail, ownerPhone, description })
      }, 200)
    }
  }

  handleOk = () => {
    const {
      form, createGroup, updateGroup, instanceID,
      initailValue, handle, closeModalMethod,
      loadData, from, history,
    } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const isEdit = handle === 'edit'
      let currentAction
      if (isEdit) {
        currentAction = updateGroup(instanceID, initailValue.id, values)
      } else {
        currentAction = createGroup(instanceID, values)
      }
      this.setState({
        confirmLoading: true,
      })
      currentAction.then(res => {
        this.setState({
          confirmLoading: false,
        })
        if (res.error) {
          return
        }
        closeModalMethod()
        loadData && loadData()
        if (from === 'services') {
          confirm({
            modalTitle: '创建服务组成功',
            title: `创建服务组成功，服务组：${values.name}`,
            iconType: 'check-circle-o',
            okText: '去查看',
            width: 520,
            type: 'success',
            onOk() {
              history.push(`/csb-instances-available/${instanceID}/my-published-services-groups`)
            },
          })
          return
        }
        notification.success({
          message: `${isEdit ? '编辑' : '创建'}服务组成功`,
        })
      })
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  render() {
    const { form, handle } = this.props
    const { confirmLoading } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    }
    return <Modal
      title={`${handle === 'create' ? '创建' : '编辑'}服务组`}
      wrapClassName="reset-modal-incloud-form"
      visible={true}
      closable={true}
      onCancel={this.handleCancel}
      onOk={this.handleOk}
      maskClosable={false}
      confirmLoading={confirmLoading}
    >
      <Form>
        <FormItem
          label="服务组名称"
          key="mame"
          {...formItemLayout}
        >
          {
            getFieldDecorator('name', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('服务组名称不能为空')
                  }
                  if (!/^[a-zA-Z][a-zA-Z0-9\-]{2,62}$/.test(value)) {
                    return callback('支持1-63位字母、数字或中划线-组成')
                  }
                  return callback()
                },
              }],
            })(
              <Input placeholder="自定义服务组名称" disabled={handle === 'edit'} />
            )
          }
        </FormItem>
        <FormItem
          label="服务组负责人"
          key="ownerName"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerName', {
              rules: [{
                required: false,
              }],
            })(
              <Input placeholder="服务负责人姓名"/>
            )
          }
        </FormItem>
        <FormItem
          label="负责人邮件"
          key="ownerEmail"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerEmail', {
              rules: [{
                required: false,
              }],
            })(
              <Input placeholder="服务负责人邮件"/>
            )
          }
        </FormItem>
        <FormItem
          label="负责人电话"
          key="ownerPhone"
          {...formItemLayout}
        >
          {
            getFieldDecorator('ownerPhone', {
              rules: [{
                required: false,
              }],
            })(
              <Input placeholder="服务负责人电话"/>
            )
          }
        </FormItem>
        <FormItem
          label="服务组描述"
          key="description"
          {...formItemLayout}
        >
          {
            getFieldDecorator('description')(
              <TextArea placeholder="请输入服务组描述"/>
            )
          }
        </FormItem>
      </Form>
    </Modal>
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  createGroup,
  updateGroup,
})(Form.create()(CreateServiceGroupModal))
