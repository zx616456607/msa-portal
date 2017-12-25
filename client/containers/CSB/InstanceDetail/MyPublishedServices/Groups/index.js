/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Service Groups
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Card, Button, Select, Input, Pagination, Table, Menu, Dropdown,
  Modal, notification,
} from 'antd'
import ServicesTable from '../Services/Table'
import confirm from '../../../../../components/Modal/confirm'
import CreateServiceGroupModal from './CreateServiceGroupModal'
import {
  formatDate,
} from '../../../../../common/utils'
import {
  createGroup,
  getGroups,
} from '../../../../../actions/CSB/instanceService/group'
import {
  serviceGroupsSlt,
} from '../../../../../selectors/CSB/instanceService/group'

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

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { getGroups, instanceID } = this.props
    getGroups(instanceID)
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

  // 发布服务
  goPublishService = () => {
    const { history, instanceID } = this.props
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  closeCreateServiceGroupModal = () => {
    this.setState({
      createServiceGroupModalVisible: false,
    })
  }

  handleCreateGroup = body => {
    const { createGroup, instanceID } = this.props
    this.setState({
      confirmLoading: true,
    })
    createGroup(instanceID, body).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) {
        return
      }
      notification.success({
        message: '创建服务组成功',
      })
      this.closeCreateServiceGroupModal()
      this.loadData()
    })
  }

  render() {
    const { serviceGroups } = this.props
    const { isFetching, content, totalElements, size } = serviceGroups
    const {
      createServiceGroupModalVisible, currentHandle, currentRecord,
      confirmLoading,
    } = this.state
    const columns = [
      { title: '服务组名', dataIndex: 'name', key: 'name' },
      { title: '负责人', dataIndex: 'ownerName', key: 'ownerName' },
      { title: '负责人电话', dataIndex: 'ownerPhone', key: 'ownerPhone' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, row) => <span>
          {row.stoppedCount} 停止，{row.activeCount} 运行
        </span>,
      },
      { title: '服务数量', dataIndex: 'servicesCount', key: 'servicesCount' },
      { title: '描述', dataIndex: 'description', key: 'description' },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        render: text => formatDate(text),
      },
      {
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
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
    }
    return [
      <div className="layout-content-btns" key="btns">
        <Button onClick={this.goPublishService} type="primary" key="layout-content-btns">
        发布服务
        </Button>
        <Button icon="plus" onClick={this.openCreateServiceGroupModal.bind(this, 'create')}>
        创建服务组
        </Button>
        <Button icon="sync" onClick={this.loadData}>刷新</Button>
        <Search
          addonBefore={selectBefore}
          placeholder="请输入关键词搜索"
          className="search-input"
          onChange={e => this.setState({ name: e.target.value })}
          onSearch={name => this.loadData({ name, page: 1 })}
          value={this.state.name}
        />
        {
          totalElements > 0 && <div className="page-box">
            <span className="total">共 {totalElements} 条</span>
            <Pagination {...paginationProps} />
          </div>
        }
      </div>,
      <div key="data-box" className="layout-content-body">
        <Card>
          <Table
            columns={columns}
            expandedRowRender={() => <ServicesTable from="group" loadData={() => {}} />}
            dataSource={content}
            loadData={isFetching}
            pagination={false}
            rowKey={record => record.id}
            indentSize={0}
          />
        </Card>
      </div>,
      <div key="modals">
        {
          createServiceGroupModalVisible && <CreateServiceGroupModal
            closeModalMethod={this.closeCreateServiceGroupModal}
            handle={currentHandle}
            initailValue={currentRecord}
            loading={confirmLoading}
            callback={this.handleCreateGroup}
          />
        }
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const { instanceID } = match.params
  return {
    instanceID,
    serviceGroups: serviceGroupsSlt(state),
  }
}

export default connect(mapStateToProps, {
  createGroup,
  getGroups,
})(MyPublishedServiceGroups)
