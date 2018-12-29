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
import { withNamespaces } from 'react-i18next'
import './style/UserGroups.less'

const Search = Input.Search

@withNamespaces('authZoneDetail')
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
    const { deleteGroupUser, detail, getUserList, t } = this.props
    confirm({
      modalTitle: t('userDetail.removeTitle'),
      title: t('userDetail.removeText', {
        replace: {
          userName: detail.userName,
          group: detail.group,
        },
      }),
      okText: t('public.confirm'),
      cancelText: t('public.cancel'),
      onOk: () => {
        return deleteGroupUser(record.value, detail.id).then(res => {
          if (res.error) {
            notification.warn({
              message: t('userDetail.removeFailed'),
            })
            return
          }
          getUserList()
          notification.success({
            message: t('userDetail.removeSuccess'),
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
    const { t } = this.props
    const pagination = {
      simple: true,
      total,
      pageSize: DEFAULT_PAGESIZE / 2,
      current,
      onChange: current => this.setState({ current }, this.filterGroups),
    }
    const columns = [
      { title: t('userDetail.groupName'), dataIndex: 'display', key: 'display', width: '70%' },
      {
        title: t('public.option'), width: '30%',
        render: (_, record) =>
          <Button type="danger" ghost onClick={() => this.removeUser(record)}>{t('userDetail.removeFromGroup')}</Button>,
      },
    ]
    return (
      <div className="user-groups">
        <div className="layout-content-btns">
          <Button icon={'reload'} type={'primary'} onClick={this.refreshData}>{t('userDetail.refresh')}</Button>
          <Search
            placeholder={t('userDetail.searchWithGroupName')}
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.filterGroups}
          />
          <div className={classNames('page-box', { hide: !total })}>
            <span className="total">
              {t('public.totalResults', {
                replace: { totalResults: total },
              })}
            </span>
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
