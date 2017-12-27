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
import {
  Card, Button, Icon, Input,
  Radio, Table, Pagination, Modal,
  Row, Col, Tooltip, Form,
  notification,
} from 'antd'
import './style/index.less'
import { connect } from 'react-redux'
import {
  getServiceSubscribeApproveList,
  putServiceApprove,
} from '../../../../actions/CSB/instanceService/serviceSubscribeApprove'
import {
  serviceSubscribeApproveSlt,
} from '../../../../selectors/CSB/instanceService/serviceSubscribeApprove'
import { formatDate } from '../../../../common/utils'

const { TextArea } = Input
const Search = Input.Search
const RadioGroup = Radio.Group
const FormItem = Form.Item

class ServiceSubscriptionApproval extends React.Component {
  state = {
    isToo: false,
    modalTitle: '',
    visible: false,
    currentRecord: {},
    confirmLoading: false,
  }

  componentWillMount() {
    this.loadData()
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleOk = () => {
    const { form, instanceID, putServiceApprove } = this.props
    const { currentRecord, isToo } = this.state
    const response = form.getFieldValue('response')
    const requestID = currentRecord.id
    let status = 2
    if (!isToo) {
      status = 3
    }
    const body = {
      status,
      response,
    }
    this.setState({
      confirmLoading: true,
    })
    putServiceApprove(instanceID, requestID, body).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) return
      this.setState({
        visible: false,
      })
      notification.success({
        message: '操作成功',
      })
      this.loadData()
    })
  }

  loadData = (query = {}) => {
    const { getServiceSubscribeApproveList, instanceID } = this.props
    getServiceSubscribeApproveList(instanceID, query)
  }

  handleVisible = (key, currentRecord) => {
    this.setState({
      currentRecord,
      confirmLoading: false,
    })
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
      case 1:
        return <span className="adopt"><div></div>等待审批</span>
      case 2:
        return <span className="ub"><div></div>审批通过</span>
      case 3:
        return <span className="eap"><div></div>拒绝</span>
      case 4:
        return <span className="refuse"><div></div>撤销申请</span>
      default:
        return
    }
  }

  render() {
    const { modalTitle, isToo, currentRecord, confirmLoading } = this.state
    const { serviceSubscribeAppraveList, form } = this.props
    const { content, size, isFetching, totalElements } = serviceSubscribeAppraveList
    const { getFieldDecorator } = form
    const columns = [{
      id: 'id',
      title: '订阅人',
      dataIndex: 'name',
      width: '12%',
    }, {
      title: '订阅服务名称',
      key: 'serviceId',
      dataIndex: 'serviceId',
      width: '12%',
    }, {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: '12%',
      // filters: [
      //  { text: '已通过', value: 'too' },
      //  { text: '已拒绝', value: 'reject' },
      // ],
      render: text => this.filterState(text),
    }, {
      title: '消费凭证',
      key: 'evidenceId',
      dataIndex: 'evidenceId',
      width: '12%',
    }, {
      title: <Tooltip title="希望最大每秒访问次数">
        <span>QPS</span>
      </Tooltip>,
      dataIndex: 'QPS',
      width: '10%',
    }, {
      title: <Tooltip title="希望最大每秒访问次数">
        <span>QPS</span>
      </Tooltip>,
      dataIndex: 'QPH',
      width: '10%',
      filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
    }, {
      title: '申请订阅时间',
      key: 'requestTime',
      dataIndex: 'requestTime',
      width: '12%',
      // sorter: (a, b) => a.time - b.time,
      render: requestTime => formatDate(requestTime),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (text, record) => <div>
        <Button className="detail" type="primary" onClick={() => this.handleVisible('too', record)}>通过</Button>
        <Button onClick={() => this.handleVisible('reject', record)}>拒绝</Button>
      </div>,
    }]
    const pagination = {
      simple: true,
      total: totalElements,
      defaultCurrent: 1,
      size,
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    }
    return (
      <div className="csb-service-subscription-approval">
        <Card hoverable className="layout-content-body">
          <QueueAnim>
            <div key="filter">
              <span>审批状态：</span>
              <RadioGroup>
                <Radio value={1}>待审批</Radio>
                <Radio value={2}>已审批</Radio>
              </RadioGroup>
            </div>
            <div className="nav" key="nav">
              <div className="left">
                <Button className="refresh" type="primary" onClick={() => this.loadData()}><Icon type="sync" /> 刷新</Button>
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
              key="table"
              columns={columns}
              pagination={false}
              dataSource={content}
              loading={isFetching}
              rowKey={row => row.id}
            />
          </QueueAnim>
        </Card>
        <Modal
          title={modalTitle}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          wrapClassName="approve-modal"
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>{isToo ? '通 过' : '拒 绝'}</Button>,
          ]}
        >
          <div className="modal-approval">
            <Row className="modal-div">
              <Col span={4}>订阅服务</Col>
              <Col span={20}>{currentRecord.serviceId}</Col>
            </Row>
            <Row className="modal-div">
              <Col span={4}>订阅人</Col>
              <Col span={20}>{currentRecord.people ? currentRecord.people : '-' }</Col>
            </Row>
            <Row className="modal-div">
              <Col span={4}>消费凭证</Col>
              <Col span={20}>{ currentRecord.evidenceId }</Col>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const { instanceID } = match.params
  const serviceSubscribeAppraveList = serviceSubscribeApproveSlt(state, ownProps)
  return {
    instanceID,
    serviceSubscribeAppraveList,
  }
}

export default connect(mapStateToProps, {
  getServiceSubscribeApproveList,
  putServiceApprove,
})(Form.create()(ServiceSubscriptionApproval))
