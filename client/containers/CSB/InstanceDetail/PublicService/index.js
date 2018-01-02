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
  Pagination, Badge,
} from 'antd'
import './style/PublicServices.less'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { parse as parseQuerystring } from 'query-string'
import ServiceApiDoc from '../MySubscribedService/ServiceApIDoc'
import { formatDate, toQuerystring } from '../../../../common/utils'
import { getPublicServiceList } from '../../../../actions/CSB/instanceService/publicService'
import { publicServiceSlt } from '../../../../selectors/CSB/instanceService/publicService'
import { getServiceApiDoc } from '../../../../actions/CSB/instanceService/mySubscribedServices'

const Search = Input.Search

class PublicServices extends React.Component {
  state = {
    currentService: {},
    name: '',
    visible: false,
    confirmLoading: false,
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { name } = query
    this.setState({
      name,
    }, this.loadData)
  }

  loadData = (query = {}) => {
    const { location, history, getPublicServiceList, instanceID } = this.props
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
    getPublicServiceList(instanceID, query)
  }

  renderServiceStatusUI = status => {
    switch (status) {
      case 1:
        return <Badge status="success" text="已激活"/>
      case 2:
        return <Badge status="error" text="已停用"/>
      case 4:
        return <Badge status="default" text="已注销"/>
      default:
        return <span>未知</span>
    }
  }

  tableChange = () => {}

  openServiceApiDoc = record => {
    const { getServiceApiDoc, instanceID } = this.props
    const { id } = record
    const callback = () => getServiceApiDoc(instanceID, id).then(() => {
      this.setState({
        confirmLoading: false,
      })
    })
    this.setState({
      currentService: record,
      visible: true,
      confirmLoading: true,
    }, callback)
  }

  render() {
    const { name, visible, currentService, confirmLoading } = this.state
    const { plubicServiceList, location, serviceList } = this.props
    const { isFetching, size, totalElements, content } = plubicServiceList
    const { query } = location
    const columns = [
      { title: '公开服务名称', dataIndex: 'name', width: '12%' },
      {
        title: '服务状态', dataIndex: 'status', width: '11%',
        render: status => this.renderServiceStatusUI(status),
      },
      { title: '服务版本', dataIndex: 'version', width: '11%' },
      { title: '所属服务组', dataIndex: 'groupName', width: '11%' },
      { title: '订阅状态', dataIndex: 'dingyue', width: '12%', render: () => '无需订阅' },
      { title: '服务描述', dataIndex: 'desc', width: '12%', render: () => '无需订阅' },
      {
        title: '服务发布时间', dataIndex: 'publishTime', width: '15%',
        render: text => formatDate(text),
      },
      {
        title: '操作', dataIndex: 'handle', width: '16%',
        render: (text, record) => <Button
          onClick={this.openServiceApiDoc.bind(this, record)}>
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
        <Button type="primary" icon="reload" onClick={() => this.loadData()}>刷新</Button>
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
          loading={confirmLoading}
          currentService={currentService}
          serviceList={serviceList}
        />
      }
    </QueueAnim>
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { match, location } = ownProps
  const { instanceID } = match.params
  location.query = parseQuerystring(location.search)
  const plubicServiceList = publicServiceSlt(state, ownProps)
  const serviceList = entities.cbsPublished || {}
  return {
    instanceID,
    plubicServiceList,
    serviceList,
  }
}

export default connect(mapStateToProps, {
  getPublicServiceList,
  getServiceApiDoc,
})(PublicServices)
