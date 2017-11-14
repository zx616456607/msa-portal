/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetail-list
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Input, Table, notification } from 'antd'
import classNames from 'classnames'
import {
  delManualrule,
} from '../../../../../actions/msa'
import './style/index.less'

const Search = Input.Search

class MsaDetailList extends React.Component {
  state = {
    keyword: '',
  }

  removeRegister = record => {
    const { delManualrule, clusterID, loadMsaDetail } = this.props
    delManualrule(clusterID, record.id).then(res => {
      if (res.error) {
        return
      }
      notification.success({
        message: '移除注册成功',
      })
      loadMsaDetail()
    })
  }

  render() {
    const { instances, loadMsaDetail, loading } = this.props
    const { keyword } = this.state
    const instancesData = instances.filter(instance => instance.name.indexOf(keyword) > -1)
    const pagination = {
      simple: true,
    }
    const columns = [{
      title: '实例名称',
      dataIndex: 'name',
      width: '15%',
    }, {
      title: '微服务 实例ID',
      dataIndex: 'instanceId',
      width: '15%',
    }, {
      title: '实例状态',
      dataIndex: 'status',
      width: '10%',
    }, {
      title: '服务地址',
      dataIndex: 'ip',
      width: '10%',
    }, {
      title: '服务端口',
      dataIndex: 'port',
      width: '10%',
    }, {
      title: '注册类型',
      dataIndex: 'type',
      width: '10%',
      render: text => (text === 'automatic' ? '自动注册' : '手动注册'),
    }, {
      title: '状态',
      dataIndex: 'discoverable',
      width: '10%',
      render: text =>
        <span className={classNames('msa-table-status-box', { 'msa-table-running': text, 'msa-table-error': !text })}>
          <i className="msa-table-status"/>{text ? '可被发现' : '不可被发现'}
        </span>,
    }, {
      title: '操作',
      width: '10%',
      render: record => {
        return (
          <div>
            {/* {
              record.type === 'automatic' && (
                record.discoverable
                  ? <Button>隐藏服务</Button>
                  : <Button>取消隐藏</Button>
              )
            } */}
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
    return (
      <div className="msa-detail-list">
        <div className="layout-content-btns">
          <Button type="primary" icon="sync" onClick={loadMsaDetail}>
          刷新
          </Button>
          <Search
            className="msa-detail-list-search"
            placeholder="按实例名称搜索"
            onSearch={keyword => this.setState({ keyword })}
          />
        </div>
        <Table
          className="msa-detail-list-table"
          pagination={pagination}
          columns={columns}
          dataSource={instancesData}
          rowKey={row => row.instanceId}
          loading={loading}
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  delManualrule,
})(MsaDetailList)
