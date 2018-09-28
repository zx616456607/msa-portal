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
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import { formatDate, isUaaDefaultGroup } from '../../../../../../common/utils'
import {
  createGroup, getGroupList, deleteGroup, updateGroup,
  addGroupsUser, deleteGroupUser, ADD_GROUPS_DETAIL_USER_FAILURE,
  DELETE_GROUP_USER_FAILURE,
} from '../../../../../../actions/certification'
import confirm from '../../../../../../components/Modal/confirm'
import GroupsDetailDock from './Dock'
import GroupsModal from './GroupsModal'
import GroupUsersModal from './GroupUsersModal'
import { zoneUserListSlt } from '../../../../../../selectors/certification'

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

  openGroupUsersModal = record => {
    const targetKeys = []
    !isEmpty(record.members) && record.members.every(mem => {
      if (mem.type === 'USER') {
        targetKeys.push(mem.value)
      }
      return true
    })
    this.setState({
      currentGroup: record,
      targetKeys,
      originKeys: targetKeys,
      visibleGroupUser: true,
    })
  }

  handleAddGroupUsers = async addKeys => {
    const { addGroupsUser, zoneUsers } = this.props
    const { currentGroup } = this.state
    const currentUsers = zoneUsers.filter(user => addKeys.includes(user.id))
    const promiseArray = currentUsers.map(user => {
      const body = {
        origin: user.origin,
        type: 'USER',
        value: user.id,
      }
      return addGroupsUser(currentGroup.id, body)
    })
    const resultArray = await Promise.all(promiseArray)
    const failedArray = []
    resultArray.every(res => {
      const { type, value } = res.response.result
      if (type === ADD_GROUPS_DETAIL_USER_FAILURE) {
        failedArray.push(value)
      }
      return true
    })
    return failedArray
  }

  handleDelGroupUsers = async delKeys => {
    const { deleteGroupUser, zoneUsers } = this.props
    const { currentGroup } = this.state
    const currentUsers = zoneUsers.filter(user => delKeys.includes(user.id))
    const promiseArray = currentUsers.map(user => {
      return deleteGroupUser(currentGroup.id, user.id)
    })
    const resultArray = await Promise.all(promiseArray)
    const failedArray = []
    resultArray.every(res => {
      const { type, value } = res.response.result
      if (type === DELETE_GROUP_USER_FAILURE) {
        failedArray.push(value)
      }
      return true
    })
    return failedArray
  }

  handleOk = async () => {
    const { targetKeys, originKeys } = this.state
    const commonKeys = intersection(targetKeys, originKeys)
    const addKeys = difference(targetKeys, commonKeys)
    const delKeys = difference(originKeys, commonKeys)
    let addResult
    let delResult
    let failedMessage = ''
    this.setState({
      groupUsersLoading: true,
    })
    if (!isEmpty(addKeys)) {
      addResult = await this.handleAddGroupUsers(addKeys)
    }
    if (!isEmpty(delKeys)) {
      delResult = await this.handleDelGroupUsers(delKeys)
    }
    if (!isEmpty(addResult)) {
      failedMessage += `添加用户 ${addResult.toString()} 失败；\n`
    }
    if (!isEmpty(delResult)) {
      failedMessage += `移除用户 ${delResult.toString()} 失败；\n`
    }
    if (failedMessage) {
      notification.warn({
        message: failedMessage,
      })
    } else {
      notification.success({
        message: '操作成功',
      })
    }
    this.loadGroupList()
    this.setState({
      groupUsersLoading: false,
      visibleGroupUser: false,
    })
  }

  handleMenu = (e, record) => {
    switch (e.key) {
      case 'groupName':
        this.openGroupUsersModal(record)
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
    const { dataList, isFetching, zoneUsers, userCount } = this.props
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
        width: '16%',
        render: (text, record) => <a onClick={() => this.handleDetail(record)}>{text}</a>,
      },
      {
        title: '类型',
        width: '16%',
        key: 'isDefaultGroup',
        dataIndex: 'displayName',
        render: text => (isUaaDefaultGroup(text) ? '系统默认' : '自定义'),
      },
      {
        title: '用户（个）',
        dataIndex: 'members',
        key: 'members',
        width: '16%',
        render: (text, record) => (isUaaDefaultGroup(record.displayName) ? userCount : text.length),
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: '16%',
        render: desc => desc || '-',
      },
      {
        title: '创建时间',
        dataIndex: 'meta.created',
        key: 'meta.created',
        width: '16%',
        render: time => formatDate(time),
      },
      {
        title: '操作',
        width: '16%',
        render: record => {
          const menu = (
            <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e, record)}>
              <Menu.Item key="groupName" disabled={isUaaDefaultGroup(record.displayName)}>管理组用户</Menu.Item>
              <Menu.Item key="del" disabled={isUaaDefaultGroup(record.displayName)}>删除</Menu.Item>
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

    const {
      editData, editGroup, groupInfo, visibleModal,
      groupsDetailVisible, visibleGroupUser, targetKeys,
      groupUsersLoading,
    } = this.state
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
        {
          visibleGroupUser &&
          <GroupUsersModal
            visible={visibleGroupUser}
            onCancel={() => this.setState({ visibleGroupUser: false })}
            onOk={this.handleOk}
            dataSource={zoneUsers}
            targetKeys={targetKeys}
            handleChange={targetKeys => this.setState({ targetKeys })}
            loading={groupUsersLoading}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneGroups } = certification
  const { data, isFetching } = zoneGroups
  const { zoneUsers } = certification
  const { data: userData } = zoneUsers
  const { totalResults: userCount } = userData || { totalResults: 0 }
  const dataList = data || []
  return {
    dataList,
    isFetching,
    ...zoneUserListSlt(state),
    userCount,
  }
}

export default connect(mapStateToProps, {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupList,
  addGroupsUser,
  deleteGroupUser,
})(Form.create()(Groups))

