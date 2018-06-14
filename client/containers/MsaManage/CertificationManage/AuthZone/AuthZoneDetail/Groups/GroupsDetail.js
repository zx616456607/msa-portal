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
import { Button, Table, Row, Col, Menu, Dropdown, Card, Transfer, Modal, Popover, Icon, Tooltip, notification } from 'antd'
import classNames from 'classnames'
import './style/groupsDetail.less'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import groupsIcon from '../../../../../../assets/img/msa-manage/groups.png'
import { getGroupDetail, DelGroupDetailUser, addGroupsUser } from '../../../../../../actions/certification'
import { formatDate } from '../../../../../../common/utils'
import { zoneUserListSlt } from '../../../../../../selectors/certification'
import GroupsModal from './GroupsModal'

class GroupsDetail extends React.Component {
  state = {
    userInfo: [],
    targetKeys: [],
    visibleEdit: false,
    inputValue: '',
    visibleGroupUser: false,
  }

  componentDidMount() {
    this.loadGroupDetailList()
  }

  loadGroupDetailList = () => {
    const { getGroupDetail, groupInfo } = this.props
    const query = {
      returnEntities: true,
    }
    getGroupDetail(groupInfo.id, query)

  }

  handlDeleteUser = record => {
    const { DelGroupDetailUser, groupInfo } = this.props
    const query = {
      id: groupInfo.id,
      userId: record.value,
    }
    DelGroupDetailUser(query).then(res => {
      if (res.error) {
        notification.warn({
          message: `移除 ${record.entity.userName} 失败`,
        })
      }
      notification.success({
        message: `移除 ${record.entity.userName} 成功`,
      })
      this.loadGroupDetailList()
    })
  }

  handlEditGroup = () => {
    this.setState({
      visibleEdit: true,
    })
  }

  handleMenu = () => {
    this.filterUserKey()
    this.setState({
      visibleGroupUser: true,
    })
  }

  handleCancelModal = () => {
    this.setState({
      visibleEdit: false,
    })
  }

  filterUserKey = () => {
    const { zoneUsers } = this.props
    zoneUsers.forEach((item, index) => {
      item.key = index
    })
    this.setState({
      userInfo: zoneUsers,
    })
  }

  filterScope = record => {
    const { UserList } = this.props
    if (!UserList) return
    const { approvals } = UserList[record.value] || []
    if (approvals.length === 0) return <div>--</div>
    return approvals.map(item => {
      return (
        <Row key={item.scope} type={'flex'} align={'middle'} gutter={16} className="group-scope-list">
          <Tooltip placement="topLeft">
            <div>{item.scope}</div>
          </Tooltip>
        </Row>
      )
    })
  }

  handleChange = targetKeys => {
    this.setState({ targetKeys })
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1
  }

  handleOk = () => {
    const { targetKeys } = this.state
    const { addGroupsUser, groupInfo, zoneUsers } = this.props
    if (targetKeys.length > 1) {
      notification.warn({
        message: '只支持添加单个用户',
      })
      return
    }
    const objKey = {
      origin: zoneUsers[targetKeys[0]].origin,
      type: 'USER',
      value: zoneUsers[targetKeys[0]].id,
    }
    addGroupsUser(groupInfo.id, objKey).then(res => {
      if (res.error) {
        notification.warn({
          message: '添加用户失败',
        })
      }
      notification.success({
        message: '添加用户成功',
      })
      this.setState({
        visibleGroupUser: false,
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
      <Row key={`${item && item.key}`} style={{ display: 'inline-block', width: '100%' }}>
        <Col span={9} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.userName}</Col>
        <Col span={12} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.emails[0].value}</Col>
      </Row>
    )
  }

  render() {
    const { visibleGroupUser, userInfo, visibleEdit } = this.state
    const { groupInfo, DataAry, isFetching, loadGroup } = this.props
    const _DataAry = DataAry.filter(item => item.type !== 'GROUP')
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
        width: '14%',
      },
      {
        title: '授权范围',
        dataIndex: 'approvals',
        key: 'approvals',
        width: '10%',
        render: (text, record) => <div className="popover-row">
          {
            !isEmpty(record) &&
            <Popover
              onVisibleChange={visible => this.setState({ [`popover-${record.id}`]: visible })}
              placement="right" trigger="click" content={this.filterScope(record)}
            >
              <Icon
                type={this.state[`popover-${record.id}`] ? 'minus-square-o' : 'plus-square-o'}
                className="pointer"
              />
            </Popover>
          }
        </div>,
      },
      {
        title: '用户来源',
        dataIndex: 'entity.origin',
        key: 'entity.origin',
        width: '15%',
      },
      {
        title: '操作',
        width: '15%',
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
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  所属服务组：--
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
                rowKey={key => key.id} />
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
        <Modal
          title="管理组用户"
          visible={visibleGroupUser}
          width={'42%'}
          className="modalTransfer"
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div className="prompt" style={{ backgroundColor: '#fffaf0', borderRadius: 4, border: '1px dashed #ffc125' }}>
            <span>用户加入后，即拥有改组的授权范围中的权限，一个组内同一用户不能被重复添加</span>
          </div>
          <Row className="listTitle">
            <Col span={14}>成员名</Col>
            <Col span={10}>邮箱</Col>
          </Row>
          <Row className="listTitle" style={{ left: 380 }}>
            <Col span={14}>成员名</Col>
            <Col span={10}>邮箱</Col>
          </Row>
          <Transfer
            dataSource={userInfo}
            showSearch
            titles={[ '筛选用户', '已选择用户' ]}
            listStyle={{ width: 250, height: 300 }}
            operations={[ '添加', '移除' ]}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => this.renderItem(item)}
            footer={this.renderFooter}
          />
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { uaaZoneUsers } = state.entities
  const { zoneGroupsDetail } = certification
  const { data, isFetching } = zoneGroupsDetail
  const UserList = uaaZoneUsers
  const DataAry = []
  if (data !== undefined) {
    Object.keys(data).forEach((item, index) => {
      DataAry.push(data[index])
    })
  }

  return {
    DataAry,
    UserList,
    isFetching,
    ...zoneUserListSlt(state),
  }
}

export default connect(mapStateToProps, {
  addGroupsUser,
  getGroupDetail,
  DelGroupDetailUser,
})(GroupsDetail)

