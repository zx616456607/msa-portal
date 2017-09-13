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
import { Card, Table, Button, Input, Dropdown, Menu } from 'antd'
import AddClientModal from './AddClientModal'
import './style/index.less'

const Search = Input.Search

export default class Clients extends React.Component {
  state = {
    visible: false,
  }

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  render() {
    const columns = [
      {
        title: '客户端 ID',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'AccessToken（有效时间秒）',
        dataIndex: 'key2',
        key: 'key2',
      },
      {
        title: 'Refresh Token（有效时间秒）',
        dataIndex: 'key3',
        key: 'key3',
      },
      {
        title: '授权方式',
        dataIndex: 'key4',
        key: 'key4',
      },
      {
        title: '授权范围',
        dataIndex: 'key5',
        key: 'key5',
      },
      {
        title: '可用资源 ID',
        dataIndex: 'key6',
        key: 'key6',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => (
          <Dropdown.Button
            overlay={
              <Menu style={{ width: 82 }}>
                <Menu.Item key="1">启用</Menu.Item>
                <Menu.Item key="2">删除</Menu.Item>
              </Menu>
            }
          >
            编辑
          </Dropdown.Button>
        ),
      },
    ]
    const data = [
      {
        key: 'client1',
        key2: '232',
        key3: '222',
        key4: 'authorization_code',
        key5: 'trust',
        key6: 'resource1',
      },
      {
        key: 'client2',
        key2: '234',
        key3: '12',
        key4: 'authorization_code',
        key5: 'trust',
        key6: 'resource2',
      },
      {
        key: 'client3',
        key2: '12',
        key3: '56',
        key4: 'authorization_code',
        key5: 'trust',
        key6: 'resource3',
      },
      {
        key: 'client4',
        key2: '78',
        key3: '123',
        key4: 'authorization_code',
        key5: 'trust',
        key6: 'resource4',
      },
    ]
    const pagination = {
      simple: true,
    }
    const { visible } = this.state
    return (
      <div className="certification-clients">
        <div className="layout-content-btns">
          <Button icon="plus" type="primary" onClick={this.toggleVisible}>
            添加客户端
          </Button>
          <Button icon="reload">
            刷新
          </Button>
          <Button icon="delete">
            删除
          </Button>
          <Search
            placeholder="按客户端 ID 搜索"
            style={{ width: 200 }}
          />
        </div>
        <div className="layout-content-body">
          <Card>
            <Table
              columns={columns}
              dataSource={data}
              pagination={pagination}
            />
          </Card>
        </div>
        <AddClientModal
          visible={visible}
          onCancel={this.toggleVisible}
          onOk={this.toggleVisible}
        />
      </div>
    )
  }
}
