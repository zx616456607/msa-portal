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
  Form, Spin, Card, Checkbox,
  notification, Badge,
  Tooltip,
} from 'antd'
import {
  gatewayPagePoliciesList,
  createGatewayPolicy,
  deleteGatewayPolicy,
  editGatewayPolicy,
  gatewayHasOpenPolicy,
} from '../../actions/gateway'
import { getMsaList } from '../../actions/msa'
import { msaListSlt } from '../../selectors/msa'
import { gatewayPolicesListSlt, gatewayHasOpenPolicySlt } from '../../selectors/gateway'
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
    stopOrStartVisible: false,
    stopOrStartItem: {},
    iHasKnowCheckbox: false,
    isLoadingStopOrStart: false,
  }

  componentDidMount() {
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
    const query = {
      page: 0,
      size: 99,
      service_id: item.service_id,
    }
    !item.status && this.loadGatewayHasOpenPolicy(query)
    this.setState({
      stopOrStartVisible: true,
      stopOrStartItem: item,
      selectedServiceId: item.service_id,
      isLoadingStopOrStart: false,
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

  loadGatewayHasOpenPolicy = (newQuery = {}) => {
    const query = Object.assign({}, DEFAULT_QUERY, newQuery)
    const { gatewayHasOpenPolicy, clusterID } = this.props
    gatewayHasOpenPolicy(clusterID, query)
  }

  hasOpenPolicy = () => {
    const { gatewayHasOpenPolicyList } = this.props
    const { selectedServiceId } = this.state
    if (!selectedServiceId) return false
    let flag = false
    gatewayHasOpenPolicyList.map(policy =>
      policy.service_id === selectedServiceId && policy.status && (flag = true))
    return flag
  }
  onSelectServiceChange = v => {
    const query = {
      page: 0,
      size: 99,
      service_id: v,
    }
    this.loadGatewayHasOpenPolicy(query)
    this.setState({
      selectedServiceId: v,
    })
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
    const { searchValue } = this.state
    let query = {
      page: page - 1,
      size: 10,
    }
    if (searchValue) {
      query = Object.assign({}, query, {
        service_id: encodeURIComponent(searchValue),
      })
    }
    this.loadGatewayPoliciesList(query)
  }

  renderMsaOption = () => {
    const { msaListLoading, msaList } = this.props
    if (msaListLoading) {
      return <Option value="loading" disabled><Spin /></Option>
    }
    return msaList.map(item => {
      return <Option
        value={item.appName}
        key={`list${item.appName}`}
      >
        {item.appName}
      </Option>
    })
  }

  reloadGatewayPolicyList = () => {
    const { currentPage, searchValue } = this.state
    let query = {
      page: currentPage - 1,
      size: 10,
    }
    if (searchValue) {
      query = Object.assign({}, query, {
        service_id: encodeURIComponent(searchValue),
      })
    }
    this.loadGatewayPoliciesList(query)
  }

  searchGateway = () => {
    const { searchValue } = this.state
    this.setState({
      currentPage: 1,
    })
    const query = {
      page: 0,
      size: 10,
      service_id: encodeURIComponent(searchValue),
    }
    this.loadGatewayPoliciesList(query)
  }

  searchInputChange = e => {
    const value = e.target.value
    const searchValue = value ? value.trim() : ''
    this.setState({
      searchValue,
    })
  }
  handleStopOrStartCancel = () => {
    this.setState({
      stopOrStartVisible: false,
      stopOrStartItem: {},
      iHasKnowCheckbox: false,
      isLoadingStopOrStart: false,
    })
  }
  handleStopOrStartOk = async () => {
    this.setState({
      isLoadingStopOrStart: true,
    })
    const { stopOrStartItem } = this.state
    const { editGatewayPolicy, clusterID } = this.props
    const {
      id: policyID, type, service_id,
      limits, refresh_interval, status,
    } = stopOrStartItem
    const self = this
    const body = { type, service_id, limits, refresh_interval, status: !status }
    await editGatewayPolicy(clusterID, policyID, body)
    notification.success({
      message: `${status ? '停用' : '启用'}微服务限流规则成功`,
    })
    self.reloadGatewayPolicyList()
    self.setState({
      stopOrStartVisible: false,
      stopOrStartItem: {},
      iHasKnowCheckbox: false,
      isLoadingStopOrStart: false,
    })
  }
  renderStopOrStartModal = () => {
    const {
      stopOrStartVisible, stopOrStartItem, iHasKnowCheckbox, isLoadingStopOrStart } = this.state
    if (!stopOrStartItem || !stopOrStartItem.service_id) return null
    const {
      service_id, status,
    } = stopOrStartItem
    const handlerName = status ? '停用' : '启用'
    const footer = [
      <Button
        key="back"
        onClick={this.handleStopOrStartCancel}>取消</Button>,
      <Button
        key="submit"
        type="primary"
        loading={isLoadingStopOrStart}
        disabled={!status && this.hasOpenPolicy() && !iHasKnowCheckbox}
        onClick={this.handleStopOrStartOk}>
        确定
      </Button>,
    ]
    return (
      <Modal
        title={`${handlerName}操作`}
        visible={stopOrStartVisible}
        onCancel={this.handleStopOrStartCancel}
        footer={footer}
        className={'api-gateway-stop-modal'}
      >
        <div className={'title'}>
          <Icon className={'icon'} type="question-circle" />
          {`确认将微服务 ${service_id} 的限流规则${handlerName}吗？`}
        </div>
        {
          !status && this.hasOpenPolicy() &&
          <Checkbox
            value={iHasKnowCheckbox}
            onChange={e => this.setState({ iHasKnowCheckbox: e.target.checked })}
            className={'checkbox'}>
            启用此规则的同时, 将停用微服务 {service_id} 的其他限流规则
          </Checkbox>
        }
      </Modal>
    )
  }

  renderLabel = () => {
    return (
      <span>
        选择微服务&nbsp;
        <Tooltip title={'所选服务被移除后，该限流规则同时被移除'}><Icon type="info-circle-o" /></Tooltip>
      </span>
    )
  }
  render() {
    const {
      form, policesList, isFetching,
      totalElements,
    } = this.props
    const {
      visible, confirmLoading,
      currentHandle, currentPage,
    } = this.state
    const { getFieldDecorator } = form
    let menu = []
    if (policesList && policesList.length) {
      menu = policesList.map(item => {
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
      title: '限流阈值（次）',
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
            ? <Badge status="success" text="启用"/>
            : <Badge status="error" text="停用"/>
        }
      </div>,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => <div>
        {
          <Dropdown.Button overlay={menu[index]} type="ghost" onClick={this.editGateway.bind(this, record) }>
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
            onSearch={this.searchGateway}
            onChange={this.searchInputChange}
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
          <Card>
            <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={policesList}
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
              label={this.renderLabel()}
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
                    onChange={this.onSelectServiceChange}
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
              label="限流阈值"
              key="gatewayThreshold"
              {...formItemLayout}
            >
              {
                getFieldDecorator('limits', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '请输入限流阈值',
                  }],
                })(
                  <InputNumber placeholder="请输入限流阈值"/>
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
              <div className={'api-gateway-policy-container'}>
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
                      className="gateway-switch"
                    />
                  )
                }
                {
                  this.hasOpenPolicy() &&
                  <span className={'api-gateway-has-open-policy'}>
                    <Icon type="info-circle-o" className={'gateway-info-o'}/>
                    <span className="right-text">该服务已存在启用状态的限流规则，开启后将停用该服务的其他限流规则</span>
                  </span>
                }
              </div>
            </FormItem> }
          </Form>
        </Modal>}
        {
          this.renderStopOrStartModal()
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  const { msaList, msaListLoading } = msaListSlt(state)
  const { policesList, isFetching, totalElements } = gatewayPolicesListSlt(state)
  const { gatewayHasOpenPolicy } = gatewayHasOpenPolicySlt(state)
  return {
    clusterID: id,
    msaList,
    msaListLoading,
    policesList,
    isFetching,
    totalElements,
    gatewayHasOpenPolicyList: gatewayHasOpenPolicy,
  }
}

export default connect(mapStateToProps, {
  gatewayPagePoliciesList,
  getMsaList,
  createGatewayPolicy,
  deleteGatewayPolicy,
  editGatewayPolicy,
  gatewayHasOpenPolicy,
})(Form.create()(ApiGateway))
