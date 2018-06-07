/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Approvals of zone user
 *
 * @author zhangxuan
 * @date 2018-06-07
 */
import React from 'react'
import { Button, Input, Table, Pagination, Card, Badge } from 'antd'
import { DEFAULT_PAGESIZE, DEFAULT_PAGE } from '../../../../../../../constants'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import './style/UserGroups.less'
import { formatDate } from '../../../../../../../common/utils'
import classNames from 'classnames'

const Search = Input.Search

export default class Approvals extends React.Component {
  state = {
    current: DEFAULT_PAGE,
    approvalList: [],
    total: 0,
  }

  componentDidMount() {
    this.filterApprovals()
  }

  filterApprovals = () => {
    const { detail } = this.props
    const { approvals } = detail
    if (isEmpty(approvals)) {
      this.setState({
        approvalList: [],
      })
      return
    }
    const { current, inputValue } = this.state
    let approvalList = cloneDeep(approvals)
    if (inputValue) {
      approvalList = approvalList.filter(item => item.clientId.includes(inputValue))
    }
    this.setState({
      total: approvalList.length,
    })
    const from = (current - 1) * (DEFAULT_PAGESIZE / 2)
    const to = from + (DEFAULT_PAGESIZE / 2)
    approvalList = approvalList.slice(from, to)

    this.setState({
      approvalList,
    })
  }

  refreshData = () => {
    this.setState({
      current: DEFAULT_PAGE,
      inputValue: '',
    }, this.filterApprovals)
  }

  render() {
    const { current, inputValue, approvalList, total } = this.state
    const pagination = {
      simple: true,
      total,
      pageSize: DEFAULT_PAGESIZE / 2,
      current,
      onChange: current => this.setState({ current }, this.filterGroups),
    }
    const columns = [
      { title: '授权客户端 ID', dataIndex: 'clientId', key: 'clientId', width: '20%' },
      { title: '授权范围', dataIndex: 'scope', key: 'scope', width: '20%' },
      {
        title: '授权状态', dataIndex: 'status', key: 'status', width: '20%',
        render: text => <div className={text === 'APPROVED' ? 'success-status' : 'error-status'}>
          <Badge status={text === 'APPROVED' ? 'success' : 'error'}/>
          {text === 'APPROVED' ? '允许' : '拒绝'}
        </div>,
      },
      {
        title: '授权时间', dataIndex: 'lastUpdatedAt', key: 'lastUpdatedAt', width: '20%',
        render: time => formatDate(time),
      },
      {
        title: '授权过期时间', dataIndex: 'expiresAt', key: 'expiresAt', width: '20%',
        render: time => formatDate(time),
      },
    ]

    return (
      <div className="user-approvals">
        <div className="layout-content-btns">
          <Button icon={'reload'} type={'primary'} onClick={this.refreshData}>刷新</Button>
          <Search
            placeholder="请输入客户端 ID 搜索"
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.filterApprovals}
          />
          <div className={classNames('page-box', { hide: !total })}>
            <span className="total">共 {total} 条</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body">
          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={approvalList}
              pagination={false}
              rowKey={record => record.scope + record.lastUpdatedAt}
            />
          </Card>
        </div>
      </div>
    )
  }
}
