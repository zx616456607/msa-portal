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
  Card, Button, Form, Radio,
  Input, Pagination, Table,
  Menu, Dropdown, Icon, Tooltip,
} from 'antd'
import '../style/mySubscribedService.less'
import ServiceApIDoc from './ServiceApIDoc'
import confirm from '../../../../components/Modal/confirm'
import EditBindIp from './EditBindIp'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Search = Input.Search
const MenuItem = Menu.Item

class MySubscribedService extends React.Component {
  state = {
    serviceApIDocModal: false,
    editBindIpModal: false,
    confirmLoading: false,
  }

  closeServiceApiDocModal = () => {
    this.setState({
      serviceApIDocModal: false,
    })
  }

  closeEditBindIpModal = () => {
    this.setState({
      editBindIpModal: false,
    })
  }

  confirmEditBindIp = values => {
    console.log('values=', values)
    this.setState({
      confirmLoading: true,
    })
  }

  lodaData = () => {}

  manageSubscibe = record => {
    console.log('record=', record)
  }

  openEditBindIpModal = record => {
    console.log('record=', record)
    this.setState({
      editBindIpModal: true,
      confirmLoading: false,
    })
  }

  renderServiceListTable = () => {
    const expandedRowRender = record => {
      console.log('expand.record=', record)
      // return <div className="no-service">该服务为公开状态无需订阅即可访问</div>
      const columns = [
        { title: '我的消费凭证', dataIndex: 'date', key: 'date', width: '16%' },
        { title: '订阅状态', dataIndex: 'status', key: 'status', width: '14%', render: status => this.renderServiceStatusUI(status) },
        { title: '订阅时间', dataIndex: 'name', key: 'name', width: '28%' },
        { title: '审批意见', dataIndex: 'upgradeNum', key: 'upgradeNum', width: '28%' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: '14%',
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

      const data = []
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
          status: i,
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
        status: 1,
        num: '2',
        des: '我的描述',
        time: '222222222',
      },
    ]

    const columns = [
      { title: '订阅服务名称', dataIndex: 'groupName', key: 'groupName', width: '16%' },
      {
        title: '服务状态',
        dataIndex: 'status',
        key: 'status',
        width: '14%',
        filters: [
          { text: '已激活', value: 'Joe' },
          { text: '已停用', value: 'Jim' },
        ],
        onFilter: (value, record) => record.charge.includes(value),
        render: status => this.renderServiceStatusUI(status),
      },
      {
        title: <span>
            订阅状态
          <Tooltip title="依次表示：已通过／已拒绝／待审批／已退订" placement="top">
            <Icon type="question-circle-o"/>
          </Tooltip>
        </span>,
        dataIndex: 'tel',
        key: 'tel',
        width: '14%',
      },
      {
        title: '累计调用量',
        dataIndex: 'charge',
        key: 'charge',
        width: '14%',
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: '累计错误量',
        dataIndex: 'num',
        key: 'num',
        width: '14%',
        sorter: (a, b) => a.num - b.num,
      },
      {
        title: '平均RT（ms）',
        dataIndex: 'des',
        key: 'des',
        width: '14%',
        sorter: (a, b) => a.desc - b.desc,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '14%',
        render: (text, record) => <Button type="primary" onClick={this.manageSubscibe.bind(this, record)}>订阅管理</Button>,
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
        return console.log('details')
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

  openServiceApiDocModal = record => {
    console.log('record=', record)
    this.setState({
      serviceApIDocModal: true,
    })
  }

  render() {
    const { serviceApIDocModal, editBindIpModal, confirmLoading } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const total = 10
    const paginationProps = {
      simple: true,
      total,
    }
    return (
      <QueueAnim id="my-subscribed-ervice">
        <div key="showType">
          <FormItem
            label={<span>服务订阅的状态：</span>}
            {...formItemLayout}
          >
            {
              getFieldDecorator('subscribeStatus', {
                initialValue: 'incloud',
              })(
                <RadioGroup>
                  <Radio value="incloud">含有订阅中的服务</Radio>
                  <Radio value="all">全部订阅的服务</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
        </div>
        <div className="layout-content-btns" key="layout-content-btns">
          <Button icon="reload" type="primary" onClick={this.lodaData}>刷新</Button>
          <Search
            placeholder="按订阅服务名称搜索"
            className="serch-style"
            onSearch={this.searchWithServiceName}
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
            {this.renderServiceListTable()}
          </Card>
        </div>

        {
          serviceApIDocModal && <ServiceApIDoc
            closeModalMethod={this.closeServiceApiDocModal.bind(this)}
          />
        }
        {
          editBindIpModal && <EditBindIp
            closeModalMethod={this.closeEditBindIpModal.bind(this)}
            callback={this.confirmEditBindIp}
            loading={confirmLoading}
          />
        }
      </QueueAnim>
    )
  }
}

export default Form.create()(MySubscribedService)
