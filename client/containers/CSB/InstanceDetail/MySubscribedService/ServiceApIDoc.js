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
  Table, Input, Spin,
} from 'antd'
import './style/ServiceApiDoc.less'
import isEmpty from 'lodash/isEmpty'
import { formatServiceOpenProtocol } from '../../../../common/utils'

const TextArea = Input.TextArea

class ServiceApIDoc extends React.Component {
  static propTypes = {
    // 关闭 Modal 的方法
    closeModalMethod: propTypes.func.isRequired,
    currentService: propTypes.object.isRequired,
    serviceList: propTypes.object.isRequired,
    loading: propTypes.bool.isRequired,
  }

  closeModal = () => {
    const { closeModalMethod } = this.props
    closeModalMethod()
  }

  renderSubstatus = status => {
    switch (status) {
      case 1:
        return <span className="eap">待审批</span>
      case 2:
        return <span className="adopt">已通过</span>
      case 3:
        return <span className="refuse">已拒绝</span>
      case 4:
        return <span className="ub">已退订</span>
      default:
        return '未知'
    }
  }

  renderModalBody = () => {
    const { loading, currentService, serviceList } = this.props
    if (loading) {
      return <div className="loading-status"><Spin /></div>
    }
    const { serviceId, id } = currentService
    const serviceDetial = serviceList[serviceId] || serviceList[id]
    if ((!loading && !serviceDetial) || (!loading && isEmpty(serviceDetial))) {
      return <div>文档为空，请点击其他文档查看</div>
    }
    const basicColumns = [
      { title: '开放协议类型', dataIndex: 'type', key: 'type' },
      { title: '开放地址', dataIndex: 'address', key: 'address' },
      { title: '方法', dataIndex: 'method', key: 'method' },
    ]
    const { errorCode, type, exposedPath, limitationDetail } = serviceDetial
    let method = ''
    JSON.parse(limitationDetail).forEach(item => {
      if (item.method !== undefined) {
        method = item.method
      }
    })
    const basicInfoData = [
      { type: formatServiceOpenProtocol(type), address: exposedPath, method },
    ]
    const errorCodeColumns = [
      { title: '错误代码', dataIndex: 'code', key: 'code' },
      { title: '处置建议', dataIndex: 'advice', key: 'advice' },
      { title: '说明', dataIndex: 'description', key: 'description' },
    ]
    const errorCodeData = errorCode ? JSON.parse(errorCode) : []
    return <div>
      <div className="basicInfo">
        <div className="second-title header">服务基本信息及开放协议</div>
        <Row>
          <Col span={5}>服务名：</Col>
          <Col span={19}>{serviceDetial.name}</Col>
        </Row>
        <Row>
          <Col span={5}>订阅状态：</Col>
          <Col span={19}>
            <div className="status">
              {this.renderSubstatus(currentService.status)}
            </div>
          </Col>
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
          <Col span={24}><TextArea disabled/></Col>
        </Row>
      </div>
    </div>
  }

  render() {
    return <Modal
      title="服务 API 文档"
      visible={true}
      closable={true}
      onCancel={this.closeModal}
      maskClosable={false}
      wrapClassName="service-api-doc"
      width="570px"
      footer={[
        <Button type="primary" size="large" key="ok" onClick={this.closeModal}>知道了</Button>,
      ]}
    >
      {this.renderModalBody()}
    </Modal>
  }
}

export default ServiceApIDoc
