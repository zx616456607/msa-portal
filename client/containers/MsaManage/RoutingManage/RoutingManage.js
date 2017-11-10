/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RoutingManage
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Button, Icon, Input, Table, Dropdown, Menu, Card } from 'antd'
import RoutingRuleModal from './RoutingRuleModal'
import './style/index.less'

const Search = Input.Search

export default class RoutingManage extends React.Component {
  state = {
    ruleModal: false,
  }
  addRoutingRule = () => {
    this.setState({
      ruleModal: true,
    })
  }
  editRule = () => {
    this.setState({
      ruleModal: true,
    })
  }
  handleMenuClick = e => {
    console.log('click', e)
  }
  render() {
    const { ruleModal } = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">停用</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    )
    const columns = [{
      title: '路由名称',
      dataIndex: 'name',
    }, {
      title: '路由路径',
      dataIndex: 'path',
    }, {
      title: '路由状态',
      dataIndex: 'status',
    }, {
      title: '路由URL',
      dataIndex: 'url',
    }, {
      title: '路由规则描述',
      dataIndex: 'rule',
    }, {
      title: '去掉路径前缀',
      dataIndex: 'delPrePath',
    }, {
      title: '失败重试',
      dataIndex: 'restart',
    }, {
      title: '操作',
      render: () => {
        return (
          <Dropdown.Button onClick={this.editRule} overlay={menu}>
            修改
          </Dropdown.Button>
        )
      },
    }]
    const data = [{
      key: '1',
      name: 'appinAdjustService',
      path: '/appinAdjustService/**',
      status: 'running',
      url: 'AppinAdjustService',
      rule: '--',
      delPrePath: 'true',
      restart: 'False',
    }, {
      key: '2',
      name: 'appinAdjustService',
      path: '/appinAdjustService/**',
      status: 'running',
      url: 'AppinAdjustService',
      rule: '--',
      delPrePath: 'true',
      restart: 'False',
    }, {
      key: '3',
      name: 'appinAdjustService',
      path: '/appinAdjustService/**',
      status: 'running',
      url: 'AppinAdjustService',
      rule: '--',
      delPrePath: 'true',
      restart: 'False',
    }, {
      key: '4',
      name: 'appinAdjustService',
      path: '/appinAdjustService/**',
      status: 'running',
      url: 'AppinAdjustService',
      rule: '--',
      delPrePath: 'true',
      restart: 'False',
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
      <QueueAnim className="router-manage">
        <div className="router-manage-btn-box layout-content-btns" key="btns">
          <Button type="primary" onClick={this.addRoutingRule}><Icon type="plus"/>添加路由</Button>
          <Button><Icon type="sync"/>刷新</Button>
          <Button><Icon type="delete"/>删除</Button>
          <Search
            placeholder="按路由名称搜索"
            style={{ width: 200 }}
          />
        </div>
        <RoutingRuleModal visible={ruleModal} scope={this}/>
        <div className="layout-content-body" key="body">
          <Card noHovering>
            <Table
              className="router-manage-table"
              pagination={pagination}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}
