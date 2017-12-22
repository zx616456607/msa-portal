/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance application
 *
 * 2017-12-11
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Radio, Button, Icon, Input, Modal, Table, Row, Col, Checkbox, Pagination,
  notification, Tooltip,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import isEqual from 'lodash/isEqual'
import confirm from '../../../components/Modal/confirm'
import Countdown from '../../../components/Countdown'
import {
  loadApply,
  updateApply,
} from '../../../actions/CSB/myApplication'
import {
  UNUSED_CLUSTER_ID,
  CSB_APPROVAL_FLAG,
  CANCEL_APPROVAL_TIMEOUT,
} from '../../../constants'
import {
  formatDate,
  renderInstanceRole,
  formatFilterConditions,
  getInstanceRole,
  toQuerystring,
} from '../../../common/utils'
import './style/index.less'
import CSBApplyStatus from '../../../components/CSBApplyStatus'
import { csbApplySltMaker, getQueryAndFuncs } from '../../../selectors/CSB/apply'

const approvalSlt = csbApplySltMaker(CSB_APPROVAL_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_APPROVAL_FLAG)
const RadioGroup = Radio.Group
const Search = Input.Search
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

class CSBApplication extends React.Component {
  state = {
    radioValue: 'status,eq,1',
    name: '',
    currentRow: null,
    confirmLoading: false,
    ownerResponse: '',
    timeoutComplete: 0,
    filteredRoleValue: [],
    filteredStatueValue: [],
    requestTimeSortOrder: false,
    approvalTimeSortOrder: false,
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { name, filter, sort } = query
    const filteredValue = []
    this.setState({
      name,
      filteredValue,
      radioValue: !filter || filter.indexOf('status,eq,1') > -1 ? 'status,eq,1' : 'status,ne,1',
      requestTimeSortOrder: this.formatSortOrder(sort),
      approvalTimeSortOrder: this.formatSortOrder(sort),
    }, this.loadData)
  }

  formatSortOrder = sort => {
    if (!sort) {
      return false
    }
    const columeKey = sort.substring(2, sort.length)
    const orderValue = sort.substring(0, 1)
    if (columeKey === 'approvalTime' && orderValue === 'a') {
      return 'ascend'
    }
    if (columeKey === 'approvalTime' && orderValue === 'd') {
      return 'descend'
    }
    if (columeKey === 'requestTime' && orderValue === 'a') {
      return 'ascend'
    }
    if (columeKey === 'requestTime' && orderValue === 'd') {
      return 'descend'
    }
    return false
  }

  loadData = query => {
    const { loadApply, currentUser, location, history } = this.props
    const { name, radioValue } = this.state
    query = Object.assign({}, location.query, {
      name,
      filter: [ radioValue ],
    }, query)
    if (query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    loadApply(UNUSED_CLUSTER_ID, mergeQuery(currentUser.userID, query))
  }

  radioChange = e => {
    const radioValue = e.target.value
    // 切换审批状态，重置 table 组件的排序和筛选
    this.setState({
      radioValue,
      requestTimeSortOrder: false,
      approvalTimeSortOrder: false,
      filteredRoleValue: [],
      filteredStatueValue: [],
    })
    this.loadData({
      filter: [ e.target.value ],
      page: 1,
      sort: null,
    })
  }

  formatFilterConditions = filters => {
    const { status } = filters
    let statusFilter = 'status,ne,1'
    if (status && status.length === 1) {
      statusFilter = `status,eq,${status[0]}`
    }
    const roleConditions = formatFilterConditions(filters)
    roleConditions.push(statusFilter)
    return roleConditions
  }

  tableOnchange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    const { role, status } = filters
    const filter = this.formatFilterConditions(filters)
    this.setState({
      filteredRoleValue: role,
      filteredStatueValue: status,
    })
    if (order) {
      switch (columnKey) {
        case 'approvalTime':
          this.setState({
            requestTimeSortOrder: false,
            approvalTimeSortOrder: order,
          })
          break
        case 'requestTime':
          this.setState({
            requestTimeSortOrder: order,
            approvalTimeSortOrder: false,
          })
          break
        default:
          break
      }
    } else {
      this.setState({
        requestTimeSortOrder: false,
        approvalTimeSortOrder: false,
      })
    }
    const query = {
      page: 1,
      filter,
      sort: order ? `${order.substring(0, 1)},${columnKey}` : null,
    }
    this.loadData(query)
  }

