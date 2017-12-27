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
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import {
  Modal, Form, InputNumber, Row, Col,
  Select, Input, notification, Radio,
} from 'antd'
import './style/SubscriptServiceModal.less'
import { consumeVoucherSlt } from '../../../../selectors/CSB/instanceService/consumerVoucher'
import { getConsumerVouchersList } from '../../../../actions/CSB/instanceService/consumerVouchers'
import { subscribeService } from '../../../../actions/CSB/instanceService'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

class SubscriptServiceModal extends React.Component {
  static propTypes = {
    // 控制Modal的显示隐藏
    visible: propTypes.bool.isRequired,
    // 关闭 modal 的方法
    closeModalMethod: propTypes.func.isRequired,
  }
  state = {
    mode: 'top',
    confirmLoading: false,
  }

  componentDidMount() {
    const { getConsumerVouchersList, match } = this.props
    const { instanceID } = match.params
    getConsumerVouchersList(instanceID)
  }

  handleOk = () => {
    const { form, subscribeService, match, dateSource, closeModalMethod } = this.props
    const { instanceID } = match.params
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { consumer } = values
      const body = {
        serviceId: dateSource.id,
        evidenceId: parseInt(consumer),
        reason: '',
        accessConfig: '',
      }
      this.setState({
        confirmLoading: true,
      })
      subscribeService(instanceID, body).then(res => {
        if (res.error) {
          if (res.status === 403) {
            notification.warn({
              message: '订阅失败',
              description: '没有订阅服务权限',
            })
            this.setState({
              confirmLoading: false,
            })
            return
          }
          notification.error({
            message: '订阅失败',
            description: res.error,
          })
          this.setState({
            confirmLoading: false,
          })
          return
        }
        notification.success({
          message: '订阅成功',
        })
        this.setState({
          confirmLoading: false,
        })
        closeModalMethod()
      })
    })
  }

  handleCancel = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  handleModeChange = e => {
    const mode = e.target.value
    this.setState({ mode })
  }
  render() {
    const { form, visible, dateSource, vouchers } = this.props
    const { mode, confirmLoading } = this.state
    const { getFieldDecorator } = form
    const { content } = vouchers
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return <Modal
      title="订阅服务"
      visible={visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width="570px"
      confirmLoading={confirmLoading}
      wrapClassName="subscript-service-modal"
    >
      <Form>
        <Row className="row-style">
          <Col span={4} className="require">QPS</Col>
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
                {
                  content ? content.map(item => {
                    return <Option key={item.id}>{item.name}</Option>
                  }) : []
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label="绑定 IP"
          key="bindIp"
          {...formItemLayout}
          style={{ marginBottom: 24 }}
        >
          {
            getFieldDecorator('bindIp')(
              <TextArea placeholder={'用于限制访问该服务的 IP 地址，空表示不需要限制 IP 访问；\n用"，"号隔开；'}/>
            )
          }
        </FormItem>
        <Row className="row-style">
          <Col span={4}>服务详细信息</Col>
          <Col span={18}>
            <Radio.Group className="subscript-radio-group" onChange={this.handleModeChange} value={mode}>
              <Radio.Button value="top">基本详情</Radio.Button>
              <Radio.Button value="left" disabled>入参</Radio.Button>
              <Radio.Button value="right" disabled>出参</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={18} offset={4}>
            <table className="service-info">
              <tbody>
                <tr>
                  <td>服务名称</td>
                  <td>{dateSource.name}</td>
                </tr>
                <tr>
                  <td>服务描述</td>
                  <td>{dateSource.description || '-'}</td>
                </tr>
                <tr>
                  <td>服务状态</td>
                  <td>{dateSource.status === 1 ? '已激活' : '已停用'}</td>
                </tr>
                <tr>
                  <td>开放接口</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}

const mapStateToProps = (state, props) => {
  return {
    vouchers: consumeVoucherSlt(state, props),
  }
}

export default connect(mapStateToProps, {
  getConsumerVouchersList,
  subscribeService,
})(Form.create()(SubscriptServiceModal))
