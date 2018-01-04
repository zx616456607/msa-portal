/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Subscribed Service
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import {
  Card, Button, Radio,
  Input, Pagination, Table,
  Menu, Dropdown,
  Row, Col, Select, notification,
} from 'antd'
import './style/MySubscribedService.less'
import ServiceApIDoc from './ServiceApIDoc'
import confirm from '../../../../components/Modal/confirm'
import EditBindIpModal from './EditBindIpModal'
import SubscriptionDetailDock from './SubscriptionDetailDock'
import { connect } from 'react-redux'
import {
  getMySubscribedServiceList,
  getServiceApiDoc,
  editServiceBindIp,
  unsubscriveService,
} from '../../../../actions/CSB/instanceService/mySubscribedServices'
import { getInstanceServiceOverview } from '../../../../actions/CSB/instanceService/index'
import { mySbuscrivedServicesSlt } from '../../../../selectors/CSB/instanceService/mySubscribedService'
import {
  formatDate,
  toQuerystring,
  parseOrderToQuery,
  parseQueryToSortorder,
} from '../../../../common/utils'
import isEqual from 'lodash/isEqual'
import { parse as parseQuerystring } from 'query-string'
import union from 'lodash/union'
import SubscriptServiceModal from '../SubscriptionServices/SubscriptServiceModal'
import {
  renderCSBInstanceServiceStatus,
  renderCSBInstanceServiceApproveStatus,
} from '../../../../components/utils/index'

const RadioGroup = Radio.Group
const Search = Input.Search
const MenuItem = Menu.Item
const InputGroup = Input.Group
const Option = Select.Option

class MySubscribedService extends React.Component {
  state = {
    serviceApIDocModal: false,
    editBindIpModalVisible: false,
    confirmLoading: false,
    subDetailVisible: false,
    currentService: {},
    searchType: 'serviceName',
    subFilteredValue: [ '2', '3' ],
    name: '',
    subVisible: false,
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const {
      requestStatus,
      serviceName: service,
      groupName: group,
      evidenceName: evidence,
    } = query
    let searchType = 'serviceName'
    let name = ''
    if (service) {
      searchType = 'serviceName'
      name = service
    } else if (group) {
      searchType = 'groupName'
      name = group
    } else if (evidence) {
      searchType = 'evidenceName'
      name = evidence
    }
    this.setState({
      name,
      subFilteredValue: this.renderSubFilteredValue(requestStatus),
      searchType,
    }, this.loadData)
  }

  renderSubFilteredValue = requestStatus => {
    if (!requestStatus) {
      return [ '1', '2', '3' ]
    }
    if (Array.isArray(requestStatus)) {
      return requestStatus
    }
    if (typeof requestStatus === 'string') {
      return [ requestStatus ]
    }
    return [ '1', '2', '3' ]
  }

  confirmEditBindIp = () => {
    this.setState({
      confirmLoading: false,
      editBindIpModalVisible: false,
    })
  }