  handleApprove = (result, row) => {
    this.setState({
      approveModal: true,
      currentRow: row,
    })
    this.setState({
      isPass: result === 'pass',
    })
  }

  confirmModal = () => {
    const { updateApply, currentUser } = this.props
    const { isPass, ownerResponse, currentRow } = this.state
    const status = isPass ? 2 : 3
    const body = {
      reviewer: {
        id: currentUser.userID,
      },
      status,
      ownerResponse,
    }
    this.setState({
      confirmLoading: true,
    })
    updateApply(UNUSED_CLUSTER_ID, currentRow.id, body).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) {
        return
      }
      notification.success({
        message: `${isPass ? '通过' : '拒绝'}申请成功`,
      })
      this.loadData({ name: '', page: 1 })
      this.setState({
        approveModal: false,
      })
    })
  }

  cancelApproval = row => {
    const self = this
    const timeout = <font className="primary-color">
      {moment(this.getApprovalDeadline(row)).toNow(true)}
    </font>
    confirm({
      modalTitle: '撤销审批',
      width: 520,
      title: <span>
        撤销审批后，该申请将回到申请中状态，可重新审批。已通过的
        审批申请人在实例中发布的服务将被注销，已订阅的服务将被退订
      </span>,
      content: <div>
        {timeout}后将不能执行撤销操作，是否确定撤销审批？
      </div>,
      onOk() {
        return new Promise((resolve, reject) => {
          const { updateApply, currentUser } = self.props
          const body = {
            reviewer: {
              id: currentUser.userID,
            },
            status: 1,
          }
          updateApply(UNUSED_CLUSTER_ID, row.id, body).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '撤销审批成功',
            })
            self.loadData({ name: '', page: 1 })
          })
        })
      },
    })
  }

  cancelModal = () => {
    this.setState({
      approveModal: false,
    })
  }

  getApprovalDeadline = row => {
    const { approvalTime } = row
    const deadline = +new Date(approvalTime) + CANCEL_APPROVAL_TIMEOUT
    return deadline
  }

  // when countdown complete change state to rerender
  onCancelApprovalTimeoutComplete = () => {
    let { timeoutComplete } = this.state
    timeoutComplete++
    this.setState({
      timeoutComplete,
    })
  }

  renderTableColume = () => {
    const {
      radioValue, filteredStatueValue, filteredRoleValue,
      requestTimeSortOrder, approvalTimeSortOrder,
    } = this.state
    const approvalTimeCol = {
      title: '审批时间',
      dataIndex: 'approvalTime',
      width: '13%',
      sorter: true,
      sortOrder: approvalTimeSortOrder,
      render: (text, row) => (
        (text && text !== row.requestTime)
          ? formatDate(text)
          : '-'
      ),
    }
    const reviewerCol = { title: '审批人', dataIndex: 'reviewer.name', width: '13%' }
    const columns = [
      {
        title: '申请人',
        dataIndex: 'applicant',
        width: radioValue === 'status,eq,1' ? '15%' : '10%',
        render: (text, row) => row.requestor.name,
      },
      {
        title: '申请实例',
        dataIndex: 'instance',
        width: radioValue === 'status,eq,1' ? '15%' : '15%',
        render: (text, row) => row.instance.name,
      },
      {
        title: '实例授权',
        dataIndex: 'role',
        width: radioValue === 'status,eq,1' ? '20%' : '15%',
        filters: radioValue === 'status,eq,1' ? null : [{
          text: '仅发布服务',
          value: 2,
        }, {
          text: '仅订阅服务',
          value: 1,
        }, {
          text: '发布服务 & 订阅服务',
          value: 4,
        }],
        filteredValue: radioValue === 'status,eq,1' ? null : filteredRoleValue,
        render: role => renderInstanceRole(role),
      },
      {
        title: '申请时间',
        dataIndex: 'requestTime',
        width: radioValue === 'status,eq,1' ? '15%' : '13%',
        render: text => formatDate(text),
        sorter: true,
        sortOrder: requestTimeSortOrder,
      },
      {
        title: '审批状态',
        dataIndex: 'status',
        width: '15%',
        filters: radioValue === 'status,eq,1' ? null : [{
          text: '已通过',
          value: 2,
        }, {
          text: '已拒绝',
          value: 3,
        }],
        filteredValue: radioValue === 'status,eq,1' ? null : filteredStatueValue,
        render: (text, row) => <CSBApplyStatus stateKey={row.status}></CSBApplyStatus>,
      },
      {
        title: '操作',
        width: radioValue === 'status,eq,1' ? '20%' : '14%',
        render: (text, row) => {
          if (row.status === 1) {
            return (
              [
                <Button
                  className="passBtn"
                  key="pass"
                  // type="primary"
                  onClick={() => this.handleApprove('pass', row)}
                >
                  通过
                </Button>,
                <Button
                  key="refuse"
                  onClick={() => this.handleApprove('refuse', row)}
                >
                  拒绝
                </Button>,
              ]
            )
          }
          const deadline = this.getApprovalDeadline(row)
          const timeLeftSec = (deadline - +new Date()) / 1000
          const disabled = timeLeftSec <= 0
          const title = disabled
            ? '审批已超过 6 小时，无法撤销'
            : <div>
              <Countdown
                seconds={timeLeftSec}
                onComplete={this.onCancelApprovalTimeoutComplete.bind(this, row)}
              />可撤销
            </div>
          return <Tooltip title={title}>
            <Button
              type="dashed"
              onClick={this.cancelApproval.bind(this, row)}
              icon={disabled ? 'close-circle-o' : 'clock-circle-o'}
              disabled={disabled}
            >
              撤销审批
            </Button>
          </Tooltip>
        },
      },
    ]
    if (radioValue !== 'status,eq,1') {
      columns.splice(4, 0, approvalTimeCol, reviewerCol)
    }
    return columns
  }

  render() {
    const { myApplication, location } = this.props
    const { query } = location
    const { isFetching, content, totalElements, size } = myApplication
    const {
      radioValue, isPass, approveModal, currentRow,
      confirmLoading,
    } = this.state
    const columns = this.renderTableColume()
    const rolePlainOptions = [
      { label: '可发布服务', value: 2 },
      { label: '可订阅服务', value: 1 },
    ]
    const currentCheckedValues = []
    const roleData = getInstanceRole(currentRow && currentRow.role)
    if (roleData.subscribe) {
      currentCheckedValues.push(1)
    }
    if (roleData.publish) {
      currentCheckedValues.push(2)
    }
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="approval-instance">
        <div className="approval-instance-radio" key="radios">
          审批状态：
          <RadioGroup onChange={this.radioChange} value={radioValue}>
            <Radio value="status,eq,1">待审批</Radio>
            <Radio value="status,ne,1">已审批</Radio>
          </RadioGroup>
        </div>
        <div className="layout-content-btns" key="btns">
          <Button
            onClick={() => this.loadData()}
          >
            <Icon type="sync" />刷新
          </Button>
          <Search
            placeholder="请输入实例名搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ name: e.target.value })}
            onSearch={name => this.loadData({ name, page: 1 })}
            value={this.state.name}
          />
          {
            totalElements > 0 && <div className="page-box">
              <span className="total">共 {totalElements} 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div className="layout-content-body" key="body">
          <Table
            className="approval-instance-table"
            columns={columns}
            dataSource={content}
            pagination={false}
            loading={isFetching}
            rowKey={row => row.id}
            onChange={this.tableOnchange}
          />
        </div>
        <Modal
          title={isPass ? '通过实例使用申请' : '拒绝实例使用申请'}
          visible={approveModal}
          onCancel={this.cancelModal}
          onOk={this.confirmModal}
          okText={isPass ? '通过' : '拒绝'}
          confirmLoading={confirmLoading}
        >
          <Row className="approval-instance-row">
            <Col span={4}>
              申请实例
            </Col>
            <Col span={20}>
              {currentRow && currentRow.instance.name}
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              申请人
            </Col>
            <Col span={20}>
              {currentRow && currentRow.requestor.name}
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              申请权限
            </Col>
            <Col span={20}>
              <CheckboxGroup
                options={rolePlainOptions}
                value={currentCheckedValues}
                readOnly
              />
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              申请原因
            </Col>
            <Col span={20}>
              {currentRow && currentRow.reason}
            </Col>
          </Row>
          <Row className="approval-instance-row">
            <Col span={4}>
              审批原因
            </Col>
            <Col span={20}>
              <TextArea onChange={e => this.setState({ ownerResponse: e.target.value })} />
            </Col>
          </Row>
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current } = state
  const currentUser = current.user.info
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    currentUser,
    location,
    myApplication: approvalSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  loadApply,
  updateApply,
})(CSBApplication)
