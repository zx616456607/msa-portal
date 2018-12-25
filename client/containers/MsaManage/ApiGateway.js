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
import { withNamespaces } from 'react-i18next'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

const DEFAULT_QUERY = {
  page: 0,
  size: 10,
}
@withNamespaces('apiGateway')
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
    const { createGatewayPolicy, clusterID, t } = this.props
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
        message: t('list.createSuccess'),
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
    const { clusterID, editGatewayPolicy, t } = this.props
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
        message: t('list.updateSuccess'),
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
    const { deleteGatewayPolicy, clusterID, t } = this.props
    const self = this
    confirm({
      modalTitle: t('list.optionDelete'),
      title: t('list.deleteAlertMsg', {
        replace: { service_id: item.service_id },
      }),
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
              message: t('list.deleteSuccess'),
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
    const { clusterID, getMsaList, t } = this.props
    this.setState({
      visible: true,
    })
    getMsaList(clusterID).then(res => {
      if (res.error) {
        this.setState({
          visible: false,
        })
        return Modal.info({
          title: t('list.alert'),
          content: (
            <div>
              { t('list.retry') }
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
    const { form, t } = this.props
    const { validateFields, setFields } = form
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (!/^[0-9]+$/.test(values.limits)) {
        setFields({
          limits: {
            value: values.limits,
            errors: [ new Error(t('list.validateMsg')) ],
          },
        })
        return
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(values.refresh_interval)) {
        setFields({
          refresh_interval: {
            value: values.refresh_interval,
            errors: [ new Error(t('list.validateMsg')) ],
          },
        })
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
    const { editGatewayPolicy, clusterID, t } = this.props
    const {
      id: policyID, type, service_id,
      limits, refresh_interval, status,
    } = stopOrStartItem
    const self = this
    const body = { type, service_id, limits, refresh_interval, status: !status }
    await editGatewayPolicy(clusterID, policyID, body)
    notification.success({
      message: status ? t('list.disableSuccess') : t('list.enableSuccess'),
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
    const { t } = this.props
    if (!stopOrStartItem || !stopOrStartItem.service_id) return null
    const {
      service_id, status,
    } = stopOrStartItem
    const handlerName = status ? t('list.disable') : t('list.enable')
    const footer = [
      <Button
        key="back"
        onClick={this.handleStopOrStartCancel}>{t('list.cancelText')}</Button>,
      <Button
        key="submit"
        type="primary"
        loading={isLoadingStopOrStart}
        disabled={!status && this.hasOpenPolicy() && !iHasKnowCheckbox}
        onClick={this.handleStopOrStartOk}>
        {t('list.okText')}
      </Button>,
    ]
    return (
      <Modal
        title={t('list.optionName', {
          replace: { name: handlerName },
        })}
        visible={stopOrStartVisible}
        onCancel={this.handleStopOrStartCancel}
        footer={footer}
        className={'api-gateway-stop-modal'}
      >
        <div className={'title'}>
          <Icon className={'icon'} type="question-circle" />
          {
            t('list.optionAlert', {
              replace: { service_id, handlerName },
            })
          }
        </div>
        {
          !status && this.hasOpenPolicy() &&
          <Checkbox
            value={iHasKnowCheckbox}
            onChange={e => this.setState({ iHasKnowCheckbox: e.target.checked })}
            className={'checkbox'}>
            {
              t('list.enableMsg', {
                replace: { service_id },
              })
            }
          </Checkbox>
        }
      </Modal>
    )
  }

  renderLabel = () => {
    const { t } = this.props
    return (
      <span>
        { t('list.selectMicroService') } &nbsp;
        <Tooltip title={t('list.tooltip')}><Icon type="info-circle-o" /></Tooltip>
      </span>
    )
  }
  render() {
    const {
      form, policesList, isFetching,
      totalElements, t,
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
          <Menu.Item key="disable">{ item.status ? t('list.disable') : t('list.enable')}</Menu.Item>
          <Menu.Item key="delete">{ t('list.delete') }</Menu.Item>
        </Menu>
      })
    }
    const columns = [{
      title: t('list.microServiceName'),
      size: 14,
      dataIndex: 'service_id',
    }, {
      title: t('list.limitType'),
      dataIndex: 'type',
      render: text => <div>{ text ? text : t('list.nothing') }</div>,
    // }, {
    //  title: '具体对象',
    //  dataIndex: 'object',
    }, {
      title: t('list.maxLimit'),
      dataIndex: 'limits',
    }, {
      title: t('list.window'),
      dataIndex: 'refresh_interval',
    }, {
      title: t('list.ruleStatus'),
      dataIndex: 'status',
      render: status => <div>
        {
          status
            ? <Badge status="success" text={t('list.enable')}/>
            : <Badge status="error" text={t('list.disable')}/>
        }
      </div>,
    }, {
      title: t('list.option'),
      dataIndex: 'operation',
      render: (text, record, index) => <div>
        {
          <Dropdown.Button overlay={menu[index]} type="ghost" onClick={this.editGateway.bind(this, record) }>
            {t('list.edit')}
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
            <span style={{ color: '#fff' }}>{t('list.addLimitRules')}</span>
          </Button>
          <Button className="search" onClick={this.reloadGatewayPolicyList}>
            <Icon type="sync" />
            <span>{t('list.refresh')}</span>
          </Button>
          {/* <Button>
            <Icon type="delete" />
            <span>删除</span>
          </Button> */}
          <Search
            placeholder={t('list.searchWithName')}
            style={{ width: 200 }}
            onSearch={this.searchGateway}
            onChange={this.searchInputChange}
          />
          {
            totalElements !== 0 && <div className="page">
              <span className="total">{
                t('list.totalElements', {
                  replace: { totalElements },
                })
              }</span>
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
          title={ currentHandle === 'create' ? t('list.addLimitRules') : t('list.editLimitRules') }
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
                    message: t('list.addLimitRules'),
                  }],
                })(
                  <Select
                    placeholder={ t('list.pleaseSelectMicroService') }
                    disabled={currentHandle === 'edit'}
                    onChange={this.onSelectServiceChange}
                  >
                    { this.renderMsaOption() }
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              label={ t('list.limitType') }
              key="gatewayType"
              {...formItemLayout}
            >
              {
                getFieldDecorator('type', {
                  initialValue: [],
                  rules: [{
                    required: false,
                    message: t('list.pleaseSelectLimitType'),
                  }],
                })(
                  <Select
                    placeholder={t('list.pleaseSelectLimitType')}
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
              label={t('list.maxLimitLabel')}
              key="gatewayThreshold"
              {...formItemLayout}
            >
              {
                getFieldDecorator('limits', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: t('list.maxLimitValidateMsg'),
                  }],
                })(
                  <InputNumber placeholder={t('list.pleaseInputMaxLimit')} min={0} step={100} max={999999} />
                )
              }
              &nbsp;&nbsp;{t('list.times')}
            </FormItem>
            <FormItem
              label={t('list.window')}
              key="gatewayInterval"
              {...formItemLayout}
            >
              {
                getFieldDecorator('refresh_interval', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: t('list.pleaseInputWindow'),
                  }],
                })(
                  <InputNumber placeholder={t('list.pleaseInputWindow')} min={1} max={60} />
                )
              }
              &nbsp;&nbsp;{t('list.seconds')}
            </FormItem>
            { currentHandle === 'create' && <FormItem
              label={t('list.enableDefault')}
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
                      checkedChildren={t('list.on')}
                      unCheckedChildren={t('list.off')}
                      className="gateway-switch"
                    />
                  )
                }
                {
                  this.hasOpenPolicy() &&
                  <span className={'api-gateway-has-open-policy'}>
                    <Icon type="info-circle-o" className={'gateway-info-o'}/>
                    <span className="right-text">{t('list.msg')}</span>
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
