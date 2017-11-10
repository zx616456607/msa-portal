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
import QueueAnim from 'rc-queue-anim'
import './style/apiGateway.less'
import {
  Button, Icon, Table,
  Pagination, Modal, Dropdown,
  Input, Menu, Select,
  Switch, InputNumber,
  Form, Spin, Card,
  notification,
} from 'antd'
import {
  gatewayPagePoliciesList,
  createGatewayPolicy,
  deleteGatewayPolicy,
  editGatewayPolicy,
} from '../../actions/gateway'
import { getMsaList } from '../../actions/msa'
import { msaListSlt } from '../../selectors/msa'
import { allPolicesListSlt } from '../../selectors/gateway'
import confirm from '../../components/Modal/confirm'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

const DEFAULT_QUERY = {
  page: 0,
  size: 10,
}

class ApiGateway extends React.Component {
  state = {
    visible: false,
    selectedRowKeys: [],
    confirmLoading: false,
    hasAlreadyGetMicroServiceList: false,
    currentRecord: undefined,
    currentHandle: undefined,
    currentPage: 1,
  }

  componentWillMount() {
    this.loadGatewayPoliciesList()
  }

  confirmCreateGateway = values => {
    const { createGatewayPolicy, clusterID } = this.props
    const { type } = values
    const body = Object.assign({}, values, { type: type.join(',') })
    createGatewayPolicy(clusterID, body).then(res => {
      if (res.error) {
        this.setState({
          confirmLoading: false,
        })
        return
      }
      notification.success({
        message: '创建成功',
      })
      this.reloadGatewayPolicyList()
      this.setState({
        confirmLoading: false,
        visible: false,
      })
    })
  }

  confirmEditGateway = values => {
    const { currentRecord } = this.state
    const { clusterID, editGatewayPolicy } = this.props
    const { id: policyID } = currentRecord
    const { type } = values
    const body = Object.assign(
      {},
      values,
      { type: type ? type.join(',') : '' }
    )
    editGatewayPolicy(clusterID, policyID, body).then(res => {
      if (res.error) {
        this.setState({
          confirmLoading: false,
        })
        return
      }
      notification.success({
        message: '编辑成功',
      })
      const { currentPage } = this.state
      this.loadGatewayPoliciesList({ page: currentPage - 1 })
      this.setState({
        confirmLoading: false,
        visible: false,
      })
    })
  }

