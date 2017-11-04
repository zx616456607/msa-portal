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
import { Button, Icon, Input, Table, Card, notification } from 'antd'
import './style/msaList.less'
import classNames from 'classnames'
import {
  getMsaList,
  delManualrule,
  addManualrule,
} from '../../../actions/msa'
import {
  MSA_RULE_EXP,
} from '../../../constants'

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
    getMsaList(clusterID).then(res => console.log('res', res))
  }

  hideService = record => {
    const { addManualrule, clusterID } = this.props
    const body = [{
      appName: record.serviceName,
      rule: MSA_RULE_EXP,
    }]
    addManualrule(clusterID, body).then(res => {
      if (res.error) {
        return
      }
      notification.success({
        message: '隐藏服务成功',
      })
      this.loadMsaList()
    })
  }

  cancelHideService = record => console.log(record)

  removeRegister = record => {
    const { delManualrule, clusterID } = this.props
    const ruleIds = record.instances.map(instance => instance.id)
    delManualrule(clusterID, ruleIds).then(res => {
      console.log('res', res)
      if (res.error) {
        return
      }
      notification.success({
        message: '移除注册成功',
      })
      this.loadMsaList()
    })
  }

  render() {
    const { msaList, msaListLoading } = this.props
    const columns = [{
      title: '微服务名称',
      dataIndex: 'serviceName',
      width: '20%',
      render: text => <Link to={`/msa-manage/detail/${text}?name=${text}`}>{text}</Link>,
    }, {
      title: '服务状态',
      dataIndex: 'status',
      width: '20%',
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
              <Button onClick={this.removeRegister.bind(this, record)}>移除注册</Button>
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
      <div className="msa">
        <div className="msa-btn-box layout-content-btns">
          <Button type="primary" onClick={this.registerMsa}><Icon type="plus"/>注册微服务</Button>
          {/* <Button icon="poweroff">注销微服务</Button> */}
          <Button icon="sync" onClick={this.loadMsaList}>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
          />
          <span className="float-right msa-btn-box-total">共计 {msaList.length} 条</span>
        </div>
        <Card noHovering>
          <Table
            className="msa-table"
            pagination={pagination}
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={msaList}
            loading={msaListLoading}
            rowKey={row => row.serviceName}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current, msa } = state
  const { id } = current.config.cluster
  const msaList = msa.msaList || {}
  function getServiceStatus(data) {
    // if (!data.length) result
    let upNum = 0
    data.forEach(item => {
      if (item.status === 'UP') {
        upNum++
      }
    })
    return `${upNum}/${data.length}`
  }
  function formateList(source) {
    return source.map(item => {
      return Object.assign(item, { status: getServiceStatus(item.instances) })
    })
  }
  return {
    clusterID: id,
    msaList: formateList(msaList.data || []), // 部署完此方法可删掉，直接取store里面的masList
    msaListLoading: msaList.isFetching,
  }
}

export default connect(mapStateToProps, {
  getMsaList,
  delManualrule,
  addManualrule,
})(MsaList)
