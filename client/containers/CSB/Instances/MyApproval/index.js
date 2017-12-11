/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My application
 *
 * 2017-12-11
 * @author zhangxuan
 */

import React from 'react'
import { Radio, Button, Icon, Input, Modal, Table, Row, Col, Checkbox } from 'antd'
import QueueAnim from 'rc-queue-anim'
import './style/index.less'

const RadioGroup = Radio.Group
const SearchInput = Input.Search
const CheckboxGroup = Checkbox.Group

export default class MyApplication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      radioValue: true,
      checkedValues: [],
    }
  }

  radioChange = e => {
    this.setState({
      radioValue: e.target.value,
    })
  }

  handleApprove = result => {
    this.setState({
      approveModal: true,
    })
    switch (result) {
      case 'pass':
        this.setState({
          isPass: true,
        })
        break
      case 'refuse':
        this.setState({
          isPass: false,
        })
        break
      default:
        break
    }
  }

  confirmModal = () => {
    this.setState({
      approveModal: false,
      checkedValues: [],
    })
  }

  cancelModal = () => {
    this.setState({
      approveModal: false,
      checkedValues: [],
    })
  }

  checkboxChange = checkedValues => {
    this.setState({
      checkedValues,
    })
  }
  render() {
    const { radioValue, isPass, approveModal, checkedValues } = this.state
    const pagination = {
      simple: true,
      total: 10,
      current: 1,
      pageSize: 10,
    }
    const data = [{
      key: '1',
      applicant: 'liubei',
      instance: 'TreadCode21',
      status: '可用',
      time: '2016-12-12 08:50:08',
      publish: '是',
      subscribe: '是',
      approveTime: '2016-09-21 08:50:08',
    }, {
      key: '2',
      applicant: 'liubei',
      instance: 'TreadCode21',
      status: '可用',
      time: '2016-12-12 08:50:08',
      publish: '是',
      subscribe: '是',
      approveTime: '2016-09-21 08:50:08',
    }, {
      key: '3',
      applicant: 'liubei',
      instance: 'TreadCode21',
      status: '可用',
      time: '2016-12-12 08:50:08',
      publish: '是',
      subscribe: '是',
      approveTime: '2016-09-21 08:50:08',
    }]
    const columns = [{
      title: '申请人',
      dataIndex: 'applicant',
      width: '10%',
    }, {
      title: '申请实例',
      dataIndex: 'instance',
      width: '10%',
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      filters: [{
        text: '可用',
        value: true,
      }, {
        text: '不可用',
        value: false,
      }],
    }, {
      title: '申请时间',
      dataIndex: 'time',
      width: '10%',
    }, {
      title: '可发布服务',
      dataIndex: 'publish',
      width: '10%',
      filters: [{
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      }],
    }, {
      title: '可订阅服务',
      dataIndex: 'subscribe',
      width: '10%',
      filters: [{
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      }],
    }, {
      title: '审批时间',
      dataIndex: 'approveTime',
      width: '10%',
    }, {
      title: '操作',
      width: '20%',
      render: () => {
        return (
          [
            <Button className="passBtn" key="pass" type="primary" onClick={() => this.handleApprove('pass')}>通过</Button>,
            <Button key="refuse" onClick={() => this.handleApprove('refuse')}>拒绝</Button>,
          ]
        )
      },
    }]
    const plainOptions = [ 'Apple', 'Pear', 'Orange' ]
    return (
      <QueueAnim className="approval-instance">
        <Modal
          title={isPass ? '通过实例使用申请' : '拒绝实例使用申请'}
          visible={approveModal}
          onCancel={this.cancelModal}
          onOk={this.confirmModal}
        >
          <Row className="approval-instance-row">
            <Col span={4}>
              申请实例
            </Col>
            <Col span={20}>
              abc
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              申请人
            </Col>
            <Col span={20}>
              123dgdg
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              申请权限
            </Col>
            <Col span={20}>
              <CheckboxGroup
                options={plainOptions}
                value={checkedValues}
                onChange={this.checkboxChange}
              />
            </Col>
          </Row>
        </Modal>
        <div className="approval-instance-radio" key="radios">
          审批状态：
          <RadioGroup onChange={this.radioChange} value={radioValue}>
            <Radio value={false}>待审批</Radio>
            <Radio value={true}>已审批</Radio>
          </RadioGroup>
        </div>
        <div className="layout-content-btns" key="btns">
          <Button type="primary"><Icon type="sync" /> 刷新</Button>
          <SearchInput
            placeholder="请输入订阅名搜索"
            style={{ width: 200 }}
          />
          <span className="approval-instance-total float-right">共计 10 条</span>
        </div>
        <div className="layout-content-body" key="body">
          <Table
            className="approval-instance-table"
            columns={columns}
            dataSource={data}
            pagination={pagination}
          />
        </div>
      </QueueAnim>
    )
  }
}
