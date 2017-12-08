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
import ServiceDetailDock from '../ServiceDetail/Dock'
import QueueAnim from 'rc-queue-anim'
import {
  Card, Button, Radio, Dropdown,
  Select, Input, Pagination,
  Menu, Table, Modal, Form, Row, Col,
} from 'antd'
import '../style/myPublishedServices.less'
import CreateServiceGroupModal from './CreateServiceGroupModal'
import BlackAndWhiteListModal from './BlackAndWhiteListModal'
import confirm from '../../../../components/Modal/confirm'

const RadioGroup = Radio.Group
const Option = Select.Option
const Search = Input.Search
const FormItem = Form.Item

class MyPublishedServices extends React.Component {
  state = {
    currentHandle: undefined,
    currentRecord: {},
    confirmLoading: false,
    visible: false,
    createServiceGroupModalVisible: false,
    searchType: 'group-name',
    blackAndWhiteListModalVisible: false,
  }

  goPublishService = () => {
    const { history, match } = this.props
    const { instanceID } = match.params
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  allServicesTable = () => {
    const columns = [
      { title: '服务名', dataIndex: 'serviceName', key: 'serviceName', width: '13%' },
      { title: '服务版本', dataIndex: 'version', key: 'version', width: '10%' },
      { title: '所属服务组', dataIndex: 'group', key: 'group', width: '10%' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: status => this.renderServiceStatusUI(status),
      },
      { title: '待审批订阅', dataIndex: 'wait', key: 'wait', width: '10%' },
      { title: '累计调用量', dataIndex: 'num', key: 'num', width: '10%' },
      { title: '平均RT（ms）', dataIndex: 'ave', key: 'ave', width: '10%' },
      { title: '发布时间', dataIndex: 'time', key: 'time', width: '10%' },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '10%',
        render: (text, record) => this.renderHandleServiceDropdown(record),
      },
    ]
    const tableDataSource = []
    for (let i = 1; i < 4; i++) {
      const item = {
        key: i,
        serviceName: 'hello',
        version: '1.1',
        group: 'hellogroup',
        status: i,
        wait: i,
        num: i,
        ave: i,
        time: i,
      }
      tableDataSource.push(item)
    }
    return <Table
      columns={columns}
      dataSource={tableDataSource}
      // rowSelection={rowSelection}
      pagination={false}
      // loading={isFetching}
      // key={ record => record.key}
    />
  }

