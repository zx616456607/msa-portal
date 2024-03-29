/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 *
 *
 * @author zhangxuan
 * @date 2018-05-29
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import { Card, Table, Button, Input, Dropdown, Menu, Pagination, notification } from 'antd'
import {
  getUaaAuth, getIdentityZones, getUaaRefreshToken, UAA_AUTH_FAILURE, deleteIdentityZone,
  UAA_REFRESH_TOKEN_FAILURE,
} from '../../../../actions/certification'
import { identityZoneListSlt } from '../../../../selectors/certification'
import './style/index.less'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, UAA_JWT, UAA_TOKEN_EXPIRE, DEFAULT_UAA } from '../../../../constants'
import { formatDate } from '../../../../common/utils'
import AuthZoneModal from './AuthZoneModal'
import Confirm from '../../../../components/Modal/confirm'
import { withNamespaces } from 'react-i18next'

const Search = Input.Search

@withNamespaces('identityManage')
class AuthZone extends React.Component {
  state = {
    current: DEFAULT_PAGE,
    authList: [],
  }

  async componentDidMount() {
    const uaaInfo = JSON.parse(localStorage.getItem(UAA_JWT))
    if (!isEmpty(uaaInfo)) {
      const { from, refresh_token } = uaaInfo
      const timeLength = Math.ceil((Date.now() - from) / 1000)
      if (timeLength >= UAA_TOKEN_EXPIRE) {
        // 超过过期时间重新获取 access_token
        const res = await this.getUaaAuthToken()
        if (res && res.error) {
          return
        }
      } else {
        // 获取refresh token
        const res = await this.getUaaRefreshToken(refresh_token)
        if (res && res.error) {
          return
        }
      }
    } else {
      // 本地存储中没有uaa token
      const res = await this.getUaaAuthToken()
      if (res && res.error) {
        return
      }
    }
    this.getZones()
  }

  getZones = () => {
    const { getIdentityZones } = this.props
    getIdentityZones()
    this.setState({ useStream: false })
  }

  getUaaAuthToken = async () => {
    const { getUaaAuth, t } = this.props
    const { client_id, client_secret, username, password } = DEFAULT_UAA
    const body = {
      username,
      password,
      client_id,
      client_secret,
      grant_type: 'password',
    }
    const accessRes = await getUaaAuth(body, { isHandleError: true })
    if (accessRes.type === UAA_AUTH_FAILURE) {
      // Modal.error({
      //   title: '认证失败',
      //   content: '请您刷新页面重试或点击确定返回',
      //   closable: false,
      //   onOk: () => history.go(0),
      // })
      notification.warn({
        message: t('identityZones.checkIdentityStatus'),
      })
      return Promise.reject({ error: 'failure' })
    }
    const uaaToken = accessRes.response.entities.uaaAuth[UAA_JWT]
    Object.assign(uaaToken, {
      from: Date.now(),
    })
    // Save jwt token to localStorage
    if (localStorage) {
      localStorage.setItem(UAA_JWT, JSON.stringify(uaaToken))
    }
  }

  getUaaRefreshToken = async refresh_token => {
    const { getUaaRefreshToken } = this.props
    const { client_id, client_secret } = DEFAULT_UAA
    const body = {
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token',
    }
    const refreshRes = await getUaaRefreshToken(body)
    if (refreshRes.type === UAA_REFRESH_TOKEN_FAILURE) {
      return Promise.reject({ error: 'failure' })
    }
    const uaaToken = refreshRes.response.entities.uaaAuth[UAA_JWT]
    Object.assign(uaaToken, {
      from: Date.now(),
    })
    // Save jwt token to localStorage
    if (localStorage) {
      localStorage.setItem(UAA_JWT, JSON.stringify(uaaToken))
    }
  }

  handleClick = (e, record) => {
    switch (e.key) {
      case 'edit':
        this.setState({
          visible: true,
          currentAuthZone: record,
        })
        break
      case 'delete':
        this.deleteZone(record)
        break
      default:
        break
    }
  }

