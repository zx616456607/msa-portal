/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Subscription Services
 *
 * 2017-12-06
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Pagination, Table, Input } from 'antd'
import QueueAnim from 'rc-queue-anim'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import { parse as parseQuerystring } from 'query-string'
import './style/SubscriptionServices.less'
import SubscriptServiceModal from './SubscriptServiceModal'
import { subscribableServices } from '../../../../actions/CSB/instanceService'
import { formatDate, toQuerystring } from '../../../../common/utils'
import { CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG } from '../../../../constants'
import { getQueryAndFuncs, csbInstanceServiceSltMaker } from '../../../../selectors/CSB/instanceService'

const Search = Input.Search

const subServerSlt = csbInstanceServiceSltMaker(CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_SUBSCRIBE_INSTANCES_SEFVICE_FLAG)

class SubscriptionServices extends React.Component {
  state = {
    subscriptServiceVisible: false,
    confirmLoading: false,
  }

  componentWillMount() {
    this.loadData()
  }

  closeSubscriptServiceModal = () => {
    this.setState({
      subscriptServiceVisible: false,
    })
  }

  loadData = query => {
    const { subscribableServices, match, location, history } = this.props
    const { instanceID } = match.params
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
    subscribableServices(instanceID, mergeQuery(query))
  }

  tableChange = (pagination, filters, sorter) => {
    this.setState({
      filterInfo: filters,
      sorterInfo: sorter,
    })
    let sortStr = ''
    let statusStr = ''
    if (!isEmpty(sorter)) {
      const { columnKey, order } = sorter
      sortStr = this.getSortString(columnKey, order)
    }
    if (!isEmpty(filters.status)) {
      const { status } = filters
      statusStr = status
    }
    this.loadData({ sort: sortStr, status: statusStr })
  }

  getSortString = (columnKey, order) => {
    let str = ',asc'
    if (order === 'descend') {
      str = ',desc'
    }
    return `${columnKey}${str}`
  }

  openSubscriptServiceModal = record => {
    console.log('record=', record)
    this.setState({
      subscriptServiceVisible: true,
      confirmLoading: false,
    })
  }

  renderServiceStatusUI = status => {
    switch (status) {
      case 1:
        return <span className="activated"><div className="status-icon"></div>已激活</span>
      case 2:
        return <span className="cancelled"><div className="status-icon"></div>已停用</span>
      default:
        return <span>未知</span>
    }
  }

  subscriptService = values => {
    console.log('values=', values)
  }

  render() {
    const { services, location } = this.props
    let { subscriptServiceVisible, confirmLoading, name, sorterInfo, filterInfo } = this.state
    const { isFetching, content, totalElements, size } = services
    const { query } = location
    filterInfo = filterInfo || {}
    sorterInfo = sorterInfo || {}
    const columns = [
      { title: '服务名称', dataIndex: 'name', key: 'name' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: status => this.renderServiceStatusUI(status),
        filters: [{
          text: '已激活',
          value: 1,
        }, {
          text: '已停用',
          value: 2,
        }],
        filterMultiple: false,
        filteredValue: filterInfo.status || null,
      },
      { title: '服务版本', dataIndex: 'version', key: 'version' },
      { title: '所属服务组', dataIndex: 'groupName', key: 'groupName' },
      {
        title: '服务开放类型',
        dataIndex: 'accessible',
        key: 'accessible',
        render: text => (text ? '公有' : '私有'),
      },
      {
        title: '服务描述',
        dataIndex: 'description',
        key: 'description',
        render: text => text || '-',
      },
      {
        title: '服务发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
        sorter: (a, b) => a.publishTime - b.publishTime,
        sortOrder: sorterInfo.columnKey === 'publishTime' && sorterInfo.order,
        render: text => formatDate(text),
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (handle, record) => <Button type="primary" onClick={this.openSubscriptServiceModal.bind(this, record)}>订阅</Button>,
      },
    ]
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim id="subscription-services">
        <div className="layout-content-btns" key="layout-content-btns">
          <Button type="primary" icon="reload" onClick={() => this.loadData()}>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            onChange={e => this.setState({ name: e.target.value })}
            onSearch={() => this.loadData({ name, page: 1 })}
            className="search-style"
          />
          {
            totalElements > 0 && <div className="page-box">
              <span className="total">共 { totalElements } 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div key="data-box" className="layout-content-body">
          <Card>
            <Table
              columns={columns}
              dataSource={content}
              onChange={this.tableChange}
              pagination={false}
              loading={isFetching}
              rowKey={record => record.id}
            />
          </Card>
        </div>
        {
          subscriptServiceVisible && <SubscriptServiceModal
            visible={subscriptServiceVisible}
            loading={confirmLoading}
            closeModalMethod={this.closeSubscriptServiceModal.bind(this)}
            callback={this.subscriptService}
          />
        }
      </QueueAnim>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    services: subServerSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  subscribableServices,
})(SubscriptionServices)
