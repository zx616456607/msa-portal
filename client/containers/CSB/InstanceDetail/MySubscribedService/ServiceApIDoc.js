/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service API Doc
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import {
  Modal, Button, Row, Col,
  Table, Input,
} from 'antd'
import './style/serviceApiDoc.less'

const TextArea = Input.TextArea

class ServiceApIDoc extends React.Component {
  static propTypes = {
    // 关闭 Modal 的方法
    closeModalMethod: propTypes.func.isRequired,
  }

  closeModal = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  render() {
    const basicColumns = [
      { title: '开放协议类型', dataIndex: 'type', key: 'type' },
      { title: '开放地址', dataIndex: 'address', key: 'address' },
    ]
    const basicInfoData = [
      { type: 'resetful', address: 'http://eqwew' },
      { type: 'webservice', address: 'http://qweqweqweq' },
    ]
    const errorCodeColumns = [
      { title: '错误代码', dataIndex: 'errorCode', key: 'errorCode' },
      { title: '处置建议', dataIndex: 'suggestion', key: 'suggestion' },
      { title: '说明', dataIndex: 'desc', key: 'desc' },
    ]
    const errorCodeData = [
      { errorCode: 'arg0', suggestion: 'arg0', desc: 'int' },
      { errorCode: 'arg1', suggestion: 'arg1', desc: 'int' },
    ]
    return <Modal
      title="服务 API 文档"
      visible={true}
      closable={true}
      onCancel={this.closeModal}
      maskClosable={false}
      wrapClassName="service-api-doc"
      footer={[
        <Button type="primary" size="large" key="ok" onClick={this.closeModal}>知道了</Button>,
      ]}
    >
      <div className="basicInfo">
        <div className="second-title header">服务基本信息及开放协议</div>
        <Row>
          <Col span={5}>服务名：</Col>
          <Col span={19}>qeqweqw</Col>
        </Row>
        <Row>
          <Col span={5}>订阅状态：</Col>
          <Col span={19}><div className="status">已授权</div></Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={basicColumns}
              dataSource={basicInfoData}
              pagination={false}
              rowKey={record => record.type}
              bordered={true}
            />
          </Col>
        </Row>
      </div>
      <div className="paramInfo">
        <div className="second-title header">服务参数信息</div>
        <Row>
          <Col span={24}>请求错误代码</Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={errorCodeColumns}
              dataSource={errorCodeData}
              pagination={false}
              bordered={true}
              rowKey={record => record.errorCode}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>模拟返回结果</Col>
        </Row>
        <Row>
          <Col span={24}><TextArea /></Col>
        </Row>
      </div>
    </Modal>
  }
}

export default ServiceApIDoc
