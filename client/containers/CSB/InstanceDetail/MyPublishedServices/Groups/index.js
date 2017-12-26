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
  getGroups,
  getGroupServices,
  deleteGroup,
} from '../../../../../actions/CSB/instanceService/group'
import {
  serviceGroupsSlt,
  groupServicesSlt,
} from '../../../../../selectors/CSB/instanceService/group'
import './style/index.less'

const Option = Select.Option
const Search = Input.Search

class MyPublishedServiceGroups extends React.Component {
  state = {
    currentHandle: undefined,
    currentRecord: {},
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
    })
  }

  searchTypeSelect = searchType => {
    this.setState({
      searchType,
    })
  }

  toogleServiceGroupStatus = (action, record) => {
    const self = this
    confirm({
      modalTitle: '停止服务组',
      title: `停止服务组操作将使服务组中的所有服务全部停止。确定停止服务组 ${record.groupName} 吗？`,
      content: '',
      onOk() {
        self.loadData()
      },
    })
  }

  deleteServiceGroup = record => {
    const self = this
    if (record.servicesCount > 0) {
      return Modal.info({
        title: '删除服务组',
        content: <span>服务组中仍有服务，不能执行删除操作，清空服务组中的服务后，方可执行删除操作</span>,
      })
    }
    confirm({
      modalTitle: '删除服务组',
      title: `服务组一旦删除，将不可恢复，请确认是否不再需要该服务组，确定删除服务组 ${record.name} 吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const { instanceID, deleteGroup } = self.props
          deleteGroup(instanceID, record.id).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '删除服务组成功',
            })
            self.loadData()
          })
        })
      },
    })
  }

  serviceGroupMenuClick = (record, item) => {
    const { key } = item
    switch (key) {
      case 'stop':
      case 'start':
        return this.toogleServiceGroupStatus(key, record)
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

  loadGroupServices = groupID => {
    const { instanceID, getGroupServices } = this.props
    getGroupServices(instanceID, groupID)
  }

  handleExpandedRowRender = record => {
    const { groupsServices } = this.props
    const currentGroupServices = groupsServices[record.id] || {}
    return <ServicesTable
      from="group"
      loadData={this.loadGroupServices.bind(this, record.id)}
      dataSource={currentGroupServices.content}
      loading={currentGroupServices.isFetching}
      size="small"
    />
  }

  render() {
    const { serviceGroups, instanceID } = this.props
    const { isFetching, content, totalElements, size } = serviceGroups
    const {
      createServiceGroupModalVisible, currentHandle, currentRecord,
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
          const menu = <Menu style={{ width: 88 }}
            onClick={this.serviceGroupMenuClick.bind(this, record)}
          >
            <Menu.Item key="start">启动</Menu.Item>
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
      <div key="data-box" className="layout-content-body service-groups-body">
        <Card>
          <Table
            columns={columns}
            expandedRowRender={this.handleExpandedRowRender}
            dataSource={content}
            loading={isFetching}
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
            loadData={this.loadData}
            instanceID={instanceID}
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
    groupsServices: groupServicesSlt(state),
  }
}

export default connect(mapStateToProps, {
  getGroups,
  getGroupServices,
  deleteGroup,
})(MyPublishedServiceGroups)
