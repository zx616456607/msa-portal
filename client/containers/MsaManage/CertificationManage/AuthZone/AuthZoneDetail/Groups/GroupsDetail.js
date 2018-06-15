/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * GroupsDeatil of auth zones
 *
 * @author zhaoyb
 * @date 2018-06-07
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Row, Col, Menu, Dropdown, Card, notification } from 'antd'
import classNames from 'classnames'
import './style/groupsDetail.less'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import groupsIcon from '../../../../../../assets/img/msa-manage/groups.png'
import { getGroupDetail, deleteGroupUser, addGroupsUser } from '../../../../../../actions/certification'
import { formatDate } from '../../../../../../common/utils'
import { zoneUserListSlt } from '../../../../../../selectors/certification'
import confirm from '../../../../../../components/Modal/confirm'
import GroupsModal from './GroupsModal'
import GroupUsersModal from './GroupUsersModal'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'

class GroupsDetail extends React.Component {
  state = {
    targetKeys: [],
    visibleEdit: false,
    inputValue: '',
    visibleGroupUser: false,
  }

  componentDidMount() {
    this.loadGroupDetailList()
  }

  loadGroupDetailList = async () => {
    const { getGroupDetail, groupInfo, groupUsers } = this.props
    const query = {
      returnEntities: true,
    }
    await getGroupDetail(groupInfo.id, query)
    if (isEmpty(groupUsers)) {
      return
    }
    const targetKeys = []
    groupUsers.forEach(user => {
      if (user.type === 'USER') {
        targetKeys.push(user.value)
      }
    })
    this.setState({
      targetKeys,
      originKeys: targetKeys,
    })
  }

  handlDeleteUser = record => {
    const { deleteGroupUser, groupInfo } = this.props
    confirm({
      modalTitle: '删除',
      title: `确定移除用户 ${record.entity.userName}`,
      onOk: () => {
        return deleteGroupUser(groupInfo.id, record.value).then(res => {
          if (res.error) {
            notification.warn({
              message: `移除 ${record.entity.userName} 失败`,
            })
            return
          }
          notification.success({
            message: `移除 ${record.entity.userName} 成功`,
          })
          this.loadGroupDetailList()
        })
      },
    })
  }

  handlEditGroup = () => {
    this.setState({
      visibleEdit: true,
    })
  }

  handleMenu = () => {
    this.setState({
      visibleGroupUser: true,
    })
  }

  handleCancelModal = () => {
    this.setState({
      visibleEdit: false,
    })
  }

  handleChange = targetKeys => {
    this.setState({ targetKeys })
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1
  }

  handleOk = () => {
    const { targetKeys, originKeys } = this.state
    const commonKeys = intersection(targetKeys, originKeys)
    const addKeys = difference(targetKeys, commonKeys)
    const delKeys = difference(originKeys, commonKeys)
    if (!isEmpty(addKeys)) {
      if (addKeys.length > 1) {
        notification.warn({
          message: '只支持添加单个用户',
        })
        return
      }
      this.handleAddGroupUsers(addKeys)
    }
    if (!isEmpty(delKeys)) {
      if (delKeys.length > 1) {
        notification.warn({
          message: '只支持删除单个用户',
        })
        return
      }
      this.handleDelGroupUsers(delKeys)
    }
  }

  handleAddGroupUsers = addKeys => {
    const { addGroupsUser, groupInfo, zoneUsers } = this.props
    const currentUser = zoneUsers.filter(user => user.id === addKeys[0])[0]
    const objKey = {
      origin: currentUser.origin,
      type: 'USER',
      value: currentUser.id,
    }
    this.setState({
      groupUsersLoading: true,
    })
    addGroupsUser(groupInfo.id, objKey).then(res => {
      if (res.error) {
        notification.warn({
          message: '添加用户失败',
        })
        this.setState({
          groupUsersLoading: false,
        })
        return
      }
      notification.success({
        message: '添加用户成功',
      })
      this.setState({
        visibleGroupUser: false,
        groupUsersLoading: false,
      })
      this.loadGroupDetailList()
    })
  }

