/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Groups of auth zones
 *
 * @author zhaoyb
 * @date 2018-06-06
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Menu, Dropdown, Form, notification } from 'antd'
import { DEFAULT_PAGESIZE } from '../../../../../../constants/index'
import './style/index.less'
import classNames from 'classnames'
import { formatDate } from '../../../../../../common/utils'
import { createGroup, getGroupList,
  deleteGroup, updateGroup } from '../../../../../../actions/certification'
import confirm from '../../../../../../components/Modal/confirm'
import GroupsDetailDock from './Dock'
import GroupsModal from './GroupsModal'

const Search = Input.Search

class Groups extends React.Component {

  state = {
    groupInfo: {},
    editData: {},
    editGroup: false,
    visibleModal: false,
    inputValue: '',
    groupsDetailVisible: false,
  }

  componentDidMount() {
    this.loadGroupList()
  }

  loadGroupList = () => {
    const { inputValue } = this.state
    const { getGroupList } = this.props
    const queryInfo = {}
    if (inputValue) {
      Object.assign(queryInfo, {
        filter: `displayName+eq+\"${inputValue}\"`,
      })
    }
    getGroupList(queryInfo)
  }

  handleAddGroup = () => {
    this.setState({
      visibleModal: true,
      editGroup: false,
    })
  }

  handleMenu = (e, record) => {
    switch (e.key) {
      case 'groupName':
        return
      case 'del':
        this.handleDeleteGroup(record)
        return
      default:
        break
    }
  }

  handleDeleteGroup = record => {
    const { deleteGroup } = this.props
    confirm({
      modalTitle: '删除',
      title: `确定删除组 ${record.displayName}`,
      onOk: () => {
        return deleteGroup(record.id).then(res => {
          if (res.error) {
            notification.warn({
              message: `${record.displayName}删除失败`,
            })
            return
          }
          notification.success({
            message: `${record.displayName}删除成功`,
          })
          this.loadGroupList()
        })
      },
    })
  }

  handlEditGroup = record => {
    this.setState({
      visibleModal: true,
      editGroup: true,
      editData: record,
    })
  }

  handleCancel = () => {
    this.setState({
      visibleModal: false,
    })
  }

  handleDetail = record => {
    this.setState({
      groupInfo: record,
      groupsDetailVisible: true,
    })
  }

  render() {
    const { dataList, isFetching } = this.props
    const { resources, totalResults } = dataList
    const pagination = {
      simple: true,
      total: totalResults || 0,
      pageSize: DEFAULT_PAGESIZE,
      // onChange: current => this.setState({ current }, this.loadGroupList),
    }
    const columns = [
      {
        id: 'id',
        title: '组名',
        key: 'displayName',
        dataIndex: 'displayName',
        width: '20%',
        render: (text, record) => <a onClick={() => this.handleDetail(record)}>{text}</a>,
      },
      {
        title: '用户（个）',
        dataIndex: 'members',
        key: 'members',
        width: '20%',
        render: text => <div>{text.length}</div>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
        render: desc => desc || '-',
      },
      {
        title: '创建时间',
        dataIndex: 'meta.created',
        key: 'meta.created',
        width: '20%',
        render: time => formatDate(time),
      },
      {
        title: '操作',
        width: '20%',
        render: record => {
          const menu = (
            <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e, record)}>
              <Menu.Item key="groupName">管理组用户</Menu.Item>
              <Menu.Item key="del">删除</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button overlay={menu} onClick={() => this.handlEditGroup(record)}>
              编辑
            </Dropdown.Button>
          )
        },
      },
    ]

    const { editData, editGroup, groupInfo, visibleModal, groupsDetailVisible } = this.state
    return (
      <div className="zone-groups">
        <div className="layout-content-btns" key="btns">
          <Button icon="plus" type="primary" onClick={this.handleAddGroup}>添加组</Button>
          <Button icon="reload" onClick={this.loadGroupList}>刷新</Button>
          <Search
            placeholder="请输入组名搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.loadGroupList}
          />
          <div className={classNames('page-box', { hide: !totalResults })}>
            <span className="total">共 {totalResults} 条</span>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Table
            columns={columns}
            pagination={pagination}
            loading={isFetching}
            dataSource={resources || []}
            rowKey={key => key.id} />
        </div>
        {
          groupsDetailVisible &&
          <GroupsDetailDock
            groupInfo={groupInfo}
            visible={groupsDetailVisible}
            closeModal={this.handleCancel}
            loadGroup={this.loadGroupList}
            onVisibleChange={visible => this.setState({ groupsDetailVisible: visible })}
          />
        }
        {
          visibleModal &&
          <GroupsModal
            visible={visibleModal}
            editGroup={editGroup}
            editData={editData}
            closeModal={this.handleCancel}
            loadGroup={this.loadGroupList} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneGroups } = certification
  const { uaaZoneUsers } = state.entities
  const { data, isFetching } = zoneGroups
  const UserList = uaaZoneUsers
  const dataList = data || []
  return {
    UserList,
    dataList,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupList,
})(Form.create()(Groups))

