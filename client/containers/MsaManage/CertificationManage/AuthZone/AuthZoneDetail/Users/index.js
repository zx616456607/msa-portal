/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Users of auth zones
 *
 * @author zhangxuan
 * @date 2018-06-04
 */
import React from 'react'
import { connect } from 'react-redux'
import { Table, Button, Card, Input, Dropdown, Menu, Pagination, Badge, notification } from 'antd'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import { getUserList, deleteZoneUser, patchZoneUser } from '../../../../../../actions/certification'
import { zoneUserListSlt } from '../../../../../../selectors/certification'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from '../../../../../../constants/index'
import confirm from '../../../../../../components/Modal/confirm'
import { formatDate } from '../../../../../../common/utils'
import AddUserModal from './AddUserModal'
import './style/index.less'

const Search = Input.Search

class Users extends React.Component {
  state = {
    current: DEFAULT_PAGE,
  }

  componentDidMount() {
    this.loadUserList()
  }

  loadUserList = () => {
    const { getUserList, identityZoneDetail } = this.props
    const { current, inputValue } = this.state
    const { id, subdomain } = identityZoneDetail
    const zoneInfo = {
      id,
      subdomain,
    }
    const newQuery = {}
    if (inputValue) {
      Object.assign(newQuery, {
        filter: `username+eq+\"${inputValue}\"`,
      })
    }
    Object.assign(newQuery, {
      startIndex: (current - 1) * DEFAULT_PAGESIZE + 1,
      count: DEFAULT_PAGESIZE,
    })
    getUserList(newQuery, zoneInfo)
  }

  refreshData = () => {
    this.setState({
      current: DEFAULT_PAGE,
      inputValue: '',
    }, this.loadUserList)
  }

  toggleVisible = (key, record) => {
    this.setState(preState => {
      return {
        [key]: !preState[key],
        currentUser: preState[key] ? null : record,
      }
    })
  }

  deleteUser = record => {
    const { deleteZoneUser } = this.props
    confirm({
      modalTitle: '删除',
      title: `确定删除用户 ${record.userName}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return deleteZoneUser(record.id).then(res => {
          if (res.error) {
            notification.warn({
              message: '删除失败',
            })
            return
          }
          notification.success({
            message: '删除成功',
          })
          this.loadUserList()
        }).catch(() => {
          notification.warn({
            message: '删除失败',
          })
        })
      },
    })
  }

  handleClick = (e, record) => {
    switch (e.key) {
      case 'edit':
        this.toggleVisible('addVisible', record)
        break
      case 'delete':
        this.deleteUser(record)
        break
      default:
        break
    }
  }

  toggleActive = record => {
    const { patchZoneUser } = this.props
    const text = record.active ? '停用' : '启用'
    const body = {
      active: !record.active,
    }
    confirm({
      modalTitle: text,
      title: `确定${text}用户 ${record.userName}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return patchZoneUser(record, body).then(res => {
          if (res.error) {
            notification.warn({
              message: `${text}失败`,
            })
            return
          }
          notification.success({
            message: `${text}成功`,
          })
          this.loadUserList()
        }).catch(() => {
          notification.warn({
            message: `${text}失败`,
          })
        })
      },
    })
  }

  render() {
    const { inputValue, current, addVisible, currentUser } = this.state
    const { zoneUsers, usersFetching, totalResults } = this.props
    const pagination = {
      simple: true,
      total: totalResults || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      onChange: current => this.setState({ current }, this.loadUserList),
    }
    const columns = [
      { title: '用户名', dataIndex: 'userName', width: '15%',
        render: text => <span className="primary-color pointer">{text}</span> },
      {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        width: '10%',
        render: text => <div className={text ? 'success-status' : 'error-status'}>
          <Badge status={text ? 'success' : 'error'}/>
          {text ? '可用' : '不可用'}
        </div>,
      },
      {
        title: '所属组',
        dataIndex: 'groups',
        key: 'groups',
        width: '10%',
        render: groups => groups.length,
      },
      {
        title: '授权记录',
        dataIndex: 'approvals',
        key: 'approvals',
        width: '10%',
        render: approvals => approvals.length,
      },
      {
        title: '邮箱',
        dataIndex: 'emails',
        key: 'emails',
        width: '15%',
        render: text => <div>
          {
            !isEmpty(text)
              ?
              text.map(item => <div key={item.value}>{item.value}</div>)
              :
              '-'
          }
        </div>,
      },
      {
        title: '邮箱验证',
        dataIndex: 'verified',
        key: 'verified',
        width: '10%',
        render: text => <div className={text ? 'success-status' : 'error-status'}>
          {text ? '已验证' : '未验证'}
        </div>,
      },
      {
        title: '创建时间',
        dataIndex: 'meta.created',
        key: 'meta.created',
        width: '15%',
        render: time => formatDate(time),
      },
      {
        title: '操作',
        width: '15%',
        render: (_, record) => {
          const menu = (
            <Menu style={{ width: 90 }} onClick={e => this.handleClick(e, record)}>
              <Menu.Item key="edit">编辑</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button overlay={menu} onClick={() => this.toggleActive(record)}>
              {record.active ? '可用' : '不可用'}
            </Dropdown.Button>
          )
        },
      },
    ]

    return (
      <div className="zone-users">
        <div className="layout-content-btns" key="btns">
          <Button icon="plus" type="primary" onClick={() => this.toggleVisible('addVisible')}>
            添加用户
          </Button>
          <Button icon="reload" onClick={this.refreshData}>
            刷新
          </Button>
          <Search
            placeholder="按用户名搜索"
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.loadUserList}
          />
          <div className={classNames('page-box', { hide: !totalResults })}>
            <span className="total">共 {totalResults} 条</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={zoneUsers}
              pagination={false}
              loading={usersFetching}
              rowKey={record => record.id}
            />
          </Card>
        </div>
        {
          addVisible &&
          <AddUserModal
            visible={addVisible}
            {...{ currentUser }}
            closeModal={() => this.toggleVisible('addVisible')}
            loadData={this.loadUserList}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneUsers, identityZoneDetail } = certification
  const { data } = zoneUsers
  const { totalResults } = data || { totalResults: 0 }
  return {
    ...zoneUserListSlt(state),
    totalResults,
    identityZoneDetail,
  }
}

export default connect(mapStateToProps, {
  getUserList,
  deleteZoneUser,
  patchZoneUser,
})(Users)