  handleDelGroupUsers = delKeys => {
    const { deleteGroupUser, groupInfo, zoneUsers } = this.props
    const currentUser = zoneUsers.filter(user => user.id === delKeys[0])[0]
    this.setState({
      groupUsersLoading: true,
    })
    deleteGroupUser(groupInfo.id, currentUser.id).then(res => {
      if (res.error) {
        notification.warn({
          message: '移出失败',
        })
        this.setState({
          groupUsersLoading: false,
        })
        return
      }
      this.setState({
        visibleGroupUser: false,
        groupUsersLoading: false,
      })
      notification.success({
        message: '移出成功',
      })
      this.loadGroupDetailList()
    })
  }

  handleCancel = () => {
    this.setState({
      visibleGroupUser: false,
    })
  }

  renderItem = item => {
    return (
      <Row key={`${item.id}`} style={{ display: 'inline-block', width: '100%' }}>
        <Col span={9} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.userName}</Col>
        <Col span={12} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.emails[0].value}</Col>
      </Row>
    )
  }

  render() {
    const { visibleGroupUser, visibleEdit, groupUsersLoading, targetKeys } = this.state
    const { groupInfo, groupUsers, isFetching, loadGroup, zoneUsers } = this.props

    const _DataAry = !isEmpty(groupUsers) && groupUsers.filter(item => item.type !== 'GROUP')
    const menu = (
      <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e)}>
        <Menu.Item key="groupName">管理组用户</Menu.Item>
      </Menu>
    )
    const pagination = {
      simple: true,
      total: _DataAry ? _DataAry.length : 0,
      pageSize: 10,
    }
    const columns = [
      {
        id: 'entity.id',
        title: '用户名',
        key: 'entity.userName',
        dataIndex: 'entity.userName',
        width: '40%',
      },
      {
        title: '用户来源',
        dataIndex: 'entity.origin',
        key: 'entity.origin',
        width: '40%',
      },
      {
        title: '操作',
        width: '20%',
        render: record => {
          return (
            <Button onClick={() => this.handlDeleteUser(record)}>移除用户</Button>
          )
        },
      },
    ]

    return (
      <QueueAnim className="groups-detail">
        <div className="groups-detail-header ant-row" key="title">
          <div className="groups-detail-header-icon">
            <img width="80" height="80" src={groupsIcon} alt="groups" />
          </div>
          <div className="groups-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">
                组：{groupInfo.id}
              </h2>
            </div>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  组名：{groupInfo.displayName}
                </div>
              </Col>
              <Col span={12} className="groups-detail-header-btns">
                <Dropdown.Button overlay={menu} onClick={() => this.handlEditGroup()}>
                  编辑
                </Dropdown.Button>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  创建时间：{formatDate(groupInfo.meta.created)}
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  描述：{groupInfo.description || '--'}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="groups-detail-body" key="body">
          <Card>
            <div className="title">
              <span>组用户</span>
            </div>
            <div className="layout-content-btns">
              <Button icon="reload" type="primary" onClick={this.loadGroupDetailList}>刷新</Button>
              {/* <Search
                placeholder="请输入客户端ID搜索"
                style={{ width: 200 }}
                onChange={e => this.setState({ inputValue: e.target.value })}
                onSearch={this.loadGroupDetailList}
              /> */}
              <div className={classNames('page-box', { hide: !_DataAry.length })}>
                <span className="total">共 {_DataAry.length} 条</span>
              </div>
            </div>
            <div className="layout-content-body">
              <Table
                columns={columns}
                loading={isFetching}
                dataSource={_DataAry}
                pagination={pagination}
                rowKey={record => record.value} />
            </div>
          </Card>
        </div>
        {
          visibleEdit &&
          <GroupsModal
            visible={visibleEdit}
            editGroup={true}
            editData={groupInfo}
            closeModal={this.handleCancelModal}
            loadGroup={loadGroup} />
        }
        {
          visibleGroupUser &&
          <GroupUsersModal
            visible={visibleGroupUser}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            dataSource={zoneUsers}
            targetKeys={targetKeys}
            handleChange={this.handleChange}
            loading={groupUsersLoading}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneGroupsDetail } = certification
  const { data: groupUsers, isFetching } = zoneGroupsDetail
  return {
    groupUsers,
    isFetching,
    ...zoneUserListSlt(state),
  }
}

export default connect(mapStateToProps, {
  addGroupsUser,
  getGroupDetail,
  deleteGroupUser,
})(GroupsDetail)

