/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Appliction
 *
 * 2017-12-11
 * @author zhaoyb
 */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import difference from 'lodash/difference'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Button, Icon, Input, Table, Pagination, Card, Modal, notification } from 'antd'
import './style/index.less'
import { parse as parseQuerystring } from 'query-string'
import CSBApplyStatus from '../../../../components/CSBApplyStatus'
import { UNUSED_CLUSTER_ID, CSB_APPLY_FLAG } from '../../../../constants'
import {
  renderInstanceRole,
  toQuerystring,
  formatDate,
  handleHistoryForLoadData,
} from '../../../../common/utils'
import { loadApply, removeApply } from '../../../../actions/CSB/myApplication'
import { csbApplySltMaker, getQueryAndFuncs } from '../../../../selectors/CSB/apply'
import confirm from '../../../../components/Modal/confirm'
import ApplyforCSBInstanceModal from '../Public/ApplyforCSBInstanceModal'
import { applyforInstance, abandonInstance } from '../../../../actions/CSB/instance'

const applysSlt = csbApplySltMaker(CSB_APPLY_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_APPLY_FLAG)
const Search = Input.Search

class MyApplication extends React.Component {
  state = {
    id: '',
    name: '',
    textName: '',
    loading: true,
    dataList: [],
    pages: 0,
    total: 0,
    sort: '',
    filter: '',
    desc: '',
    currentRecord: {},
    againApply: false,
    requestTime: true,
    delVisible: false,
    isRevoke: false,
    confirmLoading: false,
  }

  componentWillMount() {
    this.loadData({}, true)
  }

  loadData = (query, isFirst) => {
    const { loadApply, history } = this.props
    const { name, sort, filter } = this.state
    query = Object.assign({}, location.query, { name, sort, filter }, query)
    if (query.name === '') {
      delete query.name
    }
    if (query.page === 1) {
      delete query.page
    }
    if (query.sort === '') {
      delete query.sort
    }
    if (query.filter === '') {
      delete query.filter
    }
    handleHistoryForLoadData(history, query, location, isFirst)
    loadApply(UNUSED_CLUSTER_ID, mergeQuery(query))
  }

  fliterStatus = value => {
    switch (value) {
      case '1':
        return '申请中'
      case '2':
        return '已通过'
      case '3':
        return '已拒绝'
      default:
        return
    }
  }

  handleRevokeApply = (id, name) => {
    this.setState({
      id,
      textName: name,
      delVisible: true,
    })
  }

  handleDelcancel = () => {
    const { removeApply } = this.props
    const { id, textName } = this.state
    removeApply(UNUSED_CLUSTER_ID, id).then(res => {
      if (res.error) {
        notification.error({
          message: `撤销申请实例${textName}失败`,
        })
      } else if (res.response.result.code === 200) {
        notification.success({
          message: `撤销申请实例${textName}成功`,
        })
        this.loadData()
      }
      this.setState({
        delVisible: false,
      })
    })
  }

  handleDelClose = () => {
    this.setState({
      delVisible: false,
    })
  }

