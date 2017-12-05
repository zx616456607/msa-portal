/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Vouchers
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Button, Icon, Input, Pagination, Dropdown, Table, Card, Menu, Modal } from 'antd'
import './style/index.less'
const Search = Input.Search

export default class ConsumerVouchers extends React.Component {

  state = {
    title: '',
    isUse: true,
    isAdd: false,
    delValue: '',
    voucherName: '',
    delVisible: false,
    addVisible: false,
  }

  handleAdd = () => {
    this.setState({
      isAdd: true,
      title: '创建消费凭证',
      addVisible: true,
    })
  }

  handleButtonClick = () => {
    this.setState({
      isAdd: false,
      title: '编辑消费凭证',
      addVisible: true,
    })
  }

  handleOK = () => { }

  handleCancel = () => {
    this.setState({
      addVisible: false,
    })
  }

  handleMenu = value => {
    if (value.key === '更新') {
      this.setState({})
    } if (value.key === '删除') {
      this.setState({
        delValue: '',
        delVisible: true,
      })
    }
  }
  handleDelOk = () => { }

  handleDelcancel = () => {
    this.setState({
      delVisible: false,
    })
  }

  handleModal = e => {
    this.setState({
      voucherName: e.target.value,
    })
  }

  render() {
    const { addVisible, isAdd, title, delVisible, isUse } = this.state
    const columns = [{
      id: 'id',
      title: '凭证名称',
      dataIndex: 'name',
    }, {
      title: 'AccessKey / SecretKey',
      dataIndex: 'as',
    }, {
      title: '订阅服务（个）',
      dataIndex: 'service',
    }, {
      title: '创建时间',
      dataIndex: 'stime',
    }, {
      title: '更新时间',
      dataIndex: 'utime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <Dropdown.Button onClick={this.handleButtonClick} overlay={
          <Menu onClick={this.handleMenu} style={{ width: 78 }}>
            <Menu.Item key="更新">更新</Menu.Item>
            <Menu.Item key="删除">删除</Menu.Item>
          </Menu>
        }>编辑</Dropdown.Button>
      </div>,
    }]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
    }
    const data = [{
      key: '1',
      name: 'John Brown',
      as: 32,
      service: 'New York',
      stime: '2017-01-01',
      utime: '2017-02-02',
    }, {
      key: '2',
      name: 'John Brown',
      as: 32,
      service: 'New York',
      stime: '2017-01-01',
      utime: '2017-02-02',
    }]
    const pagination = {
      total: 1,
      defaultCurrent: 1,
    }
    return (
      <QueueAnim className="msa-comsumer-vouchers">
        <div className="top" key="top">
          <div className="topLeft">
            <Button className="vou" type="primary" onClick={this.handleAdd}><Icon type="plus" />创建凭证</Button>
            <Button className="res"><Icon type="sync" />刷新</Button>
            <Button className="del"><Icon type="delete" />删除</Button>
            <Search
              placeholder="按凭证名称搜索"
              style={{ width: 200 }}
              onSearch={value => console.log(value)}
            />
          </div>
          <div className="topRigth" type="card">
            <span>共计0条</span>
            <Pagination simple {...pagination} />
          </div>
        </div>
        <Card noHovering className="body" key="body">
          <Table
            columns={columns}
            pagination={false}
            dataSource={data}
            rowSelection={rowSelection}
          />
        </Card>
        <Modal title={title} visible={addVisible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOK}>{isAdd ? '确 定' : '保 存'}</Button>,
          ]}>
          <div style={{ marginLeft: 30 }}>
            <span style={{ marginRight: 20 }}>凭证名称</span>
            <Input style={{ width: '70%' }} placeholder="请输入凭证名称" onChange={this.handleModal} />
          </div>
        </Modal>
        <Modal title="删除消费凭证"
          visible={delVisible}
          onCancel={this.handleDelcancel}
          footer={isUse ?
            [
              <Button key="back" type="primary" onClick={this.handleDelcancel}>知道了</Button>,
            ] :
            [
              <Button key="back" type="ghost" onClick={this.handleDelcancel}>取 消</Button>,
              <Button key="submit" type="primary" onClick={this.handleDelOk}>{isAdd ? '确 定' : '保 存'}</Button>,
            ]}>
          {
            isUse ?
              <div>
                <div style={{ position: 'absolute', top: 70, left: 23 }}>
                  <Icon type="exclamation-circle" style={{ fontSize: 25, color: '#2db7f5' }} />
                </div>
                <div style={{ width: '90%', marginLeft: 40 }}>
                  <h3>删除消费凭证</h3>
                  <span>消费凭证 XX, XX 正被用于订阅服务，不可删除</span>
                </div>
              </div> :
              <div className="prompt" style={{ height: 50, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10, borderRadius: 4 }}>
                <div style={{ position: 'absolute', top: 75, left: 30 }}>
                  <Icon type="exclamation-circle" style={{ fontSize: 25, color: '#ffbf00' }} />
                </div>
                <div style={{ width: '90%', marginLeft: 40, marginTop: 3 }}>
                  <span>确定删除消费凭证 ？</span>
                </div>
              </div>
          }
        </Modal>
      </QueueAnim>
    )
  }
}
