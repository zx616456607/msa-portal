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
import {
  getGroupDetail,
  deleteGroupUser,
  addGroupsUser,
  getGroupList,
  ADD_GROUPS_DETAIL_USER_FAILURE, DELETE_GROUP_USER_FAILURE,
} from '../../../../../../actions/certification'
import { formatDate, isUaaDefaultGroup } from '../../../../../../common/utils'
import { zoneUserListSlt, zoneGroupUserListSlt } from '../../../../../../selectors/certification'
import confirm from '../../../../../../components/Modal/confirm'
import GroupsModal from './GroupsModal'
import GroupUsersModal from './GroupUsersModal'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import { withNamespaces } from 'react-i18next'

@withNamespaces('authZoneDetail')
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
    const { getGroupDetail, groupInfo } = this.props
    const query = {
      returnEntities: true,
    }
    await getGroupDetail(groupInfo.id, query)
    const { zoneGroupUsers } = this.props
    const targetKeys = []
    if (isEmpty(zoneGroupUsers)) {
      this.setState({
        targetKeys: [],
        originKeys: [],
      })
      return
    }
    zoneGroupUsers.forEach(user => {
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
    const { deleteGroupUser, groupInfo, getGroupList, t } = this.props
    confirm({
      modalTitle: t('public.delete'),
      title: t('groupDetail.removeUserText', {
        replace: { userName: record.entity.userName },
      }),
      okText: t('public.confirm'),
      cancelText: t('public.cancel'),
      onOk: () => {
        return deleteGroupUser(groupInfo.id, record.value).then(res => {
          if (res.error) {
            notification.warn({
              message: t('groupDetail.removeUserFailed', {
                replace: { userName: record.entity.userName },
              }),
            })
            return
          }
          notification.success({
            message: t('groupDetail.removeUserFailed', {
              replace: { userName: record.entity.userName },
            }),
          })
          this.loadGroupDetailList()
          getGroupList()
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

  handleOk = async () => {
    const { targetKeys, originKeys } = this.state
    const { getGroupList, t } = this.props
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
      if (addResult.includes(409)) {
        failedMessage += t('tabGroup.notAllowAddUser')
      } else {
        failedMessage += `${t('tabGroup.addUserFailed', {
          replace: {
            userName: addResult.toString(),
          },
        })}\n`
      }
    }
    if (!isEmpty(delResult)) {
      failedMessage += `${t('tabGroup.removeUserFailed', {
        replace: {
          userName: addResult.toString(),
        },
      })}\n`
    }
    if (failedMessage) {
      notification.warn({
        message: failedMessage,
      })
    } else {
      notification.success({
        message: t('tabGroup.success'),
      })
    }
    this.loadGroupDetailList()
    getGroupList()
    this.setState({
      groupUsersLoading: false,
      visibleGroupUser: false,
    })
  }

  handleAddGroupUsers = async addKeys => {
    const { addGroupsUser, groupInfo, zoneUsers } = this.props
    const currentUsers = zoneUsers.filter(user => addKeys.includes(user.id))
    const promiseArray = currentUsers.map(user => {
      const body = {
        origin: user.origin,
        type: 'USER',
        value: user.id,
      }
      return addGroupsUser(groupInfo.id, body, { isHandleError: true })
    })
    const resultArray = await Promise.all(promiseArray)
    const failedArray = []
    resultArray.every(res => {
      const { type, status } = res
      if (status === 409) {
        failedArray.push(status)
      } else {
        const { value } = res.response.result
        if (type === ADD_GROUPS_DETAIL_USER_FAILURE) {
          failedArray.push(value)
        }
      }
      return true
    })
    return failedArray
  }

  handleDelGroupUsers = async delKeys => {
    const { deleteGroupUser, groupInfo, zoneUsers } = this.props
    const currentUsers = zoneUsers.filter(user => delKeys.includes(user.id))
    const promiseArray = currentUsers.map(user => {
      return deleteGroupUser(groupInfo.id, user.id)
    })
    const resultArray = await Promise.all(promiseArray)
    const failedArray = []
    resultArray.every(res => {
      const { type } = res
      const { value } = res.response.result
      if (type === DELETE_GROUP_USER_FAILURE) {
        failedArray.push(value)
      }
      return true
    })
    return failedArray
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
    const { groupInfo, zoneGroupUsers, groupUsersFetching, loadGroup, zoneUsers, t } = this.props
    const _DataAry = !isEmpty(zoneGroupUsers) ? zoneGroupUsers.filter(item => item.type !== 'GROUP') : []
    const menu = (
      <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e)}>
        <Menu.Item key="groupName">{t('tabGroup.manageGroupUser')}</Menu.Item>
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
        title: t('tabUser.userName'),
        key: 'entity.userName',
        dataIndex: 'entity.userName',
        width: '40%',
      },
      {
        title: t('groupDetail.userResource'),
        dataIndex: 'entity.origin',
        key: 'entity.origin',
        width: '40%',
      },
      {
        title: t('public.option'),
        width: '20%',
        render: record => {
          return (
            <Button onClick={() => this.handlDeleteUser(record)}>{t('groupDetail.removeUser')}</Button>
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
                {t('groupDetail.group')}：{groupInfo.id}
              </h2>
            </div>
            <Row>
              <Col span={9}>
                <div className="txt-of-ellipsis">
                  {t('tabGroup.groupName')}：{groupInfo.displayName}
                </div>
              </Col>
              <Col span={12} className="groups-detail-header-btns">
                {
                  !isUaaDefaultGroup(groupInfo.displayName) &&
                  <Dropdown.Button overlay={menu} onClick={() => this.handlEditGroup()}>
                    {t('public.edit')}
                  </Dropdown.Button>
                }
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  {t('public.creationTime')}：{formatDate(groupInfo.meta.created)}
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  {t('public.description')}：{groupInfo.description || '--'}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="groups-detail-body" key="body">
          <Card>
            <div className="title">
              <span>{t('groupDetail.groupUsers')}</span>
            </div>
            <div className="layout-content-btns">
              <Button icon="reload" type="primary" onClick={this.loadGroupDetailList}>{t('public.refresh')}</Button>
              {/* <Search
                placeholder="请输入客户端ID搜索"
                style={{ width: 200 }}
                onChange={e => this.setState({ inputValue: e.target.value })}
                onSearch={this.loadGroupDetailList}
              /> */}
              <div className={classNames('page-box', { hide: !_DataAry.length })}>
                <span className="total">{
                  t('public.totalResults', {
                    replace: { totalResults: _DataAry.length },
                  })
                }</span>
              </div>
            </div>
            <div className="layout-content-body">
              <Table
                columns={columns}
                loading={groupUsersFetching}
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
  return {
    ...zoneUserListSlt(state),
    ...zoneGroupUserListSlt(state),
  }
}

export default connect(mapStateToProps, {
  addGroupsUser,
  getGroupDetail,
  deleteGroupUser,
  getGroupList,
})(GroupsDetail)

