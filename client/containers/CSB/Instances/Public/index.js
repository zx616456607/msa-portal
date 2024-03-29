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
import { ROLE_SYS_ADMIN } from '../../../../constants'
import { parse as parseQuerystring } from 'query-string'
import ApplyforCSBInstanceModal from './ApplyforCSBInstanceModal'
import { getInstances, applyforInstance } from '../../../../actions/CSB/instance'
import {
  instancesSltMaker,
  getQueryAndFuncs,
} from '../../../../selectors/CSB/instance'
import { loadApply } from '../../../../actions/CSB/myApplication'
import { connect } from 'react-redux'
import { formatDate, handleHistoryForLoadData } from '../../../../common/utils'
import { CSB_PUBLIC_INSTANCES_FLAG, UNUSED_CLUSTER_ID } from '../../../../constants/index'
import { renderCSBInstanceStatus } from '../../../../components/utils'

const Search = Input.Search
const pubInstancesSlt = instancesSltMaker(CSB_PUBLIC_INSTANCES_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_PUBLIC_INSTANCES_FLAG)

class PublicInstances extends React.Component {
  state = {
    applyforCSBInstanceModalVisible: false,
    confirmLoading: false,
    currentRecord: {},
    name: '',
    sortOrder: false,
  }

  componentDidMount() {
    this.loadData()
    const { location } = this.props
    const { query } = location
    const { name, sort } = query
    const sortOrder = this.formatSortOrder(sort)
    this.setState({
      name,
      sortOrder,
    }, () => this.loadData({}, true))
  }

  formatSortOrder = sort => {
    if (!sort) {
      return false
    }
    const order = sort.substring(0, 1)
    switch (order) {
      case 'a':
        return 'ascend'
      case 'd':
        return 'descend'
      default:
        return false
    }
  }

  loadData = (query, isFirst) => {
    const { getInstances, history, location } = this.props
    const { name } = this.state
    query = Object.assign({}, location.query, { name }, query)
    if (query.page === 1) {
      delete query.page
    }
    handleHistoryForLoadData(history, query, location, isFirst)
    getInstances(UNUSED_CLUSTER_ID, mergeQuery(query))
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

  confirmApplyforCSBInstance = (values, self) => {
    const { applyforInstance, userId, user, loadApply } = this.props
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
        return notification.error({ message: '申请失败，请重试' })
      }
      notification.success({ message: '申请成功' })
      self.setState({
        isApplyfor: true,
      })
      if (user.role === ROLE_SYS_ADMIN) {
        const query = { flag: 1, page: 1, size: 10, filter: [ 'status-eq-1' ] }
        loadApply(UNUSED_CLUSTER_ID, query)
      }
      this.setState({
        // applyforCSBInstanceModalVisible: false,
        confirmLoading: false,
      })
      this.loadData()
    })
  }

  tableOnchange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    if (order) {
      this.setState({
        sortOrder: order,
      })
    } else {
      this.setState({
        sortOrder: false,
      })
    }
    const query = {
      page: 1,
      sort: order ? `${order.substring(0, 1)},${columnKey}` : null,
    }
    this.loadData(query)
  }

  render() {
    const { publicInstances, location, history } = this.props
    const { query } = location
    const { isFetching, content, totalElements, size } = publicInstances
    const {
      applyforCSBInstanceModalVisible, confirmLoading, currentRecord,
      name, sortOrder,
    } = this.state
    const columns = [
      { title: '实例名称', dataIndex: 'name', key: 'name', width: '15%' },
      {
        title: '部署集群',
        dataIndex: 'clusterId',
        key: 'clusterId',
        width: '15%',
        render: (text, row) => row.cluster && row.cluster.clusterName,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: status => renderCSBInstanceStatus(status),
      },
      { title: '创建人', dataIndex: 'creator.name', key: 'creator', width: '15%' },
      { title: '描述', dataIndex: 'description', key: 'description', width: '15%' },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: '15%',
        render: creationTime => formatDate(creationTime),
        sorter: true,
        sortOrder,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '10%',
        render: (text, record) => {
          if (record.creator) {
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
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page, 10) || 1,
      onChange: current => this.loadData({ page: current }),
    }
    return <QueueAnim id="PublicInstances">
      <div className="layout-content-btns" key="layout-content-btns">
        <Button type="primary" icon="reload" onClick={() => this.loadData()}>刷新</Button>
        <Search
          placeholder="按微实例名称搜索"
          className="search-style"
          onChange={e => this.setState({ name: e.target.value })}
          onPressEnter={() => this.loadData({ name, page: 1 })}
          onSearch={() => this.loadData({ name, page: 1 })}
          value={name}
        />
        {
          totalElements > 0 && <div className="page-box">
            <span className="total">共 {totalElements} 条</span>
            <Pagination {...paginationProps}/>
          </div>
        }
      </div>
      <div className="layout-content-body" key="layout-content-body">
        <Card>
          <Table
            columns={columns}
            dataSource={content}
            // rowSelection={rowSelection}
            pagination={false}
            loading={isFetching}
            rowKey={record => record.id}
            onChange={this.tableOnchange}
          />
        </Card>
      </div>
      {
        applyforCSBInstanceModalVisible && <ApplyforCSBInstanceModal
          history={history}
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
  const { current } = state
  const { user } = current
  const userID = user.info.userID
  location.query = parseQuerystring(location.search)
  return {
    userId: userID,
    user: user.info,
    publicInstances: pubInstancesSlt(state, props),
  }
}

export default connect(mapStateToProps, {
  getInstances,
  applyforInstance,
  loadApply,
})(PublicInstances)
