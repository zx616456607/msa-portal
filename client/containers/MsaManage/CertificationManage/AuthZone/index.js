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
import { Card, Table, Button, Input, Dropdown, Menu, Modal, Pagination, notification } from 'antd'
import {
  getUaaAuth, getIdentityZones, getUaaRefreshToken, UAA_AUTH_FAILURE, deleteIdentityZone,
} from '../../../../actions/certification'
import { identityZoneListSlt } from '../../../../selectors/certification'
import './style/index.less'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, UAA_JWT, UAA_TOKEN_EXPIRE, DEFAULT_UAA } from '../../../../constants'
import { formatDate } from '../../../../common/utils'
import AuthZoneModal from './AuthZoneModal'
import Confirm from '../../../../components/Modal/confirm'

const Search = Input.Search

class AuthZone extends React.Component {
  state = {
    current: DEFAULT_PAGE,
  }

  async componentDidMount() {
    const uaaInfo = JSON.parse(localStorage.getItem(UAA_JWT))
    if (!isEmpty(uaaInfo)) {
      const { from, refresh_token } = uaaInfo
      const timeLength = Math.ceil((Date.now() - from) / 1000)
      if (timeLength >= UAA_TOKEN_EXPIRE) {
        // 超过过期时间重新获取 access_token
        await this.getUaaAuthToken()
      } else {
        // 获取refresh token
        await this.getUaaRefreshToken(refresh_token)
      }
    } else {
      // 本地存储中没有uaa token
      await this.getUaaAuthToken()
    }
    this.getZones()
  }

  getZones = () => {
    const { getIdentityZones } = this.props
    getIdentityZones()
  }

  getUaaAuthToken = async () => {
    const { getUaaAuth, history } = this.props
    const { client_id, client_secret, username, password } = DEFAULT_UAA
    const body = {
      username,
      password,
      client_id,
      client_secret,
      grant_type: 'password',
    }
    const accessRes = await getUaaAuth(body)
    if (accessRes.type === UAA_AUTH_FAILURE) {
      Modal.error({
        title: '认证失败',
        content: '请您刷新页面重试或点击确定返回',
        closable: false,
        onOk: () => history.go(0),
      })
      return
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
    const { deleteIdentityZone } = this.props
    Confirm({
      modalTitle: '删除认证域',
      title: '确定要删除该认证域吗？',
      content: '注：删除后将无法恢复',
      onOk: () => {
        return deleteIdentityZone(record.id).then(() => {
          notification.success({
            message: '删除成功',
          })
          this.getZones()
        }).catch(() => {
          notification.warn({
            message: '删除失败',
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

  render() {
    const { inputValue, current, visible, currentAuthZone } = this.state
    const { identityZoneList, zonesFetching, history } = this.props
    const pagination = {
      simple: true,
      total: 10 || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      onChange: current => this.setState({ current }),
    }

    const columns = [
      {
        title: '认证 ID',
        dataIndex: 'id',
        width: '20%',
        render: text => <Link to={`/msa-manage/certification-manage/auth-zone/${text}`}>{text}</Link>,
      },
      {
        title: '认证域名称',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: 'SubDomain',
        dataIndex: 'subdomain',
        width: '20%',
        render: text => text || '-',
      },
      {
        title: '更新时间',
        dataIndex: 'last_modified',
        width: '20%',
        render: text => formatDate(text),
      },
      {
        title: '操作',
        width: '20%',
        render: (_, record) => (
          <Dropdown.Button
            className="auth-zone-dropdown"
            onClick={() => history.push(`/msa-manage/certification-manage/auth-zone/${record.id}`)}
            overlay={
              <Menu style={{ width: 110 }} onClick={e => this.handleClick(e, record)}>
                <Menu.Item key="edit">编辑</Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            查看详情
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
            />
          }
          <Button icon="plus" type="primary" onClick={() => this.setState({ visible: true })}>
            添加认证域
          </Button>
          <Button icon="reload" onClick={this.getZones}>
            刷新
          </Button>
          {/* <Button icon="delete">*/}
          {/* 删除*/}
          {/* </Button>*/}
          <Search
            placeholder="按认证域 ID 搜索"
            style={{ width: 200 }}
            value={inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            // onSearch={this.loadClientList}
          />
          <div className="page-box">
            <span className="total">共 10 条</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              columns={columns}
              dataSource={identityZoneList}
              pagination={false}
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
