/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Public Instances
 *
 * 2017-12-11
 * @author zhangcz
 */

import React from 'react'
import './style/PublicInstances.less'
import QueueAnim from 'rc-queue-anim'
import {
  Button, Input, Pagination, Table,
  Card,
} from 'antd'
import ApplyforCSBInstanceModal from './ApplyforCSBInstanceModal'
import confirm from '../../../../components/Modal/confirm'

const Search = Input.Search

export default class PublicInstances extends React.Component {
  state = {
    applyforCSBInstanceModalVisible: false,
    confirmLoading: false,
    currentRecord: {},
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = () => {

  }

  openApplyforCSBInstanceModal = record => {
    console.log('record=', record)
    this.setState({
      applyforCSBInstanceModalVisible: true,
      confirmLoading: false,
      currentRecord: record,
    })
  }

  cancelApplyforCSBInstance = record => {
    console.log('record=', record)
    const self = this
    confirm({
      modalTitle: '撤销申请实例',
      title: '是否确定撤销申请使用实例？',
      content: '',
      okText: '撤销',
      onOk() {
        self.loadData()
      },
    })
  }

  closeApplyforCSBInstanceModal = () => {
    this.setState({
      applyforCSBInstanceModalVisible: false,
    })
  }

  confirmApplyforCSBInstance = values => {
    console.log('values=', values)
  }

  searchData = e => {
    const searchValue = e.target.value
    console.log('searchValue=', searchValue)
  }

  renderServiceStatusUI = status => {
    switch (status) {
      case 1:
        return <span className="available"><div className="status-icon"></div>可用</span>
      case 2:
        return <span className="may-apply"><div className="status-icon"></div>可申请</span>
      case 3:
        return <span className="applying"><div className="status-icon"></div>申请中</span>
      default:
        return <span>未知</span>
    }
  }

  render() {
    const { applyforCSBInstanceModalVisible, confirmLoading, currentRecord } = this.state
    const columns = [
      { title: '实例名称', dataIndex: 'name', key: 'name', width: '15%' },
      { title: '部署集群', dataIndex: 'cluster', key: 'cluster', width: '15%' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: status => this.renderServiceStatusUI(status),
        filters: [{
          text: '可用',
          value: 1,
        }, {
          text: '可申请',
          value: 2,
        }],
        filterMultiple: false,
        onFilter: (value, record) => record.status.toString() === value,
      },
      { title: '创建人', dataIndex: 'create', key: 'create', width: '15%' },
      { title: '描述', dataIndex: 'desc', key: 'desc', width: '15%' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: '15%' },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '10%',
        render: (text, record) => {
          if (record.status === 3) {
            return <Button type="ghost" onClick={this.cancelApplyforCSBInstance.bind(this, record)}>撤销申请</Button>
          }
          if (record.status === 2) {
            return <Button
              type="primary"
              onClick={this.openApplyforCSBInstanceModal.bind(this, record)}
              style={{ width: 80 }}
            >
              申请
            </Button>
          }
          return <div className="nohandler-style">-</div>
        },
      },
    ]
    const tableDataSource = []
    for (let i = 0; i < 5; i++) {
      const item = {
        key: i,
        name: 'qeweqweq',
        cluster: '北京',
        status: i,
        create: 'eqweqweq',
        desc: 'hello tenxcloud',
        createTime: '2020-1-1',
      }
      tableDataSource.push(item)
    }
    const total = 10
    const paginationProps = {
      simple: true,
      total,
    }
    return <QueueAnim id="PublicInstances">
      <div className="layout-content-btns" key="layout-content-btns">
        <Button type="primary" icon="reload" onClick={this.loadData}>刷新</Button>
        <Search
          placeholder="按微服务名称搜索"
          className="search-style"
          onPressEnter={this.searchData}
        />
        {
          total > 0 && <div className="page-box">
            <span className="total">共 {total} 条</span>
            <Pagination {...paginationProps}/>
          </div>
        }
      </div>
      <div className="layout-content-body" key="layout-content-body">
        <Card hoverable={false}>
          <Table
            columns={columns}
            dataSource={tableDataSource}
            // rowSelection={rowSelection}
            pagination={false}
            // loading={isFetching}
            rowKey={record => record.key}
          />
        </Card>
      </div>
      {
        applyforCSBInstanceModalVisible && <ApplyforCSBInstanceModal
          closeModalMethod={this.closeApplyforCSBInstanceModal.bind(this)}
          loading={confirmLoading}
          callback={this.confirmApplyforCSBInstance}
          currentRecord={currentRecord}
        />
      }
    </QueueAnim>
  }
}
