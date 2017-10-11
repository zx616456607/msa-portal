/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RegisterMsa Modal
 *
 * 2017-09-12
 * @author zhangxuan
 */

import React from 'react'
import { Input, Modal, Form, Icon, Row, Col } from 'antd'
const FormItem = Form.Item
import './style/index.less'

class RegisterMsa extends React.Component {
  confirmModal = () => {
    const { scope } = this.props
    scope.setState({
      msaModal: false,
    })
  }
  cancelModal = () => {
    const { scope } = this.props
    scope.setState({
      msaModal: false,
    })
  }
  render() {
    const { form, visible } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const formItemLayoutLast = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return (
      <Modal
        className="msa-modal"
        title="注册微服务"
        width={560}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={this.cancelModal}
      >
        <FormItem {...formItemLayout} label="微服务名称">
          {getFieldDecorator('routerName', {
            rules: [{
              require: true,
              message: 'router',
            }],
          })(
            <Input placeholder="填写手动注册微服务名称" />
          )}
        </FormItem>
        <div style={{ paddingLeft: '36px' }}>微服务实例信息</div>
        <div className="dotted"/>
        <FormItem {...formItemLayout} label="服务地址">
          {getFieldDecorator('routerPath', {
            rules: [{
              require: true,
              message: 'path',
            }],
          })(
            <Input placeholder="请确保 ip 可被当前集群访问（如 192.168.0.1）" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="服务端口">
          {getFieldDecorator('routerUrl', {
            rules: [{
              require: true,
              message: 'url',
            }],
          })(
            <Input placeholder="如 8080" />
          )}
        </FormItem>
        <FormItem {...formItemLayoutLast} label="健康检查地址">
          {getFieldDecorator('routerRule', {
            rules: [{
              require: true,
              message: 'rule',
            }],
          })(
            <Row gutter={16}>
              <Col span={19}>
                <Input placeholder="如 192.168.0.1:8080/healthcheck.html" />
              </Col>
              <Col span={5} className="primary-color pointer">测试健康状态</Col>
            </Row>
          )}
        </FormItem>
        <div className="dotted"/>
        <span className="msa-modal-add pointer primary-color">
          <Icon type="plus-circle-o" />继续添加微服务实例
        </span>
      </Modal>
    )
  }
}

export default Form.create()(RegisterMsa)