  loadData = (query = {}) => {
    const {
      getMySubscribedServiceList, instanceID, location, history,
    } = this.props
    const { name, subFilteredValue, searchType } = this.state
    if (location.query) {
      delete location.query.serviceName
      delete location.query.evidenceName
      delete location.query.groupName
    }
    query = Object.assign({}, { view: 'subscriber' }, location.query, {
      requestStatus: subFilteredValue,
      [searchType]: name,
    }, query)
    if (query.page && query.page === 1) {
      delete query.page
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    getMySubscribedServiceList(instanceID, query).then(res => {
      if (res.error) return
      const data = res.response.entities.csbInstanceMySubscribedServices
      const serviceIds = []
      for (const item in data) {
        serviceIds.push(data[item].serviceId)
      }
      const reqServiceIds = union(serviceIds)
      if (!reqServiceIds.length) return
      const { getInstanceServiceOverview } = this.props
      getInstanceServiceOverview(instanceID, reqServiceIds)
    })
  }

  openEditBindIpModal = () => {
    this.setState({
      editBindIpModalVisible: true,
      confirmLoading: false,
    })
  }

  tableChange = (pagination, filters, sorter) => {
    const { status, serviceStatus } = filters
    let requestStatus = status
    if (status && !status.length) {
      requestStatus = [ '1', '2', '3' ]
    }
    this.setState({
      subFilteredValue: requestStatus,
    }, () => {
      if (!status) {
        requestStatus = 4
      }
      return this.loadData({
        requestStatus,
        page: 1,
        sort: parseOrderToQuery(sorter),
        serviceStatus,
      })
    })
  }

  tableMenuClick = (record, item) => {
    const { key } = item
    this.setState({
      confirmLoading: false,
    })
    switch (key) {
      case 'details':
        return this.setState({
          subDetailVisible: true,
          currentService: record,
        })
      case 'unsubscibe':
        return this.unsubscibeService(record)
      case 'editIP':
        return this.openEditBindIpModal(record)
      default:
        return
    }
  }

  unsubscibeService = record => {
    const { unsubscriveService, instanceID } = this.props
    const { id, serviceName } = record
    const self = this
    confirm({
      modalTitle: '退订',
      title: `你确定要退订服务 ${serviceName} 吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          unsubscriveService(instanceID, id).then(res => {
            if (res.error) return reject()
            resolve()
            notification.success({ message: '退订服务成功' })
            self.loadData()
          })
        })
      },
    })
  }

  subStatusChange = e => {
    const status = e.target.value
    let requestStatus = [ '4' ]
    if (status === 1) {
      requestStatus = [ '1', '2', '3' ]
    }
    this.setState({
      requestStatus,
      subFilteredValue: requestStatus,
      name: '',
    }, () => this.loadData({
      requestStatus,
      page: 1,
      sort: null,
    }))
  }

  openServiceApiDocModal = currentService => {
    const { getServiceApiDoc, instanceID } = this.props
    const { serviceId } = currentService
    const callback = () => getServiceApiDoc(instanceID, serviceId).then(() => {
      this.setState({ confirmLoading: false })
    })
    this.setState({
      serviceApIDocModal: true,
      currentService,
      confirmLoading: true,
    }, callback)
  }

  reSubscribeService = record => {
    this.setState({
      currentService: record,
      subVisible: true,
    })
  }

  render() {
    const {
      serviceApIDocModal, editBindIpModalVisible, confirmLoading,
      subDetailVisible, currentService, searchType, subFilteredValue,
      name, subVisible,
    } = this.state
    const { mySubscribedServicelist, serviceList, location, match, instanceID } = this.props
    const { query = {} } = location
    const { requestStatus, page, serviceStatus } = query
    const { isFetching, size, totalElements, content } = mySubscribedServicelist
    const paginationProps = {
      simple: true,
      total: totalElements,
      size,
      current: parseInt(page) || 1,
      onChange: page => this.loadData({ page }),
    }
    let radioGroupValue = 1
    if (requestStatus === '4') {
      radioGroupValue = 4
    }
    const subFilters = [
      { text: '待审批', value: '1' },
      { text: '已通过', value: '2' },
      { text: '已拒绝', value: '3' },
    ]
    let serviceStatusFilteredValue = [ '1', '2' ]
    if (serviceStatus && serviceStatus.length === 1) {
      serviceStatusFilteredValue = [ serviceStatus ]
    }
    if (serviceStatus && serviceStatus.length === 2) {
      serviceStatusFilteredValue = serviceStatus
    }
    let sortObj = {
      requestTime: false,
      approvalTime: false,
      totalCallCount: false,
      totalErrorCallCount: false,
      averageCallTime: false,
    }
    sortObj = Object.assign({}, sortObj, parseQueryToSortorder(sortObj, query))
    const columns = [
      { title: '订阅服务名称', dataIndex: 'serviceName', width: '8%' },
      {
        title: '服务状态',
        dataIndex: 'serviceStatus',
        width: '8%',
        filters: [
          { text: '已激活', value: 1 },
          { text: '已停用', value: 2 },
        ],
        filteredValue: serviceStatusFilteredValue,
        render: status => renderCSBInstanceServiceStatus(status),
      },
      { title: '服务版本', dataIndex: 'serviceVersion', width: '8%' },
      { title: '所属服务组', dataIndex: 'serviceGroupName', width: '8%' },
      { title: '我的消费凭证', dataIndex: 'evidenceName', width: '8%' },
      {
        title: '订阅状态',
        dataIndex: 'status',
        width: '8%',
        filters: radioGroupValue === 1 ? subFilters : null,
        filteredValue: radioGroupValue === 1 ? subFilteredValue : null,
        render: text => renderCSBInstanceServiceApproveStatus(text),
      },
      {
        title: '订阅时间', dataIndex: 'requestTime', width: '10%',
        sorter: true,
        sortOrder: sortObj.requestTime,
        render: text => formatDate(text),
      },
      {
        title: '审批时间', dataIndex: 'approvalTime', width: '10%',
        sorter: true,
        sortOrder: sortObj.approvalTime,
        render: text => formatDate(text),
      },
      {
        title: '累计调用量',
        dataIndex: 'totalCallCount',
        width: '8%',
        // sorter: true,
        // sortOrder: sortObj.totalCallCount,
        render: text => (text !== undefined ? text : '-'),
      }, {
        title: '累计错误量',
        dataIndex: 'totalErrorCallCount',
        width: '8%',
        // sorter: true,
        // sortOrder: sortObj.totalErrorCallCount,
        render: text => (text !== undefined ? text : '-'),
      }, {
        title: '平均RT（ms）',
        dataIndex: 'averageCallTime',
        width: '8%',
        // sorter: true,
        // sortOrder: sortObj.averageCallTime,
        render: text => (
          text !== undefined
            ? Math.ceil(text * 100) / 100
            : '-'
        ),
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '8%',
        render: (text, record) => {
          if (record.status === 4) {
            return <Button type="primary" onClick={this.reSubscribeService.bind(this, record)}>重新订阅</Button>
          }
          const menu = <Menu style={{ width: 110 }}
            onClick={this.tableMenuClick.bind(this, record)}
          >
            <MenuItem key="details">订阅详情</MenuItem>
            <MenuItem key="unsubscibe">退订</MenuItem>
            <MenuItem key="editIP">修改绑定 IP</MenuItem>
          </Menu>
          return <Dropdown.Button overlay={menu}
            onClick={this.openServiceApiDocModal.bind(this, record)}
          >
            查看文档
          </Dropdown.Button>
        },
      },
    ]
    return (
      <QueueAnim id="my-subscribed-ervice">
        <Row key="showType" className="showType">
          <Col span={5}>服务订阅的状态：</Col>
          <Col span={15}>
            <RadioGroup value={radioGroupValue} onChange={this.subStatusChange}>
              <Radio value={1}>不含退订服务</Radio>
              <Radio value={4}>退订的服务</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <div className="layout-content-btns handler-row" key="layout-content-btns">
          <Button icon="reload" type="primary" onClick={() => this.loadData()}>刷新</Button>
          <InputGroup compact>
            <Select
              value={searchType}
              onChange={searchType => this.setState({ searchType, name: '' })}
            >
              <Option value="serviceName">服务名称</Option>
              <Option value="evidenceName">消费凭证</Option>
              <Option value="groupName">所属服务组</Option>
            </Select>
            <Search
              placeholder="按订阅服务名称搜索"
              className="serch-style"
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              onSearch={() => this.loadData({ page: 1, [searchType]: name })}
            />
          </InputGroup>
          {totalElements > 0 && <div className="page-box">
            <span className="total">共 {totalElements} 条</span>
            <Pagination {...paginationProps}/>
          </div>}
        </div>
        <div className="layout-content-body" key="layout-content-body">
          <Card>
            <Table
              columns={columns}
              dataSource={content}
              pagination={false}
              rowKey={record => record.id}
              indentSize={0}
              loading={isFetching}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {
          serviceApIDocModal && <ServiceApIDoc
            closeModalMethod={() => this.setState({ serviceApIDocModal: false })}
            serviceList={serviceList}
            currentService={currentService}
            loading={confirmLoading}
          />
        }
        {
          editBindIpModalVisible && <EditBindIpModal
            closeModalMethod={() => this.setState({ editBindIpModalVisible: false })}
            callback={this.confirmEditBindIp}
            loading={confirmLoading}
          />
        }
        { subDetailVisible && <SubscriptionDetailDock
          visible={subDetailVisible}
          onVisibleChange={subDetailVisible => this.setState({ subDetailVisible })}
          currentService={currentService}
        /> }
        {
          subVisible && <SubscriptServiceModal
            closeModalMethod={() => this.setState({ subVisible: false })}
            visible={subVisible}
            match={match}
            dateSource={currentService}
            from="mySubcribeUI"
            callback={this.loadData.bind(this)}
            instanceID={instanceID}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { match, location } = ownProps
  const { instanceID } = match.params
  const mySubscribedServicelist = mySbuscrivedServicesSlt(state, ownProps)
  const serviceList = entities.cbsPublished || {}
  location.query = parseQuerystring(location.search)
  return {
    instanceID,
    mySubscribedServicelist,
    serviceList,
  }
}

export default connect(mapStateToProps, {
  getMySubscribedServiceList,
  getServiceApiDoc,
  editServiceBindIp,
  unsubscriveService,
  getInstanceServiceOverview,
})(MySubscribedService)
