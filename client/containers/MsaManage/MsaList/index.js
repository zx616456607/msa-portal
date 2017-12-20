/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaList
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import {
  Button, Icon, Input, Table, Card, notification, Tooltip,
  Dropdown, Menu,
} from 'antd'
import classNames from 'classnames'
import {
  getMsaList,
  delManualrules,
  addExpulsionsManualrules,
  delExpulsionsManualrules,
} from '../../../actions/msa'
import {
  msaListSlt,
} from '../../../selectors/msa'
import {
  MSA_TYPE_MAN,
  MSA_TYPE_AUTO,
  MSA_TYPES_TEXT,
} from '../../../constants'
import confirm from '../../../components/Modal/confirm'
import { toQuerystring } from '../../../common/utils'
import './style/msaList.less'

const Search = Input.Search
const DropdownButton = Dropdown.Button
const MenuItem = Menu.Item

class MsaList extends React.Component {
  state = {
    keyword: '',
  }

  componentWillMount() {
    this.loadMsaList()
  }

  registerMsa = () => {
    this.props.history.push('/msa-manage/register')
  }

  loadMsaList = () => {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  hideService = record => {
    const { addExpulsionsManualrules, clusterID } = this.props
    const self = this
    confirm({
      title: `确认将服务 ${record.appName} 隐藏吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const body = [{
            appName: record.appName,
          }]
          addExpulsionsManualrules(clusterID, body).then(res => {
            if (res.error) {
              return reject()
            }
            // 1s timeout for backend
            setTimeout(() => {
              resolve()
              notification.success({
                message: '隐藏服务成功',
              })
              self.loadMsaList()
            }, 1000)
          })
        })
      },
    })
  }

  cancelHideService = record => {
    const { delExpulsionsManualrules, clusterID } = this.props
    const self = this
    confirm({
      title: `确认将服务 ${record.appName} 取消隐藏吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delExpulsionsManualrules(clusterID, record.id).then(res => {
            if (res.error) {
              return reject()
            }
            // 1s timeout for backend
            setTimeout(() => {
              resolve()
              notification.success({
                message: '隐藏服务成功',
              })
              self.loadMsaList()
            }, 1000)
          })
        })
      },
    })
  }

  removeRegister = record => {
    const { delManualrules, clusterID } = this.props
    const ruleIds = record.instances.map(instance => instance.id)
    const self = this
    confirm({
      title: `确认将服务 ${record.appName} 移除注册吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delManualrules(clusterID, ruleIds).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '移除注册成功',
            })
            self.loadMsaList()
          })
        })
      },
    })
  }

  handleMenuClick = (record, { key }) => {
    if (key === 'add') {
      const query = {
        mode: 'add',
        id: record.id,
        appName: record.appName,
      }
      this.props.history.push(`/msa-manage/register?${toQuerystring(query)}`)
    }
  }

  render() {
    const { msaList, msaListLoading } = this.props
    const { keyword } = this.state
    const msaData = msaList.filter(msa => msa.appName.indexOf(keyword) > -1)
    const columns = [{
      title: '微服务名称',
      dataIndex: 'appName',
      width: '20%',
      render: (text, record) => {
        if (record.discoverable) {
          return <Link to={`/msa-manage/detail/${text}`}>{text}</Link>
        }
        return (
          <Tooltip title="不可被发现">
            <span>{text}</span>
          </Tooltip>
        )
      },
    }, {
      title: '服务状态',
      dataIndex: 'upSum',
      width: '20%',
      render: (text, record) => `${text}/${record.instances.length}`,
    }, {
      title: '注册类型',
      dataIndex: 'type',
      width: '20%',
      render: text => MSA_TYPES_TEXT[text],
    }, {
      title: '状态',
      dataIndex: 'discoverable',
      width: '20%',
      render: text =>
        <span
          className={
            classNames(
              'msa-table-status-box',
              { 'msa-table-running': text, 'msa-table-error': !text }
            )
          }
        >
          <i className="msa-table-status" />{text ? '可被发现' : '不可被发现'}
        </span>,
    }, {
      title: '操作',
      width: '20%',
      render: record => {
        const isMsaAutomatic = record.type === MSA_TYPE_AUTO
        const isShow = !record.id || (record.id && record.deletedAt)
        const isHide = record.id && !record.deletedAt
        const menu = (
          <Menu onClick={this.handleMenuClick.bind(this, record)} style={{ width: 103 }}>
            <MenuItem key="add" disabled={isMsaAutomatic}>
              <Tooltip title={isMsaAutomatic && '自动注册的微服务不支持添加实例'}>
                添加实例
              </Tooltip>
            </MenuItem>
          </Menu>
        )
        return (
          <div>
            {
              isMsaAutomatic && isShow && (
                <DropdownButton
                  overlay={menu}
                  onClick={this.hideService.bind(this, record)}
                >
                隐藏服务
                </DropdownButton>
              )
            }
            {
              isMsaAutomatic && isHide && (
                <DropdownButton
                  overlay={menu}
                  onClick={this.cancelHideService.bind(this, record)}
                >
                取消隐藏
                </DropdownButton>
              )
            }
            {
              record.type === MSA_TYPE_MAN &&
              <DropdownButton
                overlay={menu}
                onClick={this.removeRegister.bind(this, record)}
              >
              移除注册
              </DropdownButton>
            }
          </div>
        )
      },
    }]
    /* const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
      }),
    } */
    const pagination = {
      simple: true,
    }
    return (
      <QueueAnim className="msa">
        <div className="msa-btn-box layout-content-btns" key="btns">
          <Button type="primary" onClick={this.registerMsa}><Icon type="plus" />注册微服务</Button>
          {/* <Button icon="poweroff">注销微服务</Button> */}
          <Button icon="sync" onClick={this.loadMsaList}>刷新</Button>
          <Search
            className="msa-search"
            placeholder="按微服务名称搜索"
            onSearch={keyword => this.setState({ keyword })}
          />
          <span className="float-right msa-btn-box-total">共计 {msaData.length} 条</span>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              className="msa-table"
              pagination={pagination}
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={msaData}
              loading={msaListLoading}
              rowKey={row => row.appName}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  return {
    clusterID: id,
    ...msaListSlt(state),
  }
}

export default connect(mapStateToProps, {
  getMsaList,
  delManualrules,
  addExpulsionsManualrules,
  delExpulsionsManualrules,
})(MsaList)
