/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance om
 *
 * 2017-12-13
 * @author zhangxuan
 */

import React from 'react'
import { Radio, Button, Icon, Input, Table, Dropdown, Menu, Select } from 'antd'
import QueueAnim from 'rc-queue-anim'
import './style/index.less'
import CreateModal from './CreateModal'
import confirm from '../../../components/Modal/confirm'

const RadioGroup = Radio.Group
const SearchInput = Input.Search
const Option = Select.Option

export default class CSBInstanceOm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createModal: false,
    }
  }

  radioChange = e => {
    this.setState({
      radioValue: e.target.value,
    })
  }

  handleButtonClick = () => {

  }

  stopConfirm = () => {
    confirm({
      modalTitle: '停止 CSB 实例',
      title: '停止后，不能使用实例发布或订阅服务，重新启动后不影响实例中\n' +
      '已发布或已订阅的服务。',
      content: '确定是否停止该实例？',
      onOk: () => {

      },
    })
  }

  deleteConfirm = () => {
    confirm({
      modalTitle: '放弃使用 CSB 实例',
      title: '放弃使用后将不能在此实例中发布、订阅服务；已发布的服务将被\n' +
      '注销，已订购的服务将被退订。',
      content: '确定是否放弃使用 xxx 实例？',
      onOk: () => {

      },
    })
  }

  handleMenuClick = (e, row) => {
    switch (e.key) {
      case 'stop':
        this.stopConfirm()
        break
      case 'edit':
        this.setState({
          createModal: true,
          currentInstance: row,
        })
        break
      case 'delete':
        this.deleteConfirm()
        break
      default:
        break
    }
  }

  openCreateModal = () => {
    this.setState({
      createModal: true,
    })
  }

  closeCreateModal = () => {
    this.setState({
      createModal: false,
      currentInstance: null,
    })
  }

  render() {
    const { radioValue, createModal, currentInstance } = this.state
    const pagination = {
      simple: true,
      total: 10,
      current: 1,
      pageSize: 10,
    }
    const columns = [
      { title: 'CSB实例', dataIndex: 'instance' },
      { title: '创建人', dataIndex: 'creator' },
      { title: '部署集群', dataIndex: 'cluster' },
      { title: '状态', dataIndex: 'status',
        filters: [{
          text: '运行中',
          value: 'running',
        }, {
          text: '正在启动',
          value: 'starting',
        }, {
          text: '已停止',
          value: 'stop',
        }],
      },
      { title: '累计调用量', dataIndex: 'transferNum' },
      { title: 'CPU使用率', dataIndex: 'cpuRate' },
      { title: '内存使用率', dataIndex: 'memoryRate' },
      { title: '创建时间', dataIndex: 'creationTime' },
      { title: '操作',
        render: (text, row) => {
          const menu = (
            <Menu onClick={e => this.handleMenuClick(e, row)} style={{ width: 110 }}>
              <Menu.Item key="stop">停止</Menu.Item>
              <Menu.Item key="edit">修改实例</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>
              实例详情
            </Dropdown.Button>
          )
        },
      },
    ]
    const data = []
    for (let i = 0; i < 3; i++) {
      data.push({
        key: i,
        instance: `instance${i + 1}`,
        creator: 'admin',
        cluster: 'beijing',
        status: '运行中',
        transferNum: 100,
        cpuRate: '80%',
        memoryRate: '70%',
        creationTime: '2017-12-13 12:00:00',
      })
    }
    const selectBefore = (
      <Select defaultValue="creator" style={{ width: 90 }}>
        <Option value="creator">创建人</Option>
        <Option value="instance">实例名称</Option>
      </Select>
    )
    return (
      <QueueAnim className="csb-om">
        <CreateModal
          visible={createModal}
          currentInstance={currentInstance}
          closeCreateModal={this.closeCreateModal}
        />
        <div className="csb-om-radio" key="radios">
          实例状态：
          <RadioGroup onChange={this.radioChange} value={radioValue}>
            <Radio value={false}>全部实例</Radio>
            <Radio value={true}>待启动</Radio>
          </RadioGroup>
        </div>
        <div className="layout-content-btns" key="btns">
          <Button type="primary" onClick={this.openCreateModal}><Icon type="plus"/>创建实例</Button>
          <Button type="primary"><Icon type="sync" /> 刷新</Button>
          <SearchInput
            addonBefore={selectBefore}
            placeholder="请输入关键字搜索"
            style={{ width: 280 }}
          />
          <span className="csb-om-total float-right">共计 10 条</span>
        </div>
        <div className="layout-content-body" key="body">
          <Table
            className="csb-om-table"
            columns={columns}
            dataSource={data}
            pagination={pagination}
          />
        </div>
      </QueueAnim>
    )
  }
}
