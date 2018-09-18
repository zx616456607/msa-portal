/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Subscript Service Modal
 *
 * 2017-12-05
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import {
  Modal, Form, InputNumber, Row, Col,
  Select, Input, notification, Radio, Tooltip, Icon,
} from 'antd'
import './style/SubscriptServiceModal.less'
import { consumeVoucherSlt } from '../../../../selectors/CSB/instanceService/consumerVoucher'
import { getConsumerVouchersList } from '../../../../actions/CSB/instanceService/consumerVouchers'
import { subscribeService } from '../../../../actions/CSB/instanceService'
import { reSubscribeService } from '../../../../actions/CSB/instanceService/mySubscribedServices'

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
    getConsumerVouchersList(instanceID, { size: 2000 })
  }

  filterConsumerVoucher = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  reSubscribeService = values => {
    const {
      reSubscribeService, instanceID, dateSource,
      callback, closeModalMethod,
    } = this.props
    const { id } = dateSource
    const { consumer: evidenceId } = values
    const body = {
      evidenceId,
      ...values,
    }
    reSubscribeService(instanceID, id, body).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) return
      notification.success({ message: '重新订阅成功' })
      closeModalMethod()
      callback()
    })
  }

  handleOk = () => {
    const { form, subscribeService, match, dateSource, closeModalMethod, from } = this.props
    const { instanceID } = match.params
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { consumer, bindIps, limitDetail } = values
      const body = {
        serviceId: dateSource.id,
        evidenceId: parseInt(consumer, 10),
        reason: '',
        accessConfig: '',
        bindIps,
        limitDetail,
      }
      this.setState({
        confirmLoading: true,
      })
      if (from === 'mySubcribeUI') {
        this.reSubscribeService(values)
        return
      }
      subscribeService(instanceID, body).then(res => {
        this.setState({
          confirmLoading: false,
        })
        if (res.error) {
          if (res.status === 403) {
            notification.warn({
              message: '订阅失败',
              description: '没有订阅服务权限',
            })
            return
          }
          if (res.status === 409) {
            notification.watch({
              message: '订阅失败',
              description: '您已经订阅了该服务，不能重复订阅',
            })
            return
          }
          notification.error({
            message: '订阅失败',
            description: res.error,
          })
          return
        }
        notification.success({
          message: '订阅成功',
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
  renderOpenssl(type) {
    if (/^rest/.test(type)) {
      return 'Restful'
    }
    return 'WebService'
  }
  render() {
    const { form, visible, dateSource, vouchers } = this.props
    const { mode, confirmLoading } = this.state
    const { getFieldDecorator } = form
    const { content } = vouchers
    const { name: serviceName } = dateSource
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    // 消费凭证选项列表
    const consumerVouchersOptions = content.length !== 0 && content.filter(
      v => v.subscribedServiceNames && v.subscribedServiceNames.indexOf(serviceName) < 0)
    return <Modal
      title="订阅服务"
      visible={visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width="570px"
      confirmLoading={confirmLoading}
      wrapClassName="subscript-service-modal"
      maskClosable={false}
    >
      <Form>
        <Row className="row-style">
          <Col span={4} className="require">QPS:</Col>
          <Col span={15} className="input-col-style">
            希望每秒最大访问<FormItem>
              {
                getFieldDecorator('limitDetail', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: 'qps 不能为空',
                  }],
                })(
                  <InputNumber
                    min={1}
                    max={999999999}
                    placeholder="请填写整数"
                  />
                )
              }
            </FormItem>&nbsp;次&nbsp;
            <Tooltip placement="top" title="用于设置该服务的访问量（每秒钟访问量），最终值由服务提供方决定" >
              <Icon type="question-circle-o" />
            </Tooltip>
          </Col>
        </Row>
        <FormItem
          label="消费凭证"
          key="consumer"
          {...formItemLayout}
        >
          {
            getFieldDecorator('consumer', {
              initialValue: dateSource.evidenceId ? dateSource.evidenceId : undefined,
              rules: [{
                required: true,
                message: '选择一个消费凭证',
              }],
            })(
              <Select
                showSearch
                placeholder="选择一个消费凭证"
                filterOption={this.filterConsumerVoucher}
              >
                {
                  consumerVouchersOptions && consumerVouchersOptions.map(item => {
                    return <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  })
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
            getFieldDecorator('bindIps', {
              initialValue: undefined,
              rules: [{
                validator: (rule, value, callback) => {
                  if (value && !/^(\d{1,3}(\.\d{1,3}){3})*(,\d{1,3}(\.\d{1,3}){3})*$/.test(value)) {
                    return callback('用于限制访问该服务的 IP 地址，空表示不需要限制 IP 访问；用"，"号隔开；')
                  }
                  return callback()
                },
              }],
            })(
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
                  <td>开放协议</td>
                  <td>{this.renderOpenssl(dateSource.type)}</td>
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
  reSubscribeService,
})(Form.create()(SubscriptServiceModal))