  deleteGateWay = item => {
    const { deleteGatewayPolicy, clusterID } = this.props
    const self = this
    confirm({
      modalTitle: '删除操作',
      title: `确认将微服务 ${item.service_id} 的限流规则删除吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const { id: policyID } = item
          deleteGatewayPolicy(clusterID, policyID).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '删除微服务限流规则成功',
            })
            self.reloadGatewayPolicyList()
          })
        })
      },
    })
  }

  disableGateway = item => {
    const { editGatewayPolicy, clusterID } = this.props
    const {
      id: policyID, type, service_id,
      limits, refresh_interval, status,
    } = item
    const self = this
    const body = {
      type,
      service_id,
      limits,
      refresh_interval,
      status: !status,
    }
    const handlerName = status ? '停用' : '启用'
    confirm({
      modalTitle: `${handlerName}操作`,
      title: `确认将微服务 ${item.service_id} 的限流规则${handlerName}吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          editGatewayPolicy(clusterID, policyID, body).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: `${handlerName}微服务限流规则成功`,
            })
            self.reloadGatewayPolicyList()
          })
        })
      },
    })
  }

  editGateway = record => {
    const { form } = this.props
    this.setState({
      confirmLoading: false,
      visible: true,
      currentHandle: 'edit',
      currentRecord: record,
    }, () => {
      const {
        limits,
        refresh_interval,
        service_id,
        type,
      } = record
      form.setFieldsValue({
        limits,
        refresh_interval,
        service_id,
        type: type ? type.split(',') : undefined,
      })
    })
  }

  getMicroServiceList = () => {
    const { clusterID, getMsaList } = this.props
    this.setState({
      visible: true,
    })
    getMsaList(clusterID).then(res => {
      if (res.error) {
        this.setState({
          visible: false,
        })
        return Modal.info({
          title: '提示',
          content: (
            <div>
              获取微服务列表失败，请点击重试！
            </div>
          ),
          onOk() {},
        })
      }
      this.setState({
        hasAlreadyGetMicroServiceList: true,
      })
    })
  }

  handleAdd = () => {
    const { hasAlreadyGetMicroServiceList } = this.state
    this.setState({
      currentHandle: 'create',
      confirmLoading: false,
    })
    if (hasAlreadyGetMicroServiceList) {
      this.setState({
        visible: true,
      })
      return
    }
    this.getMicroServiceList()
  }

  handleOk = () => {
    const { currentHandle } = this.state
    const { form } = this.props
    const { validateFields } = form
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true,
      })
      switch (currentHandle) {
        case 'create':
          return this.confirmCreateGateway(values)
        case 'edit':
          return this.confirmEditGateway(values)
        default:
          return
      }
    })
  }

  loadGatewayPoliciesList = (newQuery = {}) => {
    const query = Object.assign({}, DEFAULT_QUERY, newQuery)
    const { gatewayPagePoliciesList, clusterID } = this.props
    gatewayPagePoliciesList(clusterID, query)
  }

  menuClick = (item, e) => {
    const { key } = e
    switch (key) {
      case 'disable':
        return this.disableGateway(item)
      case 'delete':
        return this.deleteGateWay(item)
      default:
        return
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  paginationChange = page => {
    this.setState({
      currentPage: page,
    })
    this.loadGatewayPoliciesList({ page: page - 1 })
  }

  renderMsaOption = () => {
    const { msaListLoading, msaList } = this.props
    if (msaListLoading) {
      return <Option value="loading" disabled><Spin /></Option>
    }
    return msaList.map(item => {
      return <Option
        value={item.serviceName}
        key={`list${item.serviceName}`}
      >
        {item.serviceName}
      </Option>
    })
  }

  reloadGatewayPolicyList = () => {
    const { currentPage } = this.state
    const query = Object.assign({}, DEFAULT_QUERY, { page: currentPage - 1 })
    this.loadGatewayPoliciesList(query)
  }

  searchGateway = value => {
    const searchValue = value.trim()
    const { currentPage } = this.state
    const query = {
      page: currentPage - 1,
      size: 10,
      service_id: searchValue,
    }
    this.loadGatewayPoliciesList(query)
  }

  render() {
    const {
      form, allPolicesList, isFetching,
      totalElements,
    } = this.props
    const {
      visible, confirmLoading,
      currentHandle, currentPage,
    } = this.state
    const { getFieldDecorator } = form
    let menu = []
    if (allPolicesList && allPolicesList.length) {
      menu = allPolicesList.map(item => {
        return <Menu
          style={{ width: '79px' }}
          onClick={this.menuClick.bind(this, item)}
        >
          <Menu.Item key="disable">{ item.status ? '停用' : '启用'}</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      })
    }
    const columns = [{
      title: '微服务名称',
      size: 14,
      dataIndex: 'service_id',
    }, {
      title: '限流类型',
      dataIndex: 'type',
      render: text => <div>{ text ? text : '暂无' }</div>,
    // }, {
    //  title: '具体对象',
    //  dataIndex: 'object',
    }, {
      title: '限流阀值（次）',
      dataIndex: 'limits',
    }, {
      title: '窗口（秒）',
      dataIndex: 'refresh_interval',
    }, {
      title: '规则状态',
      dataIndex: 'status',
      render: status => <div>
        {
          status
            ? <span className="success-status">
              <p className="icon_style able_background"/>
              &nbsp;启用
            </span>
            : <span className="error-status">
              <p className="icon_style disable_background"/>
            &nbsp;停用
            </span>
        }
      </div>,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => <div>
        {
          <Dropdown.Button overlay={menu[index]} type="ghost" onClick={ this.editGateway.bind(this, record) }>
            编辑
          </Dropdown.Button>
        }
      </div>,
    }]

    // const rowSelection = {
    //  selectedRowKeys,
    //  onChange: this.onSelectChange,
    // }

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    }

    return (
      <QueueAnim className="api-gateway">
        <div className="router-manage-btn-box layout-content-btns" key="header">
          <Button icon="plus" className="add" type="primary" onClick={() => this.handleAdd()}>
            <span style={{ color: '#fff' }}>添加限流规则</span>
          </Button>
          <Button className="search" onClick={this.reloadGatewayPolicyList}>
            <Icon type="sync" />
            <span>刷新</span>
          </Button>
          {/* <Button>
            <Icon type="delete" />
            <span>删除</span>
          </Button> */}
          <Search
            placeholder="按微服务名称搜索"
            style={{ width: 200 }}
            onSearch={value => this.searchGateway(value)}
          />
          {
            totalElements !== 0 && <div className="page">
              <span className="total">共 { totalElements } 条</span>
              <Pagination
                simple
                current={currentPage}
                total={totalElements}
                pageSize={10}
                onChange={this.paginationChange}
                // showTotal={ total => `共 ${total} 条` }
              />
            </div>
          }
        </div>
        <div className="layout-content-body" key="body">
          <Card noHovering>
            <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={allPolicesList}
              loading={isFetching}
              pagination={false}
              rowKey={record => record.id}
            />
          </Card>
        </div>
        { visible && <Modal
          title={ currentHandle === 'create' ? '添加限流规则' : '编辑限流规则' }
          visible
          onOk={ this.handleOk }
          onCancel={ () => { this.setState({ visible: false }) } }
          confirmLoading={ confirmLoading }
          maskClosable={false}
        >
          <Form>
            <FormItem
              label="选择微服务"
              key="slectMicroService"
              {...formItemLayout}
            >
              {
                getFieldDecorator('service_id', {
                  rules: [{
                    required: true,
                    message: '请选择微服务',
                  }],
                })(
                  <Select
                    placeholder="请选择微服务"
                    disabled={currentHandle === 'edit'}
                  >
                    { this.renderMsaOption() }
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              label="限流类型"
              key="gatewayType"
              {...formItemLayout}
            >
              {
                getFieldDecorator('type', {
                  initialValue: [],
                  rules: [{
                    required: false,
                    message: '请选择限流类型',
                  }],
                })(
                  <Select
                    placeholder="请选择限流类型"
                    allowClear={true}
                    mode="multiple"
                  >
                    <Option value="user" key="string">user</Option>
                    <Option value="url" key="url">url</Option>
                    <Option value="origin" key="origin">origin</Option>
                  </Select>
                )
              }
            </FormItem>
            {/* <FormItem
              label="具体对象"
              key="specificObject"
              {...formItemLayout}
            >
              {
                getFieldDecorator('specificObject', {
                  rules: [{
                    required: false,
                    message: '请选择具体对象',
                  }],
                })(
                  <Select placeholder="请选择具体对象"/>
                )
              }
            </FormItem> */}
            <FormItem
              label="限流阀值"
              key="gatewayThreshold"
              {...formItemLayout}
            >
              {
                getFieldDecorator('limits', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '请输入限流阀值',
                  }],
                })(
                  <InputNumber placeholder="请输入限流阀值"/>
                )
              }
              次
            </FormItem>
            <FormItem
              label="窗口"
              key="gatewayInterval"
              {...formItemLayout}
            >
              {
                getFieldDecorator('refresh_interval', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '请输入窗口',
                  }],
                })(
                  <InputNumber placeholder="请输入窗口"/>
                )
              }
              秒
            </FormItem>
            { currentHandle === 'create' && <FormItem
              label="默认开启"
              key="status"
              {...formItemLayout}
            >
              {
                getFieldDecorator('status', {
                  valuePropName: 'checked',
                  initialValue: false,
                  rules: [{
                    required: true,
                  }],
                })(
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                  />
                )
              }
            </FormItem> }
          </Form>
        </Modal>}
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  const { msaList, msaListLoading } = msaListSlt(state)
  const { allPolicesList, isFetching, totalElements } = allPolicesListSlt(state)
  return {
    clusterID: id,
    msaList,
    msaListLoading,
    allPolicesList,
    isFetching,
    totalElements,
  }
}

export default connect(mapStateToProps, {
  gatewayPagePoliciesList,
  getMsaList,
  createGatewayPolicy,
  deleteGatewayPolicy,
  editGatewayPolicy,
})(Form.create()(ApiGateway))
