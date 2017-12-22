/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Services Table
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ServiceDetailDock from '../../ServiceDetail/Dock'
import {
  Dropdown, Menu, Table, Modal,
} from 'antd'
import '../style/MyPublishedServices.less'
import BlackAndWhiteListModal from '../BlackAndWhiteListModal'
import confirm from '../../../../../components/Modal/confirm'
import { getInstanceService } from '../../../../../actions/CSB/instanceService'


class ServicesTable extends React.Component {
  static propTypes = {
    // 获取列表数据的函数
    loadData: PropTypes.func.isRequired,
    // 列表数据
    dataSource: PropTypes.array,
  }

  state = {
    confirmLoading: false,
    visible: false,
    blackAndWhiteListModalVisible: false,
  }

  componentWillMount() {
    // this.loadData()
  }

  closeblackAndWhiteModal = () => {
    this.setState({
      blackAndWhiteListModalVisible: false,
    })
  }

  deleteServiceGroup = record => {
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
        //
      },
    })
  }

  handleCreateModalValues = values => {
    console.log('values=', values)
  }

  handleSaveBlackAndWhiteList = values => {
    console.log('values=', values)
  }

  // 是否显示已注销服务
  logoutServiceChange = value => {
    console.log('value=', value)
  }

  logoutService = record => {
    // const self = this
    confirm({
      modalTitle: '注销',
      title: '注销服务后，不可以对该服务进行变更，启动，停止和订购操作。',
      content: `Tips：对于没有被订阅过的服务，注销后不可见。定注销服务 ${record.name} 吗？确定注销服务 xxx 吗？`,
      onOk() {
        // self.loadData()
      },
    })
  }

  openBlackAndWhiteListModal = record => {
    console.log('record=', record)
    this.setState({
      blackAndWhiteListModalVisible: true,
      confirmLoading: false,
    })
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

  searchWithServiceName = value => {
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

  startService = record => {
    // const self = this
    confirm({
      modalTitle: '启动服务',
      title: '您确定要启动这个服务吗？',
      content: '',
      onOk() {
        console.log('start.record=', record)
        // self.loadData()
      },
    })
  }

  stopService = record => {
    // const self = this
    confirm({
      modalTitle: '停止服务',
      title: '您确定要停止发布这个服务吗？',
      content: '',
      onOk() {
        console.log('stop.service.record=', record)
        // self.loadData()
      },
    })
  }

  viewServiceDetails = record => {
    console.log('record=', record)
    this.setState({ visible: true })
  }

  render() {
    // const { dataSource } = this.props
    const {
      confirmLoading, blackAndWhiteListModalVisible, visible,
    } = this.state
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
    return [
      <Table
        columns={columns}
        dataSource={tableDataSource}
        // dataSource={dataSource}
        pagination={false}
        // loading={isFetching}
        // key={ record => record.key}
      />,
      <div key="modals">
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
      </div>,
    ]
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  getInstanceService,
})(ServicesTable)
