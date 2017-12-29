/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Plubic sevice component
 *
 * 2017-12-29
 * @author zhangcz
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import {
  Input, Table, Card, Button,
  Pagination,
} from 'antd'
import './style/PlubicServices.less'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { parse as parseQuerystring } from 'query-string'
import ServiceApiDoc from '../MySubscribedService/ServiceApIDoc'
import { formatDate, toQuerystring } from '../../../../common/utils'

const Search = Input.Search

class PlubicServices extends React.Component {
  state = {
    currentService: {},
    name: '',
    visible: false,
  }

  loadData = (query = {}) => {
    const { location, history } = this.props
    const { name } = this.state
    query = Object.assign({}, location.query, {
      name,
    }, query)
    if (query.page && query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
  }

  tableChange = () => {

  }

  render() {
    const { name, visible, currentService } = this.state
    const { plubicServiceList, location } = this.props
    const { isFetching, size, totalElements, content } = plubicServiceList
    const { query } = location
    const columns = [
      { title: '公开服务名称', dataIndex: 'name', width: '12%' },
      { title: '服务状态', dataIndex: 'status', width: '12%' },
      { title: '服务版本', dataIndex: 'version', width: '12%' },
      { title: '所属服务组', dataIndex: 'group', width: '12%' },
      { title: '订阅状态', dataIndex: 'dingyue', width: '12%', render: () => '无需订阅' },
      { title: '服务描述', dataIndex: 'desc', width: '12%', render: () => '无需订阅' },
      {
        title: '服务发布时间', dataIndex: 'time', width: '12%',
        render: text => formatDate(text),
      },
      {
        title: '操作', dataIndex: 'handle', width: '16%',
        render: (text, record) => <Button
          onClick={() => this.setState({ currentService: record, visible: true })}>
          查看文档
        </Button>,
      },
    ]
    const paginationProps = {
      simple: true,
      total: totalElements,
      size,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return <QueueAnim id="plubic-services">
      <div className="layout-content-btns handler-row">
        <Search
          placeholder="按公开服务名称搜索"
          value={name}
          className="serch-style"
          onChange={e => this.setState({ name: e.target.value })}
          onSearch={() => this.loadData({ name, page: 1 })}
        />
        {totalElements > 0 && <div className="page-box">
          <span className="total">共 {totalElements} 条</span>
          <Pagination {...paginationProps}/>
        </div>}
      </div>
      <div className="layout-content-body" key="layout-content-body">
        <Card>
          <Table
            columns={columns}
            dataSource={content}
            pagination={false}
            rowKey={record => record.id}
            loading={isFetching}
            onChange={this.tableChange}
          />
        </Card>
      </div>
      {
        visible && <ServiceApiDoc
          closeModalMethod={() => this.setState({ visible: false })}
          loading={false}
          currentService={currentService}
          serviceList={{}}
        />
      }
    </QueueAnim>
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match, location } = ownProps
  const { instanceID } = match.params
  location.query = parseQuerystring(location.search)
  return {
    instanceID,
    plubicServiceList: {
      isFetching: false,
      size: 10,
      totalElements: 10,
      content: [],
    },
  }
}

export default connect(mapStateToProps, {

})(PlubicServices)
