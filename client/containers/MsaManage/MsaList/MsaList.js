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
import { Button, Icon, Input, Table } from 'antd'
const Search = Input.Search
import './style/msaList.less'
import RegisterMsa from './RegisterMsa'

export default class MsaList extends React.Component {
  state = {
    msaModal: false,
  }
  editMsa = () => {
    this.setState({
      msaModal: true,
    })
  }
  registerMsa = () => {
    this.setState({
      msaModal: true,
    })
  }
  render() {
    const { msaModal } = this.state
    const columns = [{
      title: '微服务名称',
      dataIndex: 'name',
    }, {
      title: '微服务 实例ID',
      dataIndex: 'id',
    }, {
      title: '实例状态',
      dataIndex: 'agentStatus',
    }, {
      title: '服务地址',
      dataIndex: 'address',
    }, {
      title: '服务状态',
      dataIndex: 'serStatus',
    }, {
      title: '服务端口',
      dataIndex: 'port',
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
      name: '08/07 15:25:31 667',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '自动注册',
      serStatus: 'agent55-app^15',
    }, {
      key: '2',
      name: '08/07 15:25:31 667',
      id: '/greeting',
      status: '不可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '自动注册',
      serStatus: 'agent55-app^15',
    }, {
      key: '3',
      name: '08/07 15:25:31 667',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '手动注册',
      serStatus: 'agent55-app^15',
    }, {
      key: '4',
      name: '08/07 15:25:31 667',
      id: '/greeting',
      status: '可被发现',
      agentStatus: 'running',
      port: 'agent55-app',
      address: '192.168.0.33',
      type: '手动注册',
      serStatus: 'agent55-app^15',
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
      <div className="msa">
        <div className="msa-btn-box layout-content-btns">
          <Button type="primary" onClick={this.registerMsa}><Icon type="plus"/>注册微服务</Button>
          <Button><Icon type="poweroff"/>注销微服务</Button>
          <Button><Icon type="sync"/>刷新</Button>
          <Search
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
          />
          <span className="float-right msa-btn-box-total">共计 3 条</span>
        </div>
        <RegisterMsa visible={msaModal} scope={this}/>
        <Table
          className="msa-table"
          pagination={pagination}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data} />
      </div>
    )
  }
}
