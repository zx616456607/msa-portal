/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Services
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Card, Button, Select, Input, Pagination, Table, Menu, Dropdown,
  Modal,
} from 'antd'
import ServicesTable from './Services/Table'
import confirm from '../../../../components/Modal/confirm'

const Option = Select.Option
const Search = Input.Search

class MyPublishedServiceGroups extends React.Component {
  state = {
    currentHandle: undefined,
    currentRecord: {},
    confirmLoading: false,
    createServiceGroupModalVisible: false,
    searchType: 'group-name',
  }

  openCreateServiceGroupModal = (currentHandle, currentRecord = {}) => {
    this.setState({
      createServiceGroupModalVisible: true,
      currentHandle,
      currentRecord,
      confirmLoading: false,
    })
  }

  searchTypeSelect = searchType => {
    this.setState({
      searchType,
    })
  }

  deleteServiceGroup = record => {
    const self = this
    if (record.num > 1) {
      return Modal.info({
        title: '删除服务组',
        content: <span>服务组中仍有服务，不能执行删除操作，清空服务组中的服务后，方可执行删除操作</span>,
        onOk7() { },
      })
    }
    confirm({
      modalTitle: '删除服务组',
      title: `服务组一旦删除，将不可恢复，请确认是否不再需要该服务组，确定删除服务组 ${record.name} 吗？`,
      content: '',
      onOk() {
        self.loadData()
      },
    })
  }

  serviceGroupMenuClick = (record, item) => {
    const { key } = item
    switch (key) {
      case 'stop':
        return this.stopServiceGroup(record)
      case 'delete':
        return this.deleteServiceGroup(record)
      default:
        return
    }
  }

  // 显示服务组
  allServiceGroupsTable = () => {
    const expandedRowRender = () => <ServicesTable loadData={() => {}} />

    const tableDataSource = [
      {
        key: 1,
        groupName: '我的组',
        charge: '我',
        tel: '12312341234',
        status: '1',
        num: '2',
        des: '我的描述',
        time: '222222222',
      },
    ]

    const columns = [
      { title: '服务组名', dataIndex: 'groupName', key: 'groupName' },
      { title: '负责人', dataIndex: 'charge', key: 'charge' },
      { title: '负责人电话', dataIndex: 'tel', key: 'tel' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '服务数量', dataIndex: 'num', key: 'num' },
      { title: '描述', dataIndex: 'des', key: 'des' },
      { title: '创建时间', dataIndex: 'time', key: 'time' }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          const menu = <Menu style={{ width: 80 }}
            onClick={this.serviceGroupMenuClick.bind(this, record)}
          >
            <Menu.Item key="stop">停止</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
          return <Dropdown.Button overlay={menu} onClick={this.openCreateServiceGroupModal.bind(this, 'edit', record)}>
            编辑
          </Dropdown.Button>
        },
      },
    ]

    return <Table
      columns={columns}
      expandedRowRender={expandedRowRender}
      dataSource={tableDataSource}
      pagination={false}
      rowKey={record => record.key}
      indentSize={0}
    />
  }

  render() {
    const {
      createServiceGroupModalVisible, currentHandle, currentRecord,
      confirmLoading,
    } = this.state
    const selectBefore = (
      <Select
        defaultValue="group-name"
        style={{ width: 90 }}
        onChange={value => this.searchTypeSelect(value)}
      >
        <Option value="group-name">服务组名</Option>
        <Option value="service-name">服务名称</Option>
      </Select>
    )
    const total = 10
    const paginationProps = {
      simple: true,
      total,
    }
    return [
      <div className="layout-content-btns">
        <Button onClick={this.goPublishService} type="primary" key="layout-content-btns">
        发布服务
        </Button>
        <Button icon="plus" onClick={this.openCreateServiceGroupModal.bind(this, 'create')}>
        创建服务组
        </Button>
        <Button icon="sync">刷新</Button>
        <Search
          addonBefore={selectBefore}
          placeholder="请输入关键词搜索"
          className="search-input"
          onChange={e => this.setState({ name: e.target.value })}
          onSearch={name => this.loadData({ name, page: 1 })}
          value={this.state.name}
        />
        {
          total > 0 && <div className="page-box">
            <span className="total">共 {total} 条</span>
            <Pagination {...paginationProps} />
          </div>
        }
      </div>,
      <div key="data-box" className="layout-content-body">
        <Card>
          {this.allServiceGroupsTable()}
        </Card>
      </div>,
      <div key="modals">
        {
          createServiceGroupModalVisible && <CreateServiceGroupModal
            closeModalMethod={this.closeCreateServiceGroupModal.bind(this)}
            callback={this.handleCreateModalValues}
            handle={currentHandle}
            initailValue={currentRecord}
            loading={confirmLoading}
          />
        }
      </div>,
    ]
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  //
})(MyPublishedServiceGroups)
