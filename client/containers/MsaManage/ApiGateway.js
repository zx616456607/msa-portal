/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Performance
 *
 * 2017-09-12
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/apiGateway.less'
import { Button, Icon, Table, Pagination, Modal, Dropdown, Row, Input, Menu, Select, Switch, InputNumber } from 'antd'
const Search = Input.Search

class ApiGateway extends React.Component {
  state = {
    visible: false,
    selectedRowKeys: [],
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { selectedRowKeys, visible } = this.state
    const menu = (
      <Menu style={{ width: '79px' }}>
        <Menu.Item key="0">编辑</Menu.Item>
        <Menu.Item key="1">停用</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    )
    const columns = [{
      title: '微服务名称',
      size: 14,
      dataIndex: 'name',
    }, {
      title: '限流类型',
      dataIndex: 'type',
    }, {
      title: '具体对象',
      dataIndex: 'object',
    }, {
      title: '限流阀值（次）',
      dataIndex: 'valve',
    }, {
      title: '限流周期（秒）',
      dataIndex: 'cycle',
    }, {
      title: '规则状态',
      dataIndex: 'state',
      render: () => <div>
        {
          <span style={{ color: '#2db75f' }}><p style={{ borderRadius: '50%', backgroundColor: '#2db75f', width: 10, height: 10, display: 'inline-block' }}></p>&nbsp;启用</span>
        }
      </div>,
    }, {
      title: '操作',
      dataIndex: 'comment',
      render: () => <div>
        {
          <Dropdown.Button overlay={menu} type="ghost">
            编辑
          </Dropdown.Button>
        }
      </div>,
    }]

    const data = [{
      key: '1',
      name: 'John Brown',
      type: 'user',
      object: 'asdas',
      valve: '100',
      cycle: '20',
    }, {
      key: '2',
      name: 'Jim Green',
      type: 'user',
      object: 'asdas',
      valve: '100',
      cycle: '20',
    }]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <Row className="layout-content-btns">
        <div className="top" style={{ marginRight: 0 }}>
          <Button className="add" size="large" style={{ backgroundColor: '#2db7f5' }} onClick={() => this.handleAdd()}>
            <Icon type="plus" style={{ color: '#fff' }} />
            <span style={{ color: '#fff' }}>添加限流规则</span>
          </Button>
          <Button className="search" size="large">
            <Icon type="sync" />
            <span>刷新</span>
          </Button>
          <Button className="del" size="large">
            <Icon type="delete" />
            <span>删除</span>
          </Button>
          <Search
            size="large"
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
            onSearch={value => console.log(value)}
          />
          <div className="page">
            <span className="total">共计3条</span>
            <Pagination simple defaultCurrent={0} total={5} />
          </div>
        </div>
        <div className="bottom">
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} />
        </div>
        <Modal
          title="添加限流规则"
          visible={visible}
          onOk={ this.handleOk }
          onCancel={ this.handleClose }
        >
          <ul>
            <li style={{ margin: '10px 0 20px 0' }}>
              <span style={{ marginLeft: 14 + '%' }}>选择微服务</span>
              <Select style={{ width: 50 + '%', marginLeft: 20 }}></Select>
            </li>
            <li style={{ margin: '10px 0 20px 0' }}>
              <span style={{ marginLeft: 16 + '%' }}>限流类型</span>
              <Select style={{ width: 50 + '%', marginLeft: 22 }}></Select>
            </li>
            <li style={{ margin: '10px 0 20px 0' }}>
              <span style={{ marginLeft: 16 + '%' }}>具体对象</span>
              <Select style={{ width: 50 + '%', marginLeft: 20.3 }}></Select>
            </li>
            <li style={{ margin: '10px 0 20px 0' }}>
              <span style={{ marginLeft: 16 + '%' }}>限流阀值</span>
              <InputNumber style={{ marginLeft: 20 }} min={1} max={100} />
            </li>
            <li style={{ margin: '10px 0 20px 0' }}>
              <span style={{ marginLeft: 16 + '%' }}>限流周期</span>
              <Input style={{ width: 80, marginLeft: 20 }}></Input>
            </li>
            <li>
              <span style={{ marginLeft: 11 + '%' }}>规则默认状态</span>
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={false} style={{ marginLeft: 20 }}></Switch>
            </li>
          </ul>
        </Modal>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return { state }
}

export default connect(mapStateToProps, {
})(ApiGateway)
