/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Subscript Service Modal
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import {
  Modal, Form, InputNumber, Row, Col,
  Select, Input, Button,
} from 'antd'
import '../style/subscriptServiceModal.less'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

class SubscriptServiceModal extends React.Component {
  static propTypes = {
    // 关闭 modal 的方法
    closeModalMethod: propTypes.func.isRequired,
    // 获取当前 modal 的值供父组件调用
    callback: propTypes.func.isRequired,
    // modal 确定按钮的 loading 太
    loading: propTypes.bool.isRequired,
  }

  handleOk = () => {
    const { form, callback } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      callback(values)
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  render() {
    const { loading, form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return <Modal
      title="订阅服务"
      visible={true}
      closable={true}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width="570px"
      maskClosable={false}
      confirmLoading={loading}
      wrapClassName="subscript-service-modal"
    >
      <Form>
        <Row className="row-style">
          <Col span={5} className="require">QPS</Col>
          <Col span={15} className="input-col-style">
            希望每秒最大访问<FormItem>
              {
                getFieldDecorator('qps', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: 'qps 不能为空',
                  }],
                })(
                  <InputNumber
                    min={1}
                    max={20}
                    placeholder="请填写整数"
                  />
                )
              }
            </FormItem>次
          </Col>
        </Row>
        <FormItem
          label="消费凭证"
          key="consumer"
          {...formItemLayout}
        >
          {
            getFieldDecorator('consumer', {
              rules: [{
                required: true,
                message: '选择一个消费凭证',
              }],
            })(
              <Select placeholder="选择一个消费凭证">
                <Option value="1" key="1">消费凭证1</Option>
                <Option value="2" key="2">消费凭证2</Option>
                <Option value="3" key="3">消费凭证3</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label="绑定 IP"
          key="bindIp"
          {...formItemLayout}
        >
          {
            getFieldDecorator('bindIp')(
              <TextArea placeholder={`用于限制访问该服务的 IP 地址，空表示不需要限制 IP 访问；
用"，"号隔开；`}/>
            )
          }
        </FormItem>
        <Row className="row-style">
          <Col span={5}>服务详细信息</Col>
          <Col span={19}><Button>基本详情</Button></Col>
        </Row>
        <Row>
          <Col span={5}></Col>
          <Col span={19}>
            <table className="service-info">
              <tbody>
                <tr>
                  <td>服务名称</td>
                  <td></td>
                </tr>
                <tr>
                  <td>服务描述</td>
                  <td></td>
                </tr>
                <tr>
                  <td>服务状态</td>
                  <td></td>
                </tr>
                <tr>
                  <td>开放接口</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}

export default Form.create()(SubscriptServiceModal)
