/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Clients container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Card, Table, Button, Input, notification } from 'antd'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import { getClientList, deleteClient } from '../../../../../../actions/certification'
import { clientListSlt } from '../../../../../../selectors/certification'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from '../../../../../../constants/index'
import AddClientModal from './AddClientModal'
import SecretModal from './SecretModal'
import confirm from '../../../../../../components/Modal/confirm'
import './style/index.less'
import { withNamespaces } from 'react-i18next'

const Search = Input.Search

@withNamespaces('authZoneDetail')
class Clients extends React.Component {
  state = {
    visible: false,
    current: DEFAULT_PAGE,
  }

  componentDidMount() {
    this.loadClientList()
  }

  loadClientList = () => {
    const { getClientList } = this.props
    const { current, inputValue } = this.state
    const newQuery = {}
    if (inputValue) {
      Object.assign(newQuery, {
        filter: `client_id+eq+\"${inputValue}\"`,
      })
    }
    Object.assign(newQuery, {
      startIndex: (current - 1) * DEFAULT_PAGESIZE + 1,
      count: DEFAULT_PAGESIZE,
    })
    getClientList(newQuery)
  }

  refreshData = () => {
    this.setState({
      current: DEFAULT_PAGE,
      inputValue: '',
    }, this.loadClientList)
  }

  toggleVisible = (record, isView) => {
    this.setState(preState => {
      const newState = { visible: !preState.visible, isView }
      if (preState.visible) {
        Object.assign(newState, { currentClient: null, isView: false })
      } else {
        Object.assign(newState, { currentClient: record ? record : null })
      }
      return newState
    })
  }

  toggleSecretVisible = record => {
    this.setState(preState => {
      const newState = {
        secretVisible: !preState.secretVisible,
        currentClient: preState.secretVisible ? null : record,
      }
      return newState
    })
  }

  editClient = record => {
    this.toggleVisible(record)
  }

  viewClient = record => {
    this.toggleVisible(record, true)
  }

  deleteClient = record => {
    const { deleteClient, t } = this.props
    confirm({
      modalTitle: t('public.delete'),
      title: t('tabOAuth.deleteMsg', { app: record.client_id }),
      okText: t('public.confirm'),
      cancelText: t('public.cancel'),
      onOk: () => {
        return deleteClient(record.client_id).then(() => {
          notification.success({
            message: t('tabOAuth.deleteSuccess'),
          })
          this.loadClientList()
        }).catch(() => {
          notification.warn({
            message: t('tabOAuth.deleteFailed'),
          })
        })
      },
    })
  }

  handleClick = (e, record) => {
    switch (e.key) {
      case 'edit':
        this.editClient(record)
        break
      case 'delete':
        this.deleteClient(record)
        break
      case 'secret':
        this.toggleSecretVisible(record)
        break
      default:
        break
    }
  }

  renderTableCol = text => {
    if (isEmpty(text)) {
      return '--'
    }
    return text.map(item => <div key={item}>{item}</div>)
  }

  render() {
    const { current, isView } = this.state
    const { clientList, totalResults, isFetching, t } = this.props
    const columns = [
      {
        title: 'ID',
        dataIndex: 'client_id',
        key: 'client_id',
        width: '20%',
        render: (text, record) =>
          <span className="primary-color pointer" onClick={() => this.viewClient(record)}>{text}</span>,
      },
      {
        title: t('public.OAuthApp'),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: text => (text ? text : '--'),
      },
      {
        title: t('tabOAuth.redirectUrl'),
        dataIndex: 'redirect_uri',
        key: 'redirect_uri',
        width: '20%',
        render: this.renderTableCol,
      },
      {
        title: t('tabOAuth.authMethod'),
        dataIndex: 'authorized_grant_types',
        key: 'authorized_grant_types',
        width: '20%',
        render: this.renderTableCol,
      },
      {
        title: t('public.option'),
        dataIndex: 'action',
        key: 'action',
        width: '20%',
        render: (_, record) => {
          return (
            <Button type={'default'} onClick={() => this.viewClient(record)}>{t('tabOAuth.check')}</Button>
          )
          // return ( // 只保留查看, 暂时隐藏
          //   <Dropdown.Button
          //     className="client-dropdown"
          //     onClick={() => this.viewClient(record)}
          //     overlay={
          //       <Menu style={{ width: 120 }} onClick={e => this.handleClick(e, record)}>
          //         <Menu.Item key="edit">编辑</Menu.Item>
          //         <Menu.Item key="delete">删除</Menu.Item>
          //         <Menu.Item key="secret">修改客户端 Secret</Menu.Item>
          //       </Menu>
          //     }
          //   >
          //     查看
          //   </Dropdown.Button>
          // )
        },
      },
    ]
    const pagination = {
      simple: true,
      total: totalResults || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      onChange: current => this.setState({ current }, this.loadClientList),
    }
    const { visible, currentClient, inputValue, secretVisible } = this.state
    return (
      <QueueAnim className="certification-clients">
        <div className="layout-content-btns" key="btns">
          {/* <Button icon="plus" type="primary" onClick={() => this.toggleVisible()}> // 隐藏添加应用按钮
            添加 OAuth 应用
          </Button> */}
          <Button icon="reload" onClick={this.refreshData}>
            {t('public.refresh')}
          </Button>
          <Search
            placeholder={t('tabOAuth.onlyNameMatched')}
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.loadClientList}
          />
        </div>
        <div className="layout-content-body" key="body">
          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={clientList}
              pagination={pagination}
              loading={isFetching}
              rowKey={record => record.client_id}
            />
          </Card>
        </div>
        {
          visible &&
          <AddClientModal
            {...{ visible, isView, currentClient }}
            closeModal={this.toggleVisible}
            loadData={this.loadClientList}
          />
        }
        {
          secretVisible &&
          <SecretModal
            visible={secretVisible}
            client_id={currentClient.client_id}
            closeModal={this.toggleSecretVisible}
            loadData={this.loadClientList}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { clientList } = certification
  const { totalResults, isFetching } = clientList
  return {
    ...clientListSlt(state),
    totalResults,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  getClientList,
  deleteClient,
})(Clients)
