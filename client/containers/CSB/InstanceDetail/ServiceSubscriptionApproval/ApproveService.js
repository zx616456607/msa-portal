/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Approve service component
 *
 * 2017-12-29
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { Modal, Form, Row, Col, Input } from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

class ApproveService extends React.Component {
  static propTypes = {
    closeModalMethod: propTypes.func.isRequired,
    currentRecord: propTypes.object.isRequired,
    isToo: propTypes.bool.isRequired,
    modalTitle: propTypes.string.isRequired,
    loading: propTypes.bool.isRequired,
    callback: propTypes.func.isRequired,
  }

  handleOk = () => {
    const { form, callback } = this.props
    const response = form.getFieldValue('response')
    callback({ response })
  }

  render() {
    const {
      modalTitle, loading, currentRecord, isToo, form,
      closeModalMethod,
    } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    }
    return <Modal
      title={modalTitle}
      visible={true}
      onCancel={() => closeModalMethod()}
      onOk={this.handleOk}
      confirmLoading={loading}
      wrapClassName="approve-modal"
      okText={isToo ? '通 过' : '拒 绝'}
    >
      <div className="modal-approval">
        <Row className="modal-div">
          <Col span={4}>订阅服务</Col>
          <Col span={20}>{currentRecord.serviceName}</Col>
        </Row>
        <Row className="modal-div">
          <Col span={4}>订阅人</Col>
          <Col span={20}>{currentRecord.subscriberName ? currentRecord.subscriberName : '-' }</Col>
        </Row>
        <Row className="modal-div">
          <Col span={4}>消费凭证</Col>
          <Col span={20}>{ currentRecord.evidenceName }</Col>
        </Row>
        <FormItem
          label="审批意见"
          key="response"
          {...formItemLayout}
        >
          {
            getFieldDecorator('response')(
              <TextArea placeholder="选填" className="textArea" autosize={{ minRows: 2, maxRows: 6 }}/>
            )
          }
        </FormItem>
      </div>
    </Modal>
  }
}

export default Form.create()(ApproveService)
