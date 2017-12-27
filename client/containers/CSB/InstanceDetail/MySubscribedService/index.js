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
  Menu, Dropdown, Icon, Tooltip,
  Row, Col,
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
} from '../../../../actions/CSB/instanceService/mySubscribedServices'
import { mySbuscrivedServicesSlt } from '../../../../selectors/CSB/instanceService/mySubscribedService'

const RadioGroup = Radio.Group
const Search = Input.Search
const MenuItem = Menu.Item

class MySubscribedService extends React.Component {
  state = {
    serviceApIDocModal: false,
    editBindIpModalVisible: false,
    confirmLoading: false,
    subDetailVisible: false,
    includeDeleted: false,
    currentService: {},
  }

  componentWillMount() {
    this.lodaData()
  }

  closeServiceApiDocModal = () => {
    this.setState({
      serviceApIDocModal: false,
    })
  }

  closeEditBindIpModal = () => {
    this.setState({
      editBindIpModalVisible: false,
    })
  }

  confirmEditBindIp = values => {
    console.log('values=', values)
    this.setState({
      confirmLoading: true,
    })
  }

  lodaData = (query = {}) => {
    const { getMySubscribedServiceList, instanceID } = this.props
    getMySubscribedServiceList(instanceID, query)
  }

  manageSubscibe = record => {
    console.log('record=', record)
  }

  openEditBindIpModal = record => {
    console.log('record=', record)
    this.setState({
      editBindIpModalVisible: true,
      confirmLoading: false,
    })
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

  tableExpandRowMenuClick = (record, item) => {
    const { key } = item
    switch (key) {
      case 'details':
        return this.setState({ subDetailVisible: true })
      case 'subscibe':
        return this.subscibeService(record)
      case 'editIP':
        return this.openEditBindIpModal(record)
      default:
        return
    }
  }

  searchWithServiceName = value => {
    console.log('value=', value)
  }

  subscibeService = record => {
    console.log('record=', record)
    const self = this
    confirm({
      modalTitle: '退订',
      title: '你确定要退订这个服务吗？',
      content: '',
      onOk() {
        self.lodaData()
      },
    })
  }

  subStatusChange = e => {
    const includeDeleted = e.target.value
    this.setState({
      includeDeleted,
    }, () => this.lodaData({ includeDeleted }))
  }

  openServiceApiDocModal = currentService => {
    const { getServiceApiDoc, instanceID } = this.props
    const { serviceId } = currentService
    const callback = () => getServiceApiDoc(instanceID, serviceId).then(() => {
      this.setState({
        confirmLoading: false,
      })
    })
    this.setState({
      serviceApIDocModal: true,
      currentService,
      confirmLoading: true,
    }, callback)
  }

  render() {
    const {
      serviceApIDocModal,
      editBindIpModalVisible,
      confirmLoading,
      subDetailVisible,
      includeDeleted,
      currentService,
    } = this.state
    const { mySubscribedServicelist, serviceList } = this.props
    const { isFetching, size, totalElements, content } = mySubscribedServicelist
    const paginationProps = {
      simple: true,
      total: totalElements,
      size,
    }
    const columns = [
      { title: '订阅服务名称', dataIndex: 'serviceName', key: 'serviceName', width: '10%' },
      {
        title: '服务状态',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        filters: [
          { text: '已激活', value: 'Joe' },
          { text: '已停用', value: 'Jim' },
        ],
        onFilter: (value, record) => record.charge.includes(value),
        render: status => this.renderServiceStatusUI(status),
      },
      { title: '服务版本', dataIndex: 'version', key: 'version', width: '8%' },
      { title: '所属服务组', dataIndex: 'belongs', key: 'belongs', width: '8%' },
      { title: '我的消费凭证', dataIndex: 'evidenceName', key: 'evidenceName', width: '8%' },
      {
        title: <span>
            订阅状态
          <Tooltip title="依次表示：已通过／已拒绝／待审批／已退订" placement="top">
            <Icon type="question-circle-o"/>
          </Tooltip>
        </span>,
        dataIndex: 'tel',
        key: 'tel',
        width: '8%',
      },
      { title: '订阅时间', dataIndex: 'dtime', key: 'dtime', width: '8%' },
      { title: '审批时间', dataIndex: 'stime', key: 'stime', width: '8%' },
      {
        title: '累计调用量',
        dataIndex: 'charge',
        key: 'charge',
        width: '10%',
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: '累计错误量',
        dataIndex: 'num',
        key: 'num',
        width: '10%',
        sorter: (a, b) => a.num - b.num,
      },
      {
        title: '平均RT（ms）',
        dataIndex: 'des',
        key: 'des',
        width: '10%',
        sorter: (a, b) => a.desc - b.desc,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '12%',
        render: (text, record) => {
          const menu = <Menu style={{ width: 110 }}
            onClick={this.tableExpandRowMenuClick.bind(this, record)}
          >
            <MenuItem key="details">订阅详情</MenuItem>
            <MenuItem key="subscibe">订阅</MenuItem>
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
            <RadioGroup value={includeDeleted} onChange={this.subStatusChange}>
              <Radio value={true}>不含退订服务</Radio>
              <Radio value={false}>全部订阅的服务</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <div className="layout-content-btns" key="layout-content-btns">
          <Button icon="reload" type="primary" onClick={() => this.lodaData()}>刷新</Button>
          <Search
            placeholder="按订阅服务名称搜索"
            className="serch-style"
            onSearch={this.searchWithServiceName}
          />
          {
            totalElements > 0 && <div className="page-box">
              <span className="total">共 {totalElements} 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
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
            />
          </Card>
        </div>

        {
          serviceApIDocModal && <ServiceApIDoc
            closeModalMethod={this.closeServiceApiDocModal.bind(this)}
            serviceList={serviceList}
            currentService={currentService}
            loading={confirmLoading}
          />
        }
        {
          editBindIpModalVisible && <EditBindIpModal
            closeModalMethod={this.closeEditBindIpModal.bind(this)}
            callback={this.confirmEditBindIp}
            loading={confirmLoading}
          />
        }
        <SubscriptionDetailDock
          visible={subDetailVisible}
          onVisibleChange={subDetailVisible => this.setState({ subDetailVisible })}
        />
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { match } = ownProps
  const { instanceID } = match.params
  const mySubscribedServicelist = mySbuscrivedServicesSlt(state, ownProps)
  const serviceList = entities.cbsPublished || {}
  return {
    instanceID,
    mySubscribedServicelist,
    serviceList,
  }
}

export default connect(mapStateToProps, {
  getMySubscribedServiceList,
  getServiceApiDoc,
})(MySubscribedService)
