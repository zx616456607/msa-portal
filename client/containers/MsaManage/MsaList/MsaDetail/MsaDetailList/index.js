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
import { Button, Input, Icon, Table } from 'antd'
import './style/index.less'

const Search = Input.Search

export default class MsaDetailList extends React.Component {
  render() {
    const pagination = {
      simple: true,
    }
    const columns = [{
      title: '微服务 实例ID',
      dataIndex: 'id',
      render: text => <div className="msa-table-service">{text}<Icon type="close-square-o" className="msa-table-service-del pointer"/></div>,
    }, {
      title: '实例状态',
      dataIndex: 'agentStatus',
    }, {
      title: '服务地址',
      dataIndex: 'address',
    }, {
      title: '注册类型',
      dataIndex: 'type',
    }, {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '操作',
      render: record => {
        return (
          <div>
            {
              record.type === '自动注册' ? record.status === '可被发现' ? <Button>隐藏服务</Button> : <Button>取消隐藏</Button> : ''
            }
            {
              record.type === '手动注册' ? <Button>移除注册</Button> : ''
            }
          </div>
        )
      },
    }]
    const data = [{
      key: '1',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      address: '192.168.0.33',
      type: '自动注册',
    }, {
      key: '2',
      name: 'service2',
      id: '/greeting',
      status: '不可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '自动注册',
      serStatus: 'agent55-app^15',
    }, {
      key: '3',
      name: 'service3',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '手动注册',
      serStatus: 'agent55-app^15',
    }, {
      key: '4',
      name: 'service4',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '手动注册',
      serStatus: 'agent55-app^15',
    }]
    return (
      <div className="msaDetailList">
        <div className="layout-content-btns">
          <Button type="primary"><Icon type="sync"/>刷新</Button>
          <Search placeholder="按服务名称搜索" style={{ width: '200px' }}/>
        </div>
        <Table
          className="msaDetailList-table"
          pagination={pagination}
          columns={columns}
          dataSource={data} />
      </div>
    )
  }
}
