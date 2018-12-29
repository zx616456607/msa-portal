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
import {
  Table, Button, Card, Input, Dropdown, Menu, Pagination, Badge,
  notification, Icon, Popover, Row, Col, Tooltip,
} from 'antd'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import { getUserList, deleteZoneUser, patchZoneUser } from '../../../../../../actions/certification'
import { zoneUserListSlt } from '../../../../../../selectors/certification'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from '../../../../../../constants/index'
import confirm from '../../../../../../components/Modal/confirm'
import { formatDate } from '../../../../../../common/utils'
import AddUserModal from './AddUserModal'
import UserDetailDock from './UserDetail/Dock'
import PasswordModal from './UserDetail/PasswordModal'
import { withNamespaces } from 'react-i18next'
import './style/index.less'

const Search = Input.Search

@withNamespaces('authZoneDetail')
class Users extends React.Component {
  state = {
    current: DEFAULT_PAGE,
  }

  componentDidMount() {
    this.loadUserList()
  }

  loadUserList = () => {
    const { getUserList } = this.props
    const { current, inputValue } = this.state
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
    getUserList(newQuery)
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
        currentUser: record ? record : null,
      }
    })
  }

  deleteUser = record => {
    const { deleteZoneUser, t } = this.props
    confirm({
      modalTitle: t('public.delete'),
      title: t('tabUser.deleteText', {
        replace: {
          userName: record.userName,
        },
      }),
      okText: t('public.confirm'),
      cancelText: t('public.cancel'),
      onOk: () => {
        return deleteZoneUser(record.id).then(res => {
          if (res.error) {
            notification.warn({
              message: t('public.deleteFailed'),
            })
            return
          }
          this.setState({
            currentUser: null,
          })
          notification.success({
            message: t('public.deleteSuccess'),
          })
          this.loadUserList()
        }).catch(() => {
          notification.warn({
            message: t('public.deleteFailed'),
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
      case 'password':
        this.toggleVisible('passwordVisible', record)
        break
      default:
        break
    }
  }

  toggleActive = record => {
    const { patchZoneUser, t } = this.props
    const text = record.active ? t('tabUser.disableUser') : t('tabUser.enableUser')
    const body = {
      active: !record.active,
    }
    confirm({
      modalTitle: text,
      title: t('tabUser.confirmText', {
        replace: {
          text,
          userName: record.userName,
        },
      }),
      okText: t('public.confirm'),
      cancelText: t('public.cancel'),
      onOk: () => {
        return patchZoneUser(record, body).then(res => {
          if (res.error) {
            notification.warn({
              message: t('tabUser.failedMsg', {
                replace: { text },
              }),
            })
            return
          }
          notification.success({
            message: t('tabUser.successMsg', {
              replace: { text },
            }),
          })
          this.loadUserList()
        }).catch(() => {
          notification.warn({
            message: t('tabUser.failedMsg', {
              replace: { text },
            }),
          })
        })
      },
    })
  }

  openUserDetailDock = record => {
    this.setState({
      currentUser: record,
      detailVisible: true,
    })
  }

  copyGroupName = cls => {
    const target = document.getElementsByClassName(cls)[0]
    target.select()
    document.execCommand('Copy')
    this.setState({
      [cls]: true,
    })
  }

  renderGroups = groups => {
    const { t } = this.props
    if (isEmpty(groups)) {
      return
    }
    return groups.map(group => {
      return (
        <Row key={group.value} type={'flex'} align={'middle'} gutter={16} className="zone-user-group-list">
          <Col span={20}>
            <Tooltip title={group.display} placement="topLeft">
              <Input
                className={`txt-of-ellipsis group-input group-${group.value}`}
                readOnly value={group.display}
              />
            </Tooltip>
          </Col>
          <Col span={4}>
            <Tooltip title={this.state[`group-${group.value}`] ? t('tabUser.copySuccess') : t('tabUser.clickToCopy')}>
              <Icon
                type="copy"
                className="pointer"
                onClick={() => this.copyGroupName(`group-${group.value}`)}
                onMouseLeave={() => this.setState({ [`group-${group.value}`]: false })}
              />
            </Tooltip>
          </Col>
        </Row>
      )
    })
  }

  render() {
    const {
      inputValue, current, addVisible, currentUser, detailVisible, passwordVisible,
    } = this.state
    const { zoneUsers, usersFetching, totalResults, t } = this.props
    const propsFunc = {
      toggleActive: this.toggleActive,
      handleClick: this.handleClick,
    }
    const pagination = {
      simple: true,
      total: totalResults || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      onChange: current => this.setState({ current }, this.loadUserList),
    }
    const columns = [
      {
        title: t('tabUser.userName'), dataIndex: 'userName', width: '15%',
        render: (text, record) =>
          <span
            className="primary-color pointer"
            onClick={() => this.openUserDetailDock(record)}
          >
            {text}
          </span>,
      },
      {
        title: t('tabUser.status'),
        dataIndex: 'active',
        key: 'active',
        width: '10%',
        render: text => <div className={text ? 'success-status' : 'error-status'}>
          <Badge status={text ? 'success' : 'error'}/>
          {text ? t('tabUser.enable') : t('tabUser.disable')}
        </div>,
      },
      {
        title: t('tabUser.group'),
        dataIndex: 'groups',
        key: 'groups',
        width: '10%',
        render: (groups, record) => <div className="popover-row">
          {groups.length}个 &nbsp;
          {
            !isEmpty(groups) &&
            <Popover
              onVisibleChange={ visible => this.setState({ [`popover-${record.id}`]: visible })}
              overlayClassName="user-popover"
              placement="right" trigger="click" content={this.renderGroups(groups)}
              getPopupContainer={() => document.getElementsByClassName('popover-row')[0]}
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
        title: t('tabUser.authRecord'),
        dataIndex: 'approvals',
        key: 'approvals',
        width: '10%',
        render: approvals => approvals.length,
      },
      {
        title: t('tabUser.email'),
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
      /* {
        title: '邮箱验证',
        dataIndex: 'verified',
        key: 'verified',
        width: '10%',
        render: text => <div className={text ? 'success-status' : 'error-status'}>
          {text ? '已验证' : '未验证'}
        </div>,
      },*/
      {
        title: t('public.creationTime'),
        dataIndex: 'meta.created',
        key: 'meta.created',
        width: '15%',
        render: time => formatDate(time),
      },
      {
        title: t('public.option'),
        width: '15%',
        render: (_, record) => {
          const menu = (
            <Menu style={{ width: 90 }} onClick={e => this.handleClick(e, record)}>
              <Menu.Item key="edit">{t('public.edit')}</Menu.Item>
              <Menu.Item key="delete">{t('public.delete')}</Menu.Item>
              <Menu.Item key="password" >{t('tabUser.updatePwd')}</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button overlay={menu} onClick={() => this.toggleActive(record)}>
              {record.active ? t('tabUser.disableUser') : t('tabUser.enableUser')}
            </Dropdown.Button>
          )
        },
      },
    ]

    return (
      <div className="zone-users">
        <div className="layout-content-btns" key="btns">
          <Button icon="plus" type="primary" onClick={() => this.toggleVisible('addVisible')}>
            {t('tabUser.addUser')}
          </Button>
          <Button icon="reload" onClick={this.refreshData}>
            {t('public.refresh')}
          </Button>
          <Search
            placeholder={t('tabUser.searchWithUserName')}
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.loadUserList}
          />
          <div className={classNames('page-box', { hide: !totalResults })}>
            <span className="total">{
              t('public.totalResults', {
                replace: { totalResults },
              })
            }</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card bordered={false} bodyStyle={{ padding: 0 }}>
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
            userList={zoneUsers}
            {...{ currentUser }}
            closeModal={() => this.setState({ addVisible: false })}
            loadData={this.loadUserList}
          />
        }
        {
          detailVisible &&
          <UserDetailDock
            visible={detailVisible}
            userId={currentUser && currentUser.id}
            onVisibleChange={visible => this.setState({ detailVisible: visible })}
            propsFunc={propsFunc}
          />
        }
        {
          passwordVisible &&
          <PasswordModal
            detail={currentUser}
            visible={passwordVisible}
            closeModal={() => this.toggleVisible('passwordVisible')}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneUsers } = certification
  const { data } = zoneUsers
  const { totalResults } = data || { totalResults: 0 }
  return {
    ...zoneUserListSlt(state),
    totalResults,
  }
}

export default connect(mapStateToProps, {
  getUserList,
  deleteZoneUser,
  patchZoneUser,
})(Users)
