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
  Radio, Table, Pagination,
  Tooltip, notification,
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
import {
  formatDate,
  toQuerystring,
  parseOrderToQuery,
  parseQueryToSortorder,
} from '../../../../common/utils'
import isEqual from 'lodash/isEqual'
import { parse as parseQuerystring } from 'query-string'
import ApproveService from './ApproveService'
import { renderCSBInstanceServiceApproveStatus } from '../../../../components/utils/index'

const Search = Input.Search
const RadioGroup = Radio.Group

class ServiceSubscriptionApproval extends React.Component {
  state = {
    serviceName: '',
    isToo: false,
    modalTitle: '',
    visible: false,
    currentRecord: {},
    confirmLoading: false,
    requestStatus: [ 1 ],
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { serviceName, requestStatus } = query
    this.setState({
      serviceName,
      requestStatus: this.renderStatus(requestStatus),
    }, this.loadData)
  }

  renderStatus = requestStatus => {
    if (!requestStatus) {
      return [ 1 ]
    }
    if (typeof requestStatus === 'string') {
      return [ requestStatus ]
    }
    if (Array.isArray(requestStatus)) {
      return requestStatus
    }
    return [ 1 ]
  }

  approveStatusChange = e => {
    const approveStatus = e.target.value
    let requestStatus = [ 1 ]
    if (approveStatus === 5) {
      requestStatus = [ 2, 3, 4 ]
    }
    this.setState({
      requestStatus,
      serviceName: '',
    })
    this.loadData({
      requestStatus,
      page: 1,
      serviceName: '',
    })
  }

  handleCallback = values => {
    const { instanceID, putServiceApprove } = this.props
    const { currentRecord, isToo } = this.state
    const requestID = currentRecord.id
    let status = 2
    if (!isToo) {
      status = 3
    }
    const body = {
      status,
      values,
    }
    this.setState({ confirmLoading: true })
    putServiceApprove(instanceID, requestID, body).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) return
      this.setState({ visible: false })
      notification.success({ message: '操作成功' })
      this.loadData()
    })
  }

  loadData = (query = {}) => {
    const { getServiceSubscribeApproveList, instanceID, location, history } = this.props
    const { serviceName, requestStatus } = this.state
    query = Object.assign({}, { view: 'publisher' }, location.query,
      { serviceName, requestStatus },
      query
    )
    if (query.page && query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
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

  tableChange = (pagination, filters, sorter) => {
    const { status } = filters
    this.setState({
      requestStatus: status,
    })
    this.loadData({
      requestStatus: status && status.length === 0 ? [ 2, 3, 4 ] : status,
      page: 1,
      sort: parseOrderToQuery(sorter),
    })
  }

  renderFilteredValue = requestStatus => {
    if (typeof requestStatus === 'string') {
      return [ requestStatus ]
    }
    return requestStatus
  }

  render() {
    const {
      modalTitle, isToo, currentRecord, confirmLoading,
      serviceName,
    } = this.state
    const { serviceSubscribeAppraveList, location } = this.props
    const { query } = location
    const { content, size, isFetching, totalElements } = serviceSubscribeAppraveList
    let radioGroupValue = 1
    if (query.requestStatus && parseInt(query.requestStatus) !== 1) {
      radioGroupValue = 5
    }
    let sortObj = { requestTime: false }
    sortObj = Object.assign({}, sortObj, parseQueryToSortorder(sortObj, query))
    const filterArray = [
      { text: '已通过', value: 2 },
      { text: '已拒绝', value: 3 },
      { text: '已退订', value: 4 },
    ]
    const columns = [
      { title: '订阅人', dataIndex: 'subscriberName', width: '8%' },
      { title: '订阅服务名称', dataIndex: 'serviceName', width: '10%' },
      { title: '服务版本', dataIndex: 'serviceVersion', width: '8%' },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        filters: radioGroupValue === 1 ? null : filterArray,
        filteredValue: radioGroupValue === 1 ? null : this.renderFilteredValue(query.requestStatus),
        render: text => renderCSBInstanceServiceApproveStatus(text),
      },
      { title: '消费凭证', dataIndex: 'evidenceName', width: '10%' },
      {
        title: <Tooltip title="希望最大每秒访问次数">
          <span>QPS</span>
        </Tooltip>,
        dataIndex: 'QPS',
        width: '8%',
        render: text => <span>{text ? text : '-'}</span>,
      }, {
        title: 'IP',
        dataIndex: 'QPH',
        width: '8%',
        filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }}/>,
        render: text => <span>{text ? text : '-'}</span>,
      },
      {
        title: '申请订阅时间',
        dataIndex: 'requestTime',
        width: '12%',
        sorter: true,
        sortOrder: sortObj.requestTime,
        render: requestTime => formatDate(requestTime),
      },
      {
        title: '审批意见', dataIndex: 'serviceDescription', width: '8%',
        render: text => <span>{text ? text : '-'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '18%',
        render: (text, record) => {
          if (record.status !== 1) {
            return <div>-</div>
          }
          return <div>
            <Button className="detail" type="primary" onClick={() => this.handleVisible('too', record)}>通过</Button>
            <Button onClick={() => this.handleVisible('reject', record)}>拒绝</Button>
          </div>
        },
      },
    ]
    const pagination = {
      simple: true,
      total: totalElements,
      size,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <div className="csb-service-subscription-approval">
        <Card hoverable className="layout-content-body">
          <QueueAnim>
            <div key="filter">
              <span>审批状态：</span>
              <RadioGroup
                value={radioGroupValue}
                onChange={this.approveStatusChange}
              >
                <Radio value={1}>待审批</Radio>
                <Radio value={5}>已审批</Radio>
              </RadioGroup>
            </div>
            <div className="nav" key="nav">
              <div className="left">
                <Button className="refresh" type="primary" onClick={() => this.loadData()}><Icon type="sync" /> 刷新</Button>
                <Search
                  placeholder="请输入订阅服务名称搜索"
                  style={{ width: 200 }}
                  value={serviceName}
                  onChange={e => this.setState({ serviceName: e.target.value })}
                  onSearch={() => this.loadData({ page: 1 })}
                />
                {totalElements > 0 && <div className="page">
                  <span>共计 {totalElements} 条</span>
                  <Pagination {...pagination} />
                </div>}
              </div>
            </div>
            <Table
              key="table"
              columns={columns}
              pagination={false}
              dataSource={content}
              loading={isFetching}
              rowKey={row => row.id}
              onChange={this.tableChange}
            />
          </QueueAnim>
        </Card>

        {
          this.state.visible && <ApproveService
            closeModalMethod={() => this.setState({ visible: false })}
            isToo={isToo}
            modalTitle={modalTitle}
            loading={confirmLoading}
            currentRecord={currentRecord}
            callback={this.handleCallback}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match, location } = ownProps
  const { instanceID } = match.params
  const serviceSubscribeAppraveList = serviceSubscribeApproveSlt(state, ownProps)
  location.query = parseQuerystring(location.search)
  return {
    instanceID,
    serviceSubscribeAppraveList,
  }
}

export default connect(mapStateToProps, {
  getServiceSubscribeApproveList,
  putServiceApprove,
})(ServiceSubscriptionApproval)
