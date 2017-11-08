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
import { Button, Icon, Input, Table, Card, notification, Tooltip } from 'antd'
import classNames from 'classnames'
import {
  getMsaList,
  delManualrule,
  addManualrule,
} from '../../../actions/msa'
import {
  msaListSlt,
} from '../../../selectors/msa'
import {
  MSA_RULE_EXP,
} from '../../../constants'
import confirm from '../../../components/Modal/confirm'
import './style/msaList.less'

const Search = Input.Search

class MsaList extends React.Component {
  state = {
    //
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
    const { addManualrule, clusterID } = this.props
    const self = this
    confirm({
      title: `确认将服务 ${record.serviceName} 隐藏吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const body = [{
            appName: record.serviceName,
            rule: MSA_RULE_EXP,
          }]
          addManualrule(clusterID, body).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '隐藏服务成功',
            })
            self.loadMsaList()
          })
        })
      },
    })
  }

  cancelHideService = record => {
    const { delManualrule, clusterID } = this.props
    const self = this
    confirm({
      title: `确认将服务 ${record.serviceName} 取消隐藏吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delManualrule(clusterID, record.instances[0].id).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '隐藏服务成功',
            })
            self.loadMsaList()
          })
        })
      },
    })
  }

  removeRegister = record => {
    const { delManualrule, clusterID } = this.props
    const ruleIds = record.instances.map(instance => instance.id)
    const self = this
    confirm({
      title: `确认将服务 ${record.serviceName} 移除注册吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delManualrule(clusterID, ruleIds).then(res => {
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

  render() {
    const { msaList, msaListLoading } = this.props
    const columns = [{
      title: '微服务名称',
      dataIndex: 'serviceName',
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
      render: text => {
        return <div>{text === 'automatic' ? '自动注册' : '手动注册'}</div>
      },
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
          <i className="msa-table-status"/>{text ? '可被发现' : '不可被发现'}
        </span>,
    }, {
      title: '操作',
      width: '20%',
      render: record => {
        return (
          <div>
            {
              record.type === 'automatic' &&
              (record.discoverable
                ? <Button onClick={this.hideService.bind(this, record)}>隐藏服务</Button>
                : <Button onClick={this.cancelHideService.bind(this, record)}>取消隐藏</Button>)
            }
            {
              record.type !== 'automatic' &&
              <Button onClick={this.removeRegister.bind(this, record)}>
              移除注册
              </Button>
            }
          </div>
        )
      },
    }]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
      }),
    }
    const pagination = {
      simple: true,
    }
    return (
      <QueueAnim className="msa">
        <div className="msa-btn-box layout-content-btns" key="btns">
          <Button type="primary" onClick={this.registerMsa}><Icon type="plus"/>注册微服务</Button>
          <Button icon="poweroff">注销微服务</Button>
          <Button icon="sync" onClick={this.loadMsaList}>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
          />
          <span className="float-right msa-btn-box-total">共计 {msaList.length} 条</span>
        </div>
        <div className="layout-content-body" key="body">
          <Card noHovering>
            <Table
              className="msa-table"
              pagination={pagination}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={msaList}
              loading={msaListLoading}
              rowKey={row => row.serviceName}
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
  delManualrule,
  addManualrule,
})(MsaList)
