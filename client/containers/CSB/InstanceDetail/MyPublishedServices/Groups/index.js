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
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import isEqual from 'lodash/isEqual'
import {
  Button, Select, Input, Pagination, Table, Menu, Dropdown,
  Modal, notification, Badge,
} from 'antd'
import ServicesTable from '../ServicesTable'
import confirm from '../../../../../components/Modal/confirm'
import CreateServiceGroupModal from './CreateServiceGroupModal'
import ServiceOrGroupSwitch from '../ServiceOrGroupSwitch'
import {
  formatDate,
  toQuerystring,
} from '../../../../../common/utils'
import {
  CSB_INSTANCE_SERVICE_STATUS_RUNNING,
  CSB_INSTANCE_SERVICE_STATUS_STOPPED,
} from '../../../../../constants'
import {
  getGroups,
  getGroupServices,
  deleteGroup,
  updateGroupStatus,
} from '../../../../../actions/CSB/instanceService/group'
import {
  serviceGroupsSlt,
  groupServicesSlt,
} from '../../../../../selectors/CSB/instanceService/group'
import './style/index.less'

const Option = Select.Option
const Search = Input.Search

const defaultQuery = {
  page: 1,
  size: 10,
}
const mergeQuery = query => Object.assign(
  {},
  defaultQuery,
  query
)

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

  loadData = query => {
    const { getGroups, instanceID, location, history } = this.props
    query = Object.assign({}, location.query, { name }, query)
    if (query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    getGroups(instanceID, mergeQuery(query))
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
    let status
    let text
    switch (action) {
      case 'start':
        status = CSB_INSTANCE_SERVICE_STATUS_RUNNING
        text = '启动'
        break
      case 'stop':
        status = CSB_INSTANCE_SERVICE_STATUS_STOPPED
        text = '停止'
        break
      default:
        break
    }
    confirm({
      modalTitle: `${text}服务组`,
      title: `${text}服务组操作将使服务组中的所有服务全部${text}。确定${text}服务组 ${record.name} 吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const { instanceID, updateGroupStatus } = self.props
          updateGroupStatus(instanceID, record.id, { status }).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: `${text}服务组成功`,
            })
            self.loadData()
          })
        })
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

  loadGroupServices = (groupID, query = {}) => {
    const { instanceID, getGroupServices } = this.props
    getGroupServices(instanceID, groupID, query)
  }

  handleExpandedRowRender = record => {
    const { groupsServices, history, match } = this.props
    const currentGroupServices = groupsServices[record.id] || {}
    const { isFetching, content, totalElements, size } = currentGroupServices
    return <ServicesTable
      from="group"
      loadData={this.loadGroupServices.bind(this, record.id)}
      dataSource={content}
      total={totalElements}
      pageSize={size}
      loading={isFetching}
      size="small"
      history={history}
      match={match}
    />
  }

  render() {
    const { serviceGroups, instanceID, history, location } = this.props
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
        render: (text, row) => {
          const { stoppedCount, activeCount } = row
          return <span>
            {
              stoppedCount > 0 &&
              <div>
                <Badge status="error" text={`停止 +${stoppedCount}`} />
              </div>
            }
            {
              activeCount > 0 &&
              <div>
                <Badge status="success" text={`运行 +${activeCount}`} />
              </div>
            }
            {
              stoppedCount < 1 && activeCount < 1 && '-'
            }
          </span>
        },
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
            <Menu.Item key="start" disabled={record.stoppedCount < 1}>
            启动
            </Menu.Item>
            <Menu.Item key="stop" disabled={record.activeCount < 1}>
            停止
            </Menu.Item>
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
    const { query } = location
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    return <QueueAnim className="service-groups">
      <div key="type" className="show-type">
        <ServiceOrGroupSwitch
          defaultValue="group"
          instanceID={instanceID}
          history={history}
        />
      </div>
      <div key="btns" className="layout-content-btns">
        <Button onClick={this.goPublishService} type="primary" key="layout-content-btns">
        发布服务
        </Button>
        <Button icon="plus" onClick={this.openCreateServiceGroupModal.bind(this, 'create')}>
        创建服务组
        </Button>
        <Button icon="sync" onClick={this.loadData.bind(this, null)}>刷新</Button>
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
      </div>
      <div key="data-box" className="layout-content-body service-groups-body">
        <Table
          columns={columns}
          expandedRowRender={this.handleExpandedRowRender}
          dataSource={content}
          loading={isFetching}
          pagination={false}
          rowKey={record => record.id}
          indentSize={0}
        />
      </div>
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
      </div>
    </QueueAnim>
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match, location } = ownProps
  const { instanceID } = match.params
  location.query = parseQuerystring(location.search)
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
  updateGroupStatus,
})(MyPublishedServiceGroups)
