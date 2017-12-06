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
import { Card, Button, Icon, Input, Radio, Table, Pagination, Modal, Row, Col, Tooltip } from 'antd'
import './style/index.less'
const { TextArea } = Input
const Search = Input.Search
const RadioGroup = Radio.Group

export default class ServiceSubscriptionApproval extends React.Component {
  state = {
    isToo: false,
    modalTitle: '',
    visible: false,
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisible = key => {
    if (key === 'too') {
      this.setState({
        isToo: true,
        modalTitle: '通过订阅服务操作',
        visible: true,
      })
    } if (key === 'reject') {
      this.setState({
        isToo: false,
        modalTitle: '拒绝订阅服务操作',
        visible: true,
      })
    }
  }

  filterState = key => {
    switch (key) {
      case '已通过':
        return <span className="adopt"><div></div>已通过</span>
      case '已退订':
        return <span className="ub"><div></div>已退订</span>
      case '待审批':
        return <span className="eap"><div></div>待审批</span>
      case '已拒绝':
        return <span className="refuse"><div></div>已拒绝</span>
      default:
        return
    }
  }

  render() {
    const { modalTitle, isToo } = this.state
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
      filters: [
        { text: '已通过', value: 'too' },
        { text: '已拒绝', value: 'reject' },
      ],
      render: text => this.filterState(text),
    }, {
      title: '消费凭证',
      dataIndex: 'voucher',
    }, {
      title: <Tooltip title="希望最大每秒访问次数">
        <span>QPS</span>
      </Tooltip>,
      dataIndex: 'QPS',
    }, {
      title: <Tooltip title="希望最大每秒访问次数">
        <span>QPS</span>
      </Tooltip>,
      dataIndex: 'QPH',
      filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
    }, {
      title: '申请订阅时间',
      dataIndex: 'time',
      sorter: (a, b) => a.time - b.time,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <Button className="detail" type="primary" onClick={() => this.handleVisible('too')}>通过</Button>
        <Button onClick={() => this.handleVisible('reject')}>拒绝</Button>
      </div>,
    }]
    const data = [{
      id: '1',
      QPS: 'QPS',
      QPH: 'QPH',
      name: '张三',
      time: '2017-12-12 12:12:01',
      state: '已通过',
      voucher: '我的凭证',
      serviceName: 'TradeCode',
    }, {
      id: '2',
      QPS: 'QPS',
      QPH: 'QPH',
      name: '李四',
      time: '2017-12-12 12:12:01',
      state: '已退订',
      voucher: '我的凭证',
      serviceName: 'TradeCode',
    }, {
      id: '3',
      QPS: 'QPS',
      QPH: 'QPH',
      name: '赵四',
      time: '2017-12-12 12:12:01',
      state: '待审批',
      voucher: '我的凭证',
      serviceName: 'TradeCode',
    }, {
      id: '4',
      QPS: 'QPS',
      QPH: 'QPH',
      name: '小宝',
      time: '2017-12-12 12:12:01',
      state: '已拒绝',
      voucher: '我的凭证',
      serviceName: 'TradeCode',
    }]
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    return (
      <QueueAnim className="csb-service-subscription-approval">
        <Card hoverable className="layout-content-body" key="info">
          <div>
            <span>审批状态：</span>
            <RadioGroup>
              <Radio value={1}>待审批</Radio>
              <Radio value={2}>已审批</Radio>
            </RadioGroup>
          </div>
          <div className="nav">
            <div className="left">
              <Button className="refresh" type="primary"><Icon type="sync" /> 刷新</Button>
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
            hoverable={false}
            columns={columns}
            pagination={false}
            dataSource={data}
            rowKey={row => row.id}
          />
        </Card>
        <Modal title={modalTitle} visible={this.state.visible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>{isToo ? '通 过' : '拒 绝'}</Button>,
          ]}>
          <div className="modal-approval">
            <Row className="modal-div">
              <Col span={4}>订阅服务</Col>
              <Col span={20}>abc</Col>
            </Row>
            <Row className="modal-div">
              <Col span={4}>订阅人</Col>
              <Col span={20}>abc</Col>
            </Row>
            <Row className="modal-div">
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
