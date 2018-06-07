/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Zone group list of user
 *
 * @author zhangxuan
 * @date 2018-06-07
 */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Input, Table, Pagination, Card, notification } from 'antd'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { DEFAULT_PAGESIZE, DEFAULT_PAGE } from '../../../../../../../constants'
import { deleteGroupUser, getUserList } from '../../../../../../../actions/certification'
import confirm from '../../../../../../../components/Modal/confirm'
import './style/UserGroups.less'

const Search = Input.Search

class UserGroups extends React.Component {
  state = {
    current: DEFAULT_PAGE,
    groupList: [],
    total: 0,
  }

  componentDidMount() {
    this.filterGroups()
  }

  filterGroups = () => {
    const { detail } = this.props
    const { groups } = detail
    if (isEmpty(groups)) {
      this.setState({
        groupList: [],
      })
      return
    }
    const { current, inputValue } = this.state
    let groupList = cloneDeep(groups)
    if (inputValue) {
      groupList = groupList.filter(item => item.display.includes(inputValue))
    }
    this.setState({
      total: groupList.length,
    })
    const from = (current - 1) * (DEFAULT_PAGESIZE / 2)
    const to = from + (DEFAULT_PAGESIZE / 2)
    groupList = groupList.slice(from, to)

    this.setState({
      groupList,
    })
  }

  removeUser = record => {
    const { deleteGroupUser, detail, getUserList } = this.props
    confirm({
      modalTitle: '移出',
      title: `确定将用户 ${detail.userName} 从组 ${record.display} 中移出？`,
      onOk: () => {
        return deleteGroupUser(record.value, detail.id).then(res => {
          if (res.error) {
            notification.warn({
              message: '移出失败',
            })
            return
          }
          getUserList()
          notification.success({
            message: '移出成功',
          })
        })
      },
    })
  }

  refreshData = () => {
    this.setState({
      current: DEFAULT_PAGE,
      inputValue: '',
    }, this.filterGroups)
  }

  render() {
    const { current, inputValue, groupList, total } = this.state
    const pagination = {
      simple: true,
      total,
      pageSize: DEFAULT_PAGESIZE / 2,
      current,
      onChange: current => this.setState({ current }, this.filterGroups),
    }
    const columns = [
      { title: '组名称', dataIndex: 'display', key: 'display', width: '70%' },
      {
        title: '操作', width: '30%',
        render: (_, record) =>
          <Button type="danger" ghost onClick={() => this.removeUser(record)}>移出该组</Button>,
      },
    ]
    return (
      <div className="user-groups">
        <div className="layout-content-btns">
          <Button icon={'reload'} type={'primary'} onClick={this.refreshData}>刷新</Button>
          <Search
            placeholder="请输入组名称搜索"
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.filterGroups}
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
              dataSource={groupList}
              pagination={false}
              rowKey={record => record.value}
            />
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(null, {
  deleteGroupUser,
  getUserList,
})(UserGroups)