  handleAbandonInstance = id => {
    const { abandonInstance, userID } = this.props
    const self = this
    confirm({
      modalTitle: '放弃使用实例',
      title: '是否确定放弃使用实例？',
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const query = {
            userId: userID,
          }
          abandonInstance(UNUSED_CLUSTER_ID, id, query).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '放弃使用实例成功',
            })
            self.loadData()
          })
        })
      },
    })
  }

  handleAgainColse = () => {
    this.setState({
      againApply: false,
    })
  }

  handleAgainOK = (values, self) => {
    const { id } = this.state
    const { applyforInstance, userID } = this.props
    const body = {
      instance: {
        id,
      },
      requestor: {
        id: userID,
      },
      ...values,
    }
    this.setState({
      confirmLoading: true,
    })
    applyforInstance(UNUSED_CLUSTER_ID, body).then(res => {
      if (res.error || !res.response.result.data) {
        return notification.error({ message: '申请失败，请重试' })
      }
      notification.success({ message: '申请成功' })
      self.setState({
        isApplyfor: true,
      })
      this.setState({
        againApply: false,
        confirmLoading: false,
      })
      this.loadData()
    })
  }

  handleAgainApply = (name, row) => {
    const content = { name }
    this.setState({
      againApply: true,
      id: row.instance.id,
      confirmLoading: false,
      currentRecord: content,
      desc: row.ownerResponse,
    })
  }

  filterBtn = row => {
    const { history } = this.props
    switch (row.status) {
      case 2:
        return <div>
          <Button type="primary" onClick={() => history.push(`/csb-instances-available/${row.instance.id}`)}>实例详情</Button>
          <Button className="btn-abandon" onClick={() => this.handleAbandonInstance(row.instance.id)}>放弃使用</Button>
        </div>
      case 1:
        return <Button onClick={() => this.handleRevokeApply(row.id, row.status)}>撤销申请</Button>
      case 3:
        return <Button type="primary" onClick={() => this.handleAgainApply(name, row)}>重新申请</Button>
      default:
        return
    }
  }

  fliterCluster = value => {
    const { clusters } = this.props
    return clusters[value] === undefined ? value : clusters[value].clusterName
  }

  getSort = (order, column) => {
    let orderStr = 'a,'
    if (order === 'descend') {
      orderStr = 'd,'
    }
    return orderStr + column
  }

  getfilter = (Ary, column) => {
    if (Ary.length > 0 && Ary) {
      let filter
      if (Ary.length === 1) {
        if (column === 'empower') {
          filter = `role-eq-${Ary[0]}`
        } else {
          filter = `${column}-eq-${Ary[0]}`
        }
      } else if (Ary.length.length < 3) {
        if (column === 'status') {
          const statusAry = [ '1', '2', '3' ]
          const diffStatuAry = difference(statusAry, Ary)
          filter = `${column}-ne-${diffStatuAry}`
        } else {
          const roleKey = [ '1', '2', '4' ]
          const diffRoleAry = difference(roleKey, Ary)
          filter = `role-ne-${diffRoleAry}`
        }
      }
      return filter
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    let filterStr = ''
    let sortSrt = ''
    if (!isEmpty(filters)) {
      const { empower, status } = filters
      if (empower !== undefined && status !== undefined) {
        if (empower.length < 3 && empower.length > 0 && status.length < 3 && status.length > 0) {
          const query = {
            filter: [
              `${this.getfilter(empower, 'empower')}`,
              `${this.getfilter(status, 'status')}`,
            ],
          }
          filterStr = toQuerystring(query)
          filterStr = filterStr.substring(7, filterStr.length)
        }
      } else {
        if (empower !== undefined) {
          if (empower.length > 0 && empower.length < 3) {
            filterStr = this.getfilter(empower, 'empower')
          }
        } if (status !== undefined) {
          if (status.length > 0 && status.length < 3) {
            filterStr = this.getfilter(status, 'status')
          }
        }
      }
    }
    if (!isEmpty(sorter)) {
      const { columnKey, order } = sorter
      sortSrt = this.getSort(order, columnKey)
    }
    this.setState({
      filter: filterStr,
      sorter: sortSrt,
    })
    this.loadData({ sort: sortSrt, filter: filterStr })
  }

  hadnleState = row => {
    return row.status !== 1 ? formatDate(row.approvalTime) : <div>--</div>
  }

  render() {
    const { myApplication, location, history } = this.props
    const { totalElements, isFetching, size, content } = myApplication
    const { query } = location
    const colmuns = [
      {
        id: 'id',
        title: '实例名称',
        dataIndex: 'name',
        width: '10%',
        render: (text, row) => row.instance.name,
      }, {
        title: '部署集群',
        dataIndex: 'cluster',
        width: '10%',
        render: (text, row) =>
          <div>{this.fliterCluster(row.instance.clusterId)}</div>,
      }, {
        title: '申请时间',
        dataIndex: 'requestTime',
        width: '11%',
        sorter: (a, b) => a.time - b.time,
        render: (text, row) => formatDate(row.requestTime),
      }, {
        title: '实例授权',
        dataIndex: 'empower',
        width: '11%',
        render: (text, row) => renderInstanceRole(row.role),
        filters: [{
          text: '仅发布服务',
          value: '2',
        }, {
          text: '仅订阅服务',
          value: '1',
        }, {
          text: '发布服务&订阅服务',
          value: '4',
        }],
      }, {
        title: '审批状态',
        dataIndex: 'status',
        width: '11%',
        render: (text, row) => <CSBApplyStatus stateKey={row.status}></CSBApplyStatus>,
        filters: [{
          text: '已拒绝',
          value: '3',
        }, {
          text: '已通过',
          value: '2',
        }, {
          text: '申请中',
          value: '1',
        }],
      }, {
        title: '审批原因',
        dataIndex: 'ownerresponse',
        width: '10%',
        render: (text, row) => row.ownerResponse,
      }, {
        title: '审批时间',
        dataIndex: 'approvalTime',
        render: (text, row) => this.hadnleState(row),
        sorter: (a, b) => a.time - b.time,
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '22%',
        render: (text, row) => <div>
          {
            this.filterBtn(row)
          }
        </div>,
      }]

    const pagination = {
      simple: true,
      pageSize: size || 10,
      total: totalElements,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="csb-app">
        <div className="layout-content-btns" key="top">
          <Button type="primary" onClick={() => this.loadData()}><Icon type="sync" />刷 新</Button>
          <Search
            className="text"
            placeholder="按实例名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ name: e.target.value })}
            onSearch={name => this.loadData({ name, page: 1 })}
            value={this.state.name}
          />
          <div className="page">
            <span>共计{totalElements}条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card className="table" key="table">
            <Table
              pagination={false}
              columns={colmuns}
              dataSource={content}
              loading={isFetching}
              onChange={this.handleTableChange}
              rowKey={row => row.id} />
          </Card>
        </div>
        <Modal title="撤销申请实例"
          visible={this.state.delVisible}
          onCancel={this.handleDelClose}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleDelClose}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDelcancel}>确 定</Button>,
          ]}>
          {
            <div className="modal-del-vouchers">
              <div className="img">
                <Icon type="exclamation-circle" />
              </div>
              <div className="desc">
                <span>是否确定撤销申请使用实例 ？</span>
              </div>
            </div>
          }
        </Modal>
        {
          this.state.againApply && <ApplyforCSBInstanceModal
            desc={this.state.desc}
            history={history}
            closeModalMethod={this.handleAgainColse}
            loading={this.state.confirmLoading}
            callback={this.handleAgainOK}
            currentRecord={this.state.currentRecord}
          ></ApplyforCSBInstanceModal>
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, entities } = state
  const { clusters } = entities
  const userID = current.user.info.userID
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    userID,
    clusters,
    location,
    myApplication: applysSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  loadApply,
  removeApply,
  abandonInstance,
  applyforInstance,
})(MyApplication)
