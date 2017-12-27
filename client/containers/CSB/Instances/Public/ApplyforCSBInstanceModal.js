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
  Input, Checkbox, Icon, Button,
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
  state = {
    text: '',
    isApplyfor: false,
  }

  componentWillMount() {
    const { desc } = this.props
    this.setState({
      text: desc,
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  handleOk = () => {
    const { callback, form } = this.props
    const self = this
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { reason, appplyformpermission } = values
      let role
      if (appplyformpermission.length === 1) {
        role = appplyformpermission[0]
      }
      if (appplyformpermission.length === 2) {
        role = 4
      }
      const requsetBody = {
        role,
        reason,
      }
      callback(requsetBody, self)
    })
  }

  handleChange = e => {
    this.setState({
      text: e.target.value,
    })
  }

  render() {
    const { loading, form, currentRecord, history } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    }
    return <Modal
      title="申请使用 CSB 实例"
      visible={true}
      closable={true}
      onCancel={this.handleCancel}
      width="570px"
      maskClosable={false}
      confirmLoading={loading}
      wrapClassName="ApplyforCSBInstanceModal"
      footer={[
        <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
        !this.state.isApplyfor ?
          <Button key="submit" type="primary" onClick={this.handleOk}>申 请</Button> :
          <Button key="submit" type="primary" onClick={() => history.push('/csb-instances/my-application')}>去查看</Button>,
      ]}
    >
      {
        !this.state.isApplyfor ?
          <Row>
            <Row className="row-style">
              <Col span={5}>实例名称</Col>
              <Col span={19}>{currentRecord.name}</Col>
            </Row>
            <Row className="row-style">
              <Col span={5}>实例描述</Col>
              <Col span={19}>{currentRecord.description === undefined ? '--' : currentRecord.description}</Col>
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
                    <Checkbox value={2}>可发布服务</Checkbox>
                    <Checkbox value={1}>可订阅服务</Checkbox>
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
                getFieldDecorator('reason', {
                  initialValue: this.state.text ? this.state.text : undefined,
                  rules: [{
                    required: true,
                    message: '请填写申请原因',
                  }],
                })(
                  <TextArea placeholder="必填" onChange={this.handleChange} />
                )
              }
            </FormItem>
          </Row> :
          <div className="check">
            <Icon type="check-circle-o" />
            <div className="desc">申请操作成功，待审批</div>
            <div>实例名称：{currentRecord.name}</div>
          </div>
      }
    </Modal>
  }
}

export default Form.create()(ApplyforCSBInstanceModal)
