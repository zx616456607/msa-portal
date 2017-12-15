/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Public Instances
 *
 * 2017-12-11
 * @author zhangcz
 */

import React from 'react'
import './style/PublicInstances.less'
import QueueAnim from 'rc-queue-anim'
import {
  Button, Input, Pagination, Table,
  Card, notification,
} from 'antd'
import { parse as parseQuerystring } from 'query-string'
import ApplyforCSBInstanceModal from './ApplyforCSBInstanceModal'
import { getInstances, applyforInstance } from '../../../../actions/CSB/instance'
import { connect } from 'react-redux'
import { formatDate } from '../../../../common/utils'
import { CSB_PUBLIC_INSTANCES_FLAG, UNUSED_CLUSTER_ID } from '../../../../constants/index'
import {
  getQueryKey,
  toQuerystring,
} from '../../../../common/utils'
import isEqual from 'lodash/isEqual'

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

class PublicInstances extends React.Component {
  state = {
    applyforCSBInstanceModalVisible: false,
    confirmLoading: false,
    currentRecord: {},
    name: '',
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = query => {
    const { getInstances, userId, history, location } = this.props
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
    getInstances(UNUSED_CLUSTER_ID, mergeQuery(userId, query))
  }

  openApplyforCSBInstanceModal = record => {
    this.setState({
      applyforCSBInstanceModalVisible: true,
      confirmLoading: false,
      currentRecord: record,
    })
  }

  closeApplyforCSBInstanceModal = () => {
    this.setState({
      applyforCSBInstanceModalVisible: false,
    })
  }

  confirmApplyforCSBInstance = values => {
    const { applyforInstance, userId } = this.props
    const { currentRecord } = this.state
    const body = {
      instance: {
        id: currentRecord.id,
      },
      requestor: {
        id: userId,
      },
      ...values,
    }
    this.setState({
      confirmLoading: true,
    })
    applyforInstance(UNUSED_CLUSTER_ID, body).then(res => {
      if (res.error || !res.response.result.data) {
        return notification.error('申请失败，请重试')
      }
      notification.success('申请成功')
      this.setState({
        applyforCSBInstanceModalVisible: false,
        confirmLoading: false,
      })
      this.loadData()
    })
  }

  renderServiceStatusUI = status => {
    if (status) {
      return <span className="may-apply"><div className="status-icon"></div>可申请</span>
    }
    return <span>-</span>
  }

  render() {
    const { publicInstances } = this.props
    const { isFetching, data } = publicInstances
    const {
      applyforCSBInstanceModalVisible, confirmLoading, currentRecord,
      name,
    } = this.state
    const columns = [
      { title: '实例名称', dataIndex: 'name', key: 'name', width: '15%' },
      { title: '部署集群', dataIndex: 'clusterId', key: 'clusterId', width: '15%' },
      {
        title: '状态',
        dataIndex: 'creator.status',
        key: 'creator.status',
        width: '15%',
        render: status => this.renderServiceStatusUI(status),
      },
      { title: '创建人', dataIndex: 'creator.name', key: 'creator', width: '15%' },
      { title: '描述', dataIndex: 'description', key: 'description', width: '15%' },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: '15%',
        render: creationTime => formatDate(creationTime),
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '10%',
        render: (text, record) => {
          if (record.creator && record.creator.status) {
            return <Button
              type="primary"
              onClick={this.openApplyforCSBInstanceModal.bind(this, record)}
            >
              申请
            </Button>
          }
          return <div className="nohandler-style">-</div>
        },
      },
    ]
    const total = 100
    const paginationProps = {
      simple: true,
      total,
      onChange: current => this.loadData({ page: current }),
    }
    return <QueueAnim id="PublicInstances">
      <div className="layout-content-btns" key="layout-content-btns">
        <Button type="primary" icon="reload" onClick={() => this.loadData()}>刷新</Button>
        <Search
          placeholder="按微服务名称搜索"
          className="search-style"
          onChange={e => this.setState({ name: e.target.value })}
          onPressEnter={() => this.loadData({ name, page: 1 })}
        />
        {
          total > 0 && <div className="page-box">
            <span className="total">共 {total} 条</span>
            <Pagination {...paginationProps}/>
          </div>
        }
      </div>
      <div className="layout-content-body" key="layout-content-body">
        <Card hoverable={false}>
          <Table
            columns={columns}
            dataSource={data}
            // rowSelection={rowSelection}
            pagination={false}
            loading={isFetching}
            rowKey={record => record.id}
          />
        </Card>
      </div>
      {
        applyforCSBInstanceModalVisible && <ApplyforCSBInstanceModal
          closeModalMethod={this.closeApplyforCSBInstanceModal.bind(this)}
          loading={confirmLoading}
          callback={this.confirmApplyforCSBInstance}
          currentRecord={currentRecord}
        />
      }
    </QueueAnim>
  }
}

const mapStateToProps = (state, props) => {
  const { location } = props
  const { current, CSB } = state
  const { user } = current
  const userID = user.info.userID
  location.query = parseQuerystring(location.search)
  const publicInstancesKey = getQueryKey(mergeQuery(userID, location.query))
  return {
    userId: userID,
    publicInstances: CSB.publicInstances[publicInstancesKey] || {},
  }
}

export default connect(mapStateToProps, {
  getInstances,
  applyforInstance,
})(PublicInstances)