  deleteZone = record => {
    const { deleteIdentityZone, t } = this.props
    Confirm({
      modalTitle: t('delIdentityZones.delIdentityZones'),
      title: t('delIdentityZones.willDelIdentityZones'),
      content: t('delIdentityZones.delDonestReset'),
      onOk: () => {
        return deleteIdentityZone(record.id).then(() => {
          notification.success({
            message: t('delIdentityZones.delSuccessful'),
          })
          this.getZones()
        }).catch(() => {
          notification.warn({
            message: t('delIdentityZones.delFailed'),
          })
        })
      },
    })
  }

  closeAuthZoneModal = () => {
    this.setState({
      visible: false,
      currentAuthZone: {},
    })
  }

  queryList = value => {
    const { identityZoneList } = this.props
    let useStream = true

    if (!value) {
      useStream = false
    }
    const authList = (identityZoneList || []).filter(list => {
      if (list.name.indexOf(value) > -1) {
        return true
      }
      return false
    })
    this.setState({ authList, useStream })
  }

  render() {
    const { current, visible, currentAuthZone, authList, useStream } = this.state
    const { identityZoneList, zonesFetching, history, t } = this.props
    let authLists = identityZoneList
    if (useStream) {
      authLists = authList
    }
    const pagination = {
      simple: true,
      total: authLists.length || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      onChange: current => this.setState({ current }),
    }

    const columns = [
      {
        title: t('identityZones.identityName'),
        dataIndex: 'name',
        width: '25%',
        render: (name, record) => <Link to={`/msa-manage/certification-manage/auth-zone/${record.id}`}>{name}</Link>,
      },
      {
        title: 'SubDomain',
        dataIndex: 'subdomain',
        width: '25%',
        render: text => text || '-',
      },
      {
        title: t('identityZones.refreshTime'),
        dataIndex: 'last_modified',
        width: '25%',
        render: text => formatDate(text),
      },
      {
        title: t('identityZones.operate'),
        width: '25%',
        render: (_, record) => (
          <Dropdown.Button
            className="auth-zone-dropdown"
            onClick={() => history.push(`/msa-manage/certification-manage/auth-zone/${record.id}`)}
            overlay={
              <Menu style={{ width: 110 }} onClick={e => this.handleClick(e, record)}>
                <Menu.Item key="edit">{t('identityZones.editorRow')}</Menu.Item>
                <Menu.Item key="delete">{t('identityZones.delRow')}</Menu.Item>
              </Menu>
            }
          >
            {t('identityZones.watchDetail')}
          </Dropdown.Button>
        ),
      },
    ]
    return (
      <QueueAnim className="auto-zone">
        <div className="layout-content-btns" key="btns">
          {
            visible &&
            <AuthZoneModal
              {...{ visible, currentAuthZone }}
              closeModal={this.closeAuthZoneModal}
              loadDate={this.getZones}
            />
          }
          <Button icon="plus" type="primary" onClick={() => this.setState({ visible: true })}>
            {t('identityZones.addIdentityZone')}
          </Button>
          <Button icon="reload" onClick={this.getZones}>
            {t('identityZones.refresh')}
          </Button>
          {/* <Button icon="delete">*/}
          {/* 删除*/}
          {/* </Button>*/}
          <Search
            placeholder={t('identityZones.searchByName')}
            style={{ width: 200 }}
            // value={inputValue}
            // onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.queryList}
          />
          <div className="page-box">
            <span className="total">{t('identityZones.totalData', { total: authLists.length || 0 })}</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card id="AuthZone-body">
            <Table
              columns={columns}
              dataSource={authLists}
              pagination={pagination}
              loading={zonesFetching}
              rowKey={record => record.id}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...identityZoneListSlt(state),
  }
}

export default connect(mapStateToProps, {
  getUaaAuth,
  getUaaRefreshToken,
  getIdentityZones,
  deleteIdentityZone,
})(AuthZone)
