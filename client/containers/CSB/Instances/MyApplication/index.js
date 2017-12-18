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
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Button, Icon, Input, Table, Pagination, Card, Modal, notification } from 'antd'
import './style/index.less'
import { parse as parseQuerystring } from 'query-string'
import { UNUSED_CLUSTER_ID, CSB_PUBLIC_INSTANCES_FLAG } from '../../../../constants'
import { getInstanceRole, getQueryKey, toQuerystring } from '../../../../common/utils'
import { loadApply, removeApply } from '../../../../actions/CSB/myApplication'
const Search = Input.Search
const defaultQuery = {
  flag: CSB_PUBLIC_INSTANCES_FLAG,
  page: 1,
  size: 10,
}
const mergeQuery = (userId, query) => Object.assign(
  {},
  defaultQuery,
  query,
  { userId }
)
class MyApplication extends React.Component {
  state = {
    id: '',
    name: '',
    textName: '',
    loading: true,
    dataList: [],
    pages: 0,
    total: 0,
    delVisible: false,
    isRevoke: false,
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = query => {
    const { loadApply, userID, history } = this.props
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
    loadApply(UNUSED_CLUSTER_ID, mergeQuery(userID, query))
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

  fliterTimer = value => {
    return value.replace('T', ' ').replace('Z', '')
  }

  handleRevokeApply = (id, name) => {
    this.setState({
      id: '',
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
      }
      if (res.response.result.code === 200) {
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

  filterState = key => {
    switch (key) {
      case 2:
        return <span className="adopt"><div></div>已通过</span>
      case 1:
        return <span className="apply"><div></div>申请中</span>
      case 3:
        return <span className="refuse"><div></div>已拒绝</span>
      default:
        return
    }
  }

  filterBtn = (value, id, name) => {
    switch (value) {
      case 2:
        return <Button type="primary" onClick={() => { }}>实例详情</Button>
      case 1:
        return <Button onClick={() => this.handleRevokeApply(id, name)}>撤销申请</Button>
      case 3:
        return <div>--</div>
      default:
        return
    }
  }

  fliterCluster = value => {
    const { clusters } = this.props
    return clusters[value].clusterName
  }

  render() {
    const { myApplication, location } = this.props
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
        render: (text, row) => this.fliterCluster(row.instance.clusterId),
      }, {
        title: '申请时间',
        dataIndex: 'requestTime',
        width: '15%',
        sorter: (a, b) => a.time - b.time,
      }, {
        title: '可发布服务',
        dataIndex: 'canRelease',
        width: '14%',
        render: (text, row) => (getInstanceRole(row.role).publish ? '是' : '否'),
        filters: [{
          text: '是',
          value: '是',
        }, {
          text: '否',
          value: '否',
        }],
      }, {
        title: '可订阅服务',
        dataIndex: 'canBook',
        width: '14%',
        render: (text, row) => (getInstanceRole(row.role).subscribe ? '是' : '否'),
        filters: [{
          text: '是',
          value: '是',
        }, {
          text: '否',
          value: '否',
        }],
      }, {
        title: '审批状态',
        dataIndex: 'status',
        width: '13%',
        render: (text, row) => this.filterState(row.status),
        filters: [{
          text: '已拒绝',
          value: '已拒绝',
        }, {
          text: '已通过',
          value: '已通过',
        }, {
          text: '申请中',
          value: '申请中',
        }],
      }, {
        title: '审批原因',
        dataIndex: 'description',
        width: '10%',
        render: (text, row) => row.instance.description,
      }, {
        title: '审批时间',
        dataIndex: 'approvalTime',
        width: '17%',
        render: (text, row) => this.fliterTimer(row.approvalTime),
        sorter: (a, b) => a.time - b.time,
      }, {
        title: '操作',
        dataIndex: 'operation',
        render: (text, row) => <div>
          {
            this.filterBtn(row.status, row.id, row.instance.name)
          }
        </div>,
      }]

    const pagination = {
      simple: true,
      pageSize: size,
      total: totalElements,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="csb-app">
        <div className="top">
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
            <span>共计{size}条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <Card hoverable={false} >
          <Table
            pagination={false}
            columns={colmuns}
            dataSource={content}
            loading={isFetching}
            rowKey={row => row.id} />
        </Card>
        <Modal title="撤销申请实例"
          visible={this.state.delVisible}
          onCancel={this.handleDelClose}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleDelClose}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDelcancel}>撤 销</Button>,
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
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, CSB, entities } = state
  const { clusters } = entities
  const userID = current.user.info.userID
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  const myApplicationKey = getQueryKey(mergeQuery(userID, location.query))
  return {
    userID,
    clusters,
    location,
    myApplication: CSB.myApplication[myApplicationKey] || {},
  }
}

export default connect(mapStateToProps, {
  loadApply,
  removeApply,
})(MyApplication)