  allServiceGroupsTable = () => {
    const expandedRowRender = () => {
      const columns = [
        { title: '服务名称', dataIndex: 'date', key: 'date' },
        { title: '服务版本', dataIndex: 'name', key: 'name' },
        { title: '服务状态', key: 'state', render: status => this.renderServiceStatusUI(status) },
        { title: '待审批订阅', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        { title: '发布时间', dataIndex: 'time', key: 'time' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => this.renderHandleServiceDropdown(record),
        },
      ]

      const data = []
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
          status: 1,
        })
      }
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={record => record.key}
        />
      )
    }

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

  closeCreateServiceGroupModal = () => {
    this.setState({
      createServiceGroupModalVisible: false,
    })
  }

  closeblackAndWhiteModal = () => {
    this.setState({
      blackAndWhiteListModalVisible: false,
    })
  }

  deleteServiceGroup = record => {
    const self = this
    if (record.num > 1) {
      return Modal.info({
        title: '删除服务组',
        content: <span>服务组中仍有服务，不能执行删除操作，清空服务组中的服务后，方可执行删除操作</span>,
        onOk() {},
      })
    }
    confirm({
      modalTitle: '删除服务组',
      title: `服务组一旦删除，将不可恢复，请确认是否不再需要该服务组，确定删除服务组 ${record.name} 吗？`,
      content: '',
      onOk() {
        self.lodaData()
      },
    })
  }

  handleCreateModalValues = values => {
    console.log('values=', values)
  }

  handleSaveBlackAndWhiteList = values => {
    console.log('values=', values)
  }

  lodaData = () => {
  }

  logoutServiceChange = value => {
    console.log('value=', value)
  }

  logoutService = record => {
    const self = this
    confirm({
      modalTitle: '注销',
      title: '注销服务后，不可以对该服务进行变更，启动，停止和订购操作。',
      content: `Tips：对于没有被订阅过的服务，注销后不可见。定注销服务 ${record.name} 吗？确定注销服务 xxx 吗？`,
      onOk() {
        self.lodaData()
      },
    })
  }

  openCreateServiceGroupModal = (currentHandle, currentRecord = {}) => {
    this.setState({
      createServiceGroupModalVisible: true,
      currentHandle,
      currentRecord,
      confirmLoading: false,
    })
  }

  openBlackAndWhiteListModal = record => {
    console.log('record=', record)
    this.setState({
      blackAndWhiteListModalVisible: true,
      confirmLoading: false,
    })
  }

  renderDifferentTable = () => {
    const { form } = this.props
    const { getFieldValue } = form
    const showType = getFieldValue('showType')
    switch (showType) {
      case 'all':
        return this.allServicesTable()
      case 'group':
        return this.allServiceGroupsTable()
      default:
        return
    }
  }

  renderHandleServiceDropdown = record => {
    const menu = <Menu style={{ width: 100 }}
      onClick={this.serviceMenuClick.bind(this, record)}
    >
      <Menu.Item key="edit">编辑</Menu.Item>
      <Menu.Item key="start">启动</Menu.Item>
      <Menu.Item key="list">黑／白名单</Menu.Item>
      <Menu.Item key="logout">注销</Menu.Item>
    </Menu>
    return (
      <Dropdown.Button
        overlay={menu}
        onClick={this.viewServiceDetails.bind(this, record)}
      >
        显示详情
      </Dropdown.Button>
    )
  }

  renderServiceStatusUI = status => {
    switch (status) {
      case 1:
        return <span className="activated"><div className="status-icon"></div>已激活</span>
      case 2:
        return <span className="cancelled"><div className="status-icon"></div>已注销</span>
      case 3:
        return <span className="deactivated"><div className="status-icon"></div>已停用</span>
      default:
        return <span>未知</span>
    }
  }

  searchTypeSelect = searchType => {
    this.setState({
      searchType,
    })
  }

  searchWithServiceName = value => {
    console.log('value=', value)
  }

  searchWithServiceGroup = value => {
    const { searchType } = this.state
    console.log('searchType=', searchType)
    console.log('value=', value)
  }

  serviceMenuClick = (record, item) => {
    const { key } = item
    console.log('record=', record)
    switch (key) {
      case 'edit':
        return console.log('edit')
      case 'start':
        return this.startService(record)
      case 'stop':
        return this.stopService(record)
      case 'list':
        return this.openBlackAndWhiteListModal(record)
      case 'logout':
        return this.logoutService(record)
      default:
        return
    }
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

  showTypeChange = value => {
    console.log('value=', value)
  }

  startService = record => {
    const self = this
    confirm({
      modalTitle: '启动服务',
      title: '您确定要启动这个服务吗？',
      content: '',
      onOk() {
        console.log('start.record=', record)
        self.lodaData()
      },
    })
  }

  stopService = record => {
    const self = this
    confirm({
      modalTitle: '停止服务',
      title: '您确定要停止发布这个服务吗？',
      content: '',
      onOk() {
        console.log('stop.service.record=', record)
        self.lodaData()
      },
    })
  }

  stopServiceGroup = record => {
    const self = this
    confirm({
      modalTitle: '停止服务组',
      title: `停止服务组操作将使服务组中的所有服务全部停止。确定停止服务组 ${record.groupName} 吗？`,
      content: '',
      onOk() {
        self.lodaData()
      },
    })
  }

  viewServiceDetails = record => {
    console.log('record=', record)
    this.setState({ visible: true })
  }

  render() {
    const {
      createServiceGroupModalVisible, currentHandle, currentRecord,
      confirmLoading, blackAndWhiteListModalVisible, visible,
    } = this.state
    const { form } = this.props
    const { getFieldValue, getFieldDecorator } = form
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
    const showType = getFieldValue('showType')
    return (
      <QueueAnim id="my-published-services">
        <div className="showType">
          <Row>
            <Col span="10">
              <FormItem
                label={<span>显示方式：</span>}
                key="showType"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 15 }}
                className="showType"
              >
                {
                  getFieldDecorator('showType', {
                    initialValue: 'all',
                    onChange: this.showTypeChange,
                  })(
                    <RadioGroup>
                      <Radio value="all">显示全部服务</Radio>
                      <Radio value="group">显示服务组</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
            {
              showType === 'all' && <Col span="12">
                <FormItem
                  label={<span>已注销服务：</span>}
                  key="logoutService"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 15 }}
                  className="showType"
                >
                  {
                    getFieldDecorator('logoutService', {
                      initialValue: 'all',
                      onChange: this.logoutServiceChange,
                    })(
                      <RadioGroup>
                        <Radio value="all">不显示</Radio>
                        <Radio value="group">显示</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
            }
          </Row>
        </div>
        <div className="layout-content-btns" key="layout-content-btns">
          <Button onClick={this.goPublishService} type="primary">
          发布服务
          </Button>
          {
            showType === 'group' && <Button icon="plus" onClick={this.openCreateServiceGroupModal.bind(this, 'create') }>创建服务组</Button>
          }
          <Button icon="sync">刷新</Button>
          {
            showType === 'group'
              ? <Search
                addonBefore={selectBefore}
                placeholder="请输入关键词搜索"
                className="search-input"
                onSearch={this.searchWithServiceGroup}
              />
              : <Search
                placeholder="按服务名称搜索"
                className="search-input"
                onSearch={this.searchWithServiceName}
              />
          }
          {
            total > 0 && <div className="page-box">
              <span className="total">共 { total } 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div key="data-box" className="layout-content-body">
          <Card hoverable={false}>
            { this.renderDifferentTable() }
          </Card>
        </div>
        {
          createServiceGroupModalVisible && <CreateServiceGroupModal
            closeModalMethod={this.closeCreateServiceGroupModal.bind(this)}
            callback={this.handleCreateModalValues}
            handle={currentHandle}
            initailValue={currentRecord}
            loading={confirmLoading}
          />
        }
        {
          blackAndWhiteListModalVisible && <BlackAndWhiteListModal
            closeblackAndWhiteModal={this.closeblackAndWhiteModal.bind(this)}
            callback={this.handleSaveBlackAndWhiteList}
            loading={confirmLoading}
          />
        }
        <ServiceDetailDock
          visible={visible}
          onVisibleChange={visible => this.setState({ visible })}
        />
      </QueueAnim>
    )
  }
}

export default Form.create()(MyPublishedServices)
