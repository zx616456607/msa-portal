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
import {
  Radio, Button, Icon, Input, Modal, Table, Row, Col, Checkbox, Pagination,
  notification,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import isEqual from 'lodash/isEqual'
import confirm from '../../../components/Modal/confirm'
import {
  loadApply,
  updateApply,
} from '../../../actions/CSB/myApplication'
import {
  UNUSED_CLUSTER_ID,
  CSB_APPLY_EAA_FLAG,
} from '../../../constants'
import {
  formatDate,
  getInstanceRole,
  toQuerystring,
} from '../../../common/utils'
import './style/index.less'
import CSBApplyStatus from '../../../components/CSBApplyStatus'
import { csbApplySltMaker } from '../../../selectors/CSB/apply'

const applysSlt = csbApplySltMaker(CSB_APPLY_EAA_FLAG)
const RadioGroup = Radio.Group
const Search = Input.Search
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

const defaultQuery = {
  flag: CSB_APPLY_EAA_FLAG,
  page: 1,
  size: 10,
}
const mergeQuery = (userId, query) => Object.assign(
  {},
  defaultQuery,
  query,
  { userId }
)

class CSBApplication extends React.Component {
  state = {
    radioValue: 'all',
    name: '',
    currentRow: null,
    confirmLoading: false,
    ownerResponse: '',
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = query => {
    const { loadApply, currentUser, location, history } = this.props
    const { name } = this.state
    query = Object.assign({}, location.query, { name }, query)
    if (query.name === '') {
      delete query.name
    }
    if (query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    loadApply(UNUSED_CLUSTER_ID, mergeQuery(currentUser.userID, query))
  }

  radioChange = e => {
    this.setState({
      radioValue: e.target.value,
    })
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
    confirm({
      modalTitle: '撤销审批',
      title: '撤销审批后，该申请将回到申请中状态，可重新审批。',
      content: '已通过的审批申请人在实例中发布的服务将被注销，已订阅的服务将被退订，1小时5分钟后将不能执行撤销操作，是否确定撤销审批?',
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

  render() {
    const { myApplication, location } = this.props
    const { query } = location
    const { isFetching, content, totalElements, size } = myApplication
    const { radioValue, isPass, approveModal, currentRow, confirmLoading } = this.state
    const columns = [
      {
        title: '申请人',
        dataIndex: 'applicant',
        width: '10%',
        render: (text, row) => row.requestor.name,
      },
      {
        title: '申请实例',
        dataIndex: 'instance',
        width: '10%',
        render: (text, row) => row.instance.name,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        render: (text, row) => <CSBApplyStatus stateKey={row.status}></CSBApplyStatus>,
      },
      {
        title: '申请时间',
        dataIndex: 'requestTime',
        width: '10%',
        render: text => formatDate(text),
      },
      {
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
        render: (text, row) => (getInstanceRole(row.role).publish ? '是' : '否'),
      },
      {
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
        render: (text, row) => (getInstanceRole(row.role).subscribe ? '是' : '否'),
      },
      {
        title: '审批时间',
        dataIndex: 'approvalTime',
        width: '10%',
        render: (text, row) => (
          (text && text !== row.requestTime)
            ? formatDate(text)
            : '-'
        ),
      },
      {
        title: '操作',
        width: '20%',
        render: (text, row) => {
          if (row.status === 1) {
            return (
              [
                <Button
                  className="passBtn"
                  key="pass"
                  type="primary"
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
          return <Button
            type="primary"
            onClick={this.cancelApproval.bind(this, row)}
          >
          撤销审批
          </Button>
        },
      },
    ]
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
            <Radio value="all">all</Radio>
            <Radio value={false}>待审批</Radio>
            <Radio value={true}>已审批</Radio>
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
    myApplication: applysSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  loadApply,
  updateApply,
})(CSBApplication)
