/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Apply for CSB Instance Modal
 *
 * 2017-12-11
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import './style/ApplyforCSBInstanceModal.less'
import {
  Modal, Form, Row, Col,
  Input, Checkbox,
} from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

class ApplyforCSBInstanceModal extends React.Component {
  static propTypes = {
    // 获取当前 Modal 输入的值
    callback: propTypes.func.isRequired,
    // 关闭 Modal 的方法
    closeModalMethod: propTypes.func.isRequired,
    // 申请按钮的 loading 胎
    loading: propTypes.bool.isRequired,
    // 当前申请的实例
    currentRecord: propTypes.object.isRequired,
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  handleOk = () => {
    const { callback, form } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      callback(values)
    })
  }

  render() {
    const { loading, form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    }
    return <Modal
      title="申请使用 CSB 实例"
      visible={true}
      closable={true}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width="570px"
      maskClosable={false}
      confirmLoading={loading}
      wrapClassName="ApplyforCSBInstanceModal"
      okText="申请"
    >
      <Row className="row-style">
        <Col span={5}>实例名称</Col>
        <Col span={19}>qweqweqe</Col>
      </Row>
      <Row className="row-style">
        <Col span={5}>实例描述</Col>
        <Col span={19}>我是描述</Col>
      </Row>
      <FormItem
        label="申请权限"
        key="appplyformpermission"
        {...formItemLayout}
      >
        {
          getFieldDecorator('appplyformpermission', {
            rules: [{
              required: true,
              message: '请选择申请权限',
            }],
          })(
            <CheckboxGroup>
              <Checkbox value="p">可发布服务</Checkbox>
              <Checkbox value="s">可订阅服务</Checkbox>
            </CheckboxGroup>
          )
        }
      </FormItem>
      <FormItem
        label="申请原因"
        key="reason"
        {...formItemLayout}
      >
        {
          getFieldDecorator('reson', {
            rules: [{
              required: true,
              message: '请填写申请原因',
            }],
          })(
            <TextArea placeholder="必填"/>
          )
        }
      </FormItem>
    </Modal>
  }
}

export default Form.create()(ApplyforCSBInstanceModal)
