/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RoutingRule Modal
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { Input, Modal, Form, Switch, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class RoutingRuleModal extends React.Component {
  confirmModal = () => {
    const { scope } = this.props
    scope.setState({
      ruleModal: false,
    })
  }
  cancelModal = () => {
    const { scope } = this.props
    scope.setState({
      ruleModal: false,
    })
  }
  handleSelectChange = value => {
    console.log(value)
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  }
  render() {
    const { form, visible, ...otherProps } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        title="添加路由规则"
        width={560}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={this.cancelModal}
        {...otherProps}
      >
        <FormItem {...formItemLayout} label="路由名称">
          {getFieldDecorator('routerName', {
            rules: [{
              require: true,
              message: 'router',
            }],
          })(
            <Input placeholder="router" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="路由路径">
          {getFieldDecorator('routerPath', {
            rules: [{
              require: true,
              message: 'path',
            }],
          })(
            <Input placeholder="/service/demo/**" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="微服务ID/路由URL">
          {getFieldDecorator('routerUrl', {
            rules: [{
              require: true,
              message: 'url',
            }],
          })(
            <Input placeholder="/router/test" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="路由规则描述">
          {getFieldDecorator('routerRule', {
            rules: [{
              require: true,
              message: 'rule',
            }],
          })(
            <Input placeholder="test" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="去掉路径前缀">
          {getFieldDecorator('switch1', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="失败重试机制">
          {getFieldDecorator('switch2', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="默认状态">
          {getFieldDecorator('switch3', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="路由策略">
          {getFieldDecorator('tactics', { initialValue: '1' })(
            <Select
              onChange={this.handleSelectChange}
              style={{ width: 200 }}
            >
              <Option value="1">顺序路由</Option>
              <Option value="2">随机路由</Option>
              <Option value="3">粘性路由</Option>
              <Option value="4">加权平均路由</Option>
              <Option value="5">基于负载路由</Option>
              <Option value="6">基于连接数路由</Option>
            </Select>
          )}
        </FormItem>
      </Modal>
    )
  }
}

export default Form.create()(RoutingRuleModal)
