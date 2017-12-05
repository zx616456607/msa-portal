/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Approval
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Card, Button, Icon, Input, Radio, Table, Pagination, Modal, Row, Col } from 'antd'
import './style/index.less'
const { TextArea } = Input
const Search = Input.Search
const RadioGroup = Radio.Group

export default class ServiceSubscriptionApproval extends React.Component {
  state = {
    visible: false,
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisible = () => {
    this.setState({
      visible: true,
    })
  }

  render() {
    const columns = [{
      id: 'id',
      title: '订阅人',
      dataIndex: 'name',
    }, {
      title: '订阅服务名称',
      dataIndex: 'serviceName',
    }, {
      title: '状态',
      dataIndex: 'state',
    }, {
      title: '消费凭证',
      dataIndex: 'voucher',
    }, {
      title: 'QPS',
      dataIndex: 'QPS',
    }, {
      title: 'QPH',
      dataIndex: 'QPH',
    }, {
      title: '申请订阅时间',
      dataIndex: 'time',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <Button className="detail" type="primary">通过</Button>
        <Button>拒绝</Button>
      </div>,
    }]
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    return (
      <QueueAnim className="msa-service-subscription-approval">
        <Card noHovering className="layout-content-body" key="info">
          <div>
            <span>审批状态：</span>
            <RadioGroup>
              <Radio value={1}>待审批</Radio>
              <Radio value={2}>已审批</Radio>
            </RadioGroup>
          </div>
          <div className="nav">
            <div className="left">
              <Button className="refresh" type="primary" onClick={this.handleVisible}><Icon type="sync" /> 刷新</Button>
              <Search
                placeholder="请输入订阅名搜索"
                style={{ width: 200 }}
                onSearch={value => console.log(value)}
              />
              <div className="page">
                <span>共计0条</span>
                <Pagination {...pagination} />
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal title="通过订阅服务操作" visible={this.state.visible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>通 过</Button>,
          ]}>
          <div style={{ padding: 10 }}>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>订阅服务</Col>
              <Col span={20}>abc</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>订阅人</Col>
              <Col span={20}>abc</Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={4}>消费凭证</Col>
              <Col span={20}>消费凭证</Col>
            </Row>
            <Row>
              <Col span={4}>审批意见</Col>
              <Col span={20}>
                <TextArea className="textArea" placeholder="选填" autosize={{ minRows: 2, maxRows: 6 }} />
              </Col>
            </Row>
          </div>
        </Modal>
      </QueueAnim>
    )
  }
}
