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
import { Button, Card, Pagination, Table, Input } from 'antd'
import QueueAnim from 'rc-queue-anim'
import './style/subscriptionServices.less'
import SubscriptServiceModal from './SubscriptServiceModal'

const Search = Input.Search

class SubscriptionServices extends React.Component {
  state = {
    subscriptServiceVisible: false,
    confirmLoading: false,
  }

  closeSubscriptServiceModal = () => {
    this.setState({
      subscriptServiceVisible: false,
    })
  }

  loadData = () => {

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
        return <span className="cancelled"><div className="status-icon"></div>已注销</span>
      case 3:
        return <span className="deactivated"><div className="status-icon"></div>已停用</span>
      default:
        return <span>未知</span>
    }
  }

  searchService = e => {
    console.log('e=', e)
  }

  subscriptService = values => {
    console.log('values=', values)
  }

  render() {
    const { subscriptServiceVisible, confirmLoading } = this.state
    const columns = [
      { title: '服务名称', dataIndex: 'name', key: 'name' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: status => this.renderServiceStatusUI(status),
        filters: [{
          text: 'London',
          value: 'London',
        }, {
          text: 'New York',
          value: 'New York',
        }],
        filterMultiple: false,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
      },
      { title: '服务开放类型', dataIndex: 'type', key: 'type' },
      { title: '服务描述', dataIndex: 'desc', key: 'desc' },
      {
        title: '服务发布时间',
        dataIndex: 'time',
        key: 'time',
        sorter: (a, b) => a.time - b.time,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (handle, record) => <Button type="primary" onClick={this.openSubscriptServiceModal.bind(this, record)}>订阅</Button>,
      },
    ]
    const dataSource = []
    for (let i = 0; i < 3; i++) {
      const item = {
        key: i,
        name: 'hello',
        status: i,
        type: 123123123,
        desc: 'hellooooooo',
        time: '2017-1-1-1-1',
      }
      dataSource.push(item)
    }
    const total = 10
    const paginationProps = {
      simple: true,
      total,
    }
    return (
      <QueueAnim id="subscription-services">
        <div className="layout-content-btns" key="layout-content-btns">
          <Button type="primary" icon="reload" onClick={this.loadData}>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            onSearch={this.searchService}
            className="search-style"
          />
          {
            total > 0 && <div className="page-box">
              <span className="total">共 { total } 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div key="data-box" className="layout-content-body">
          <Card hoverable={false}>
            <Table
              columns={columns}
              dataSource={dataSource}
              // rowSelection={rowSelection}
              pagination={false}
              // loading={isFetching}
              rowKey={record => record.key}
            />
          </Card>
        </div>
        {
          subscriptServiceVisible && <SubscriptServiceModal
            loading={confirmLoading}
            closeModalMethod={this.closeSubscriptServiceModal.bind(this)}
            callback={this.subscriptService}
          />
        }
      </QueueAnim>
    )
  }
}

export default SubscriptionServices
