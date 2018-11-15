/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Vouchers
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import cloneDeep from 'lodash/cloneDeep'
import {
  Button, Icon, Input, Pagination,
  Dropdown, Table, Card, Menu, Modal,
  Row, Col,
  Form, notification,
} from 'antd'
import './style/index.less'
import {
  createConsumerVoucher,
  getConsumerVouchersList,
  triggerUpdateConsumerVoucher,
  confirmUpdateConsumerVoucher,
  editConsumerVoucher,
  deleteConsumerVoucher,
} from '../../../../actions/CSB/instanceService/consumerVouchers'
import { connect } from 'react-redux'
import { consumeVoucherSlt } from '../../../../selectors/CSB/instanceService/consumerVoucher'
import {
  formatDate,
  parseOrderToQuery,
  parseQueryToSortorder,
  handleHistoryForLoadData,
} from '../../../../common/utils'
import confirm from '../../../../components/Modal/confirm'
import UpdateConsumerVoucher from './UpdateConsumerVoncher'
import { parse as parseQuerystring } from 'query-string'
import IndentTip from './TipSvcDomain/index'
import SubscribedServiceNamePop from './SubscribedServiceNamesPop'

const Search = Input.Search
const FormItem = Form.Item

class ConsumerVouchers extends React.Component {
  state = {
    name: '',
    title: '',
    isAdd: false,
    addVisible: false,
    confirmLoading: false,
    currentConsumerVoucher: {},
    updateVisible: false,
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { name } = query
    this.setState({
      name,
    }, () => this.loadData({}, true))
  }

  confirmDeleteConsumerVoucher = record => {
    const { instanceID, deleteConsumerVoucher } = this.props
    const { name, id } = record
    const self = this
    return confirm({
      modalTitle: '使用实例',
      title: `确定删除消费凭证 ${name} 吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteConsumerVoucher(instanceID, id).then(res => {
            if (res.error) return reject()
            resolve()
            notification.success({
              message: '删除消费凭证成功',
            })
            self.loadData()
          })
        })
      },
    })
  }

  loadData = (query = {}, isFirst) => {
    const { getConsumerVouchersList, instanceID, location, history } = this.props
    const { name } = this.state
    query = Object.assign({}, location.query, { name: name ? encodeURIComponent(name) : '' }, query)
    if (query.page && query.page === 1) {
      delete query.page
    }
    handleHistoryForLoadData(history, query, location, isFirst)
    getConsumerVouchersList(instanceID, query)
  }

  focusNameInput = () => {
    setTimeout(() => {
      this.nameInput.focus()
    }, 200)
  }

  handleAdd = () => {
    this.setState({
      isAdd: true,
      title: '创建消费凭证',
      addVisible: true,
    }, this.focusNameInput)
  }

  handleButtonClick = currentConsumerVoucher => {
    this.setState({
      isAdd: false,
      title: '编辑消费凭证',
      addVisible: true,
      currentConsumerVoucher,
    }, this.focusNameInput)
  }

  createConsumerVoucher = (instanceID, values) => {
    const { createConsumerVoucher } = this.props
    createConsumerVoucher(instanceID, values, { isHandleError: true }).then(res => {
      this.setState({ confirmLoading: false })
      if (res.status === 409) {
        notification.warn({
          message: '消费凭证名称重复',
        })
      }
      if (res.error) return
      notification.success({
        message: '创建消费凭证成功',
      })
      this.setState({ addVisible: false })
      this.loadData()
    })
  }

  editConsumerVoucher = (instanceID, values) => {
    const { editConsumerVoucher } = this.props
    const { currentConsumerVoucher } = this.state
    const { id } = currentConsumerVoucher
    editConsumerVoucher(instanceID, id, values).then(res => {
      this.setState({ confirmLoading: false })
      if (res.status === 409) {
        notification.warn({
          message: '消费名称重复',
        })
      }
      if (res.error) return
      notification.success({ message: '编辑消费凭证成功' })
      this.setState({ addVisible: false })
      this.loadData()
    })
  }

  confirmUpdateConsumeVoucher = () => {
    const { confirmUpdateConsumerVoucher, instanceID } = this.props
    const { currentConsumerVoucher } = this.state
    const { id } = currentConsumerVoucher
    confirmUpdateConsumerVoucher(instanceID, id).then(res => {
      this.setState({ confirmLoading: false })
      if (res.error) return
      this.loadData()
      notification.success({ message: '确认更新成功' })
      this.setState({ updateVisible: false })
    })
  }

  triggerUpdateConsumeVoucher = values => {
    const { triggerUpdateConsumerVoucher, instanceID } = this.props
    const { currentConsumerVoucher } = this.state
    const { id, replacingSecret } = currentConsumerVoucher
    if (replacingSecret) {
      return this.confirmUpdateConsumeVoucher()
    }
    const { updateSetting, delayTime } = values
    const nowTime = new Date()
    let sec = nowTime.getTime()
    let expireAt = new Date(sec).toISOString()
    let body = { expireAt }
    if (updateSetting === 'delay') {
      sec = nowTime.getTime() + delayTime * 60 * 1000
      expireAt = new Date(sec).toISOString()
      body = Object.assign({}, body, { expireAt })
    }
    this.setState({
      confirmLoading: true,
    })
    triggerUpdateConsumerVoucher(instanceID, id, body).then(res => {
      this.setState({ updateVisible: false })
      if (res.error) return
      this.loadData()
      if (updateSetting === 'immediately') {
        this.confirmUpdateConsumeVoucher()
        return
      }
      notification.success({ message: '触发更新成功' })
      this.setState({ confirmLoading: false })
    })
  }

  tableChange = (pagination, filters, sorter) => {
    this.loadData({ sort: parseOrderToQuery(sorter) })
  }

  handleOK = () => {
    const { isAdd } = this.state
    const { form, instanceID } = this.props
    const validateArray = [ 'name' ]
    form.validateFields(validateArray, (errors, values) => {
      if (errors) return
      this.setState({ confirmLoading: true })
      if (isAdd) {
        this.createConsumerVoucher(instanceID, values)
        return
      }
      this.editConsumerVoucher(instanceID, values)
    })
  }

  handleMenu = (record, item) => {
    const { key } = item
    this.setState({
      currentConsumerVoucher: record,
    })
    switch (key) {
      case 'update':
        return this.setState({ updateVisible: true })
      case 'delete':
        return this.confirmDeleteConsumerVoucher(record)
      default:
        return
    }
  }

  filterAs = (column, record, text) => {
    const currentRecord = cloneDeep(record)
    if (column === 2 && !text) {
      return <Row><Col span={24}>-</Col></Row>
    }
    if (column === 2) {
      currentRecord.secret = record.replacingSecret
    }
    return (
      <Row>
        <Col span={10} className="text">{currentRecord.clientId}</Col>
        <Col span={2}>/</Col>
        <Col span={10} className="text">{currentRecord.secret}</Col>
        <Col span={2} className="spread-icon">
          <IndentTip record={currentRecord}/>
        </Col>
      </Row>
    )
  }

  render() {
    const {
      addVisible, isAdd, title,
      name, updateVisible, currentConsumerVoucher,
      confirmLoading,
    } = this.state
    const { form, consumeVoucherList, location } = this.props
    const { query } = location
    const { content, size, isFetching, totalElements } = consumeVoucherList
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    let sortObj = {
      creationTime: false,
      updatedAt: false,
    }
    sortObj = Object.assign({}, sortObj, parseQueryToSortorder(sortObj, query))
    const columns = [
      { title: '凭证名称', width: '12%', dataIndex: 'name' },
      {
        title: 'AccessKey / SecretKey',
        dataIndex: 'clientId',
        width: '12%',
        className: 'keys',
        render: (text, record) => this.filterAs(1, record),
      }, {
        title: '新 AccessKey / SecretKey',
        dataIndex: 'replacingSecret',
        width: '12%',
        className: 'keys',
        render: (text, record) => this.filterAs(2, record, text),
      }, {
        title: '订阅服务（个）',
        width: '10%',
        dataIndex: 'subscribedServiceNames',
        render: (text = []) => {
          return (
            <span>
              <span style={{ marginRight: 8 }}>{text.length}</span>
              <SubscribedServiceNamePop serviceList={text}/>
            </span>
          )
        },
      }, {
        title: '创建时间',
        dataIndex: 'creationTime',
        width: '19%',
        sorter: true,
        sortOrder: sortObj.creationTime,
        render: creationTime => formatDate(creationTime),
      }, {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: '19%',
        sorter: true,
        sortOrder: sortObj.updatedAt,
        render: updatedAt => <span>{updatedAt ? formatDate(updatedAt) : '-'}</span>,
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '16%',
        render: (text, record) => <div>
          <Dropdown.Button onClick={this.handleButtonClick.bind(this, record)} overlay={
            <Menu onClick={this.handleMenu.bind(this, record)} style={{ width: 85 }}>
              <Menu.Item key="update">{record.replacingSecret ? '确认更新' : '更新'}</Menu.Item>
              <Menu.Item key="delete" disabled={record.subscribedCount > 0}>删除</Menu.Item>
            </Menu>
          }>编辑</Dropdown.Button>
        </div>,
      },
    ]
    // const rowSelection = {
    //  onChange: (selectedRowKeys, selectedRows) => {
    //    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    //  },
    // }
    const pagination = {
      total: totalElements,
      size,
      current: parseInt(query.page, 10) || 1,
      onChange: current => this.loadData({ page: current }),
    }
    return (
      <QueueAnim className="csb-comsumer-vouchers">
        <div className="top" key="top">
          <div className="topLeft">
            <Button className="vou" type="primary" onClick={this.handleAdd}><Icon type="plus"/>创建凭证</Button>
            <Button className="res" onClick={() => this.loadData()}><Icon type="sync"/>刷新</Button>
            {/* <Button className="del"><Icon type="delete" />删除</Button> */}
            <Search
              placeholder="按凭证名称搜索"
              style={{ width: 200 }}
              onChange={e => this.setState({ name: e.target.value })}
              value={name}
              onSearch={() => this.loadData({ page: 1 })}
            />
          </div>
          {totalElements > 0 && <div className="topRigth" type="card">
            <span>共计 {totalElements} 条</span>
            <Pagination simple {...pagination} />
          </div>}
        </div>
        <Card className="body" key="body">
          <Table
            columns={columns}
            pagination={false}
            dataSource={content}
            // rowSelection={rowSelection}
            loading={isFetching}
            rowKey={record => record.id}
            onChange={this.tableChange}
          />
        </Card>
        {addVisible && <Modal
          title={title}
          visible={true}
          onCancel={() => this.setState({ addVisible: false })}
          maskClosable={false}
          cancelText="取 消"
          okText={isAdd ? '确 定' : '保 存'}
          onOk={this.handleOK}
          confirmLoading={confirmLoading}
        >
          <FormItem
            label="凭证名称"
            key="name"
            {...formItemLayout}
          >
            {
              getFieldDecorator('name', {
                initialValue: isAdd ? undefined : currentConsumerVoucher.name,
                rules: [{
                  required: true,
                  message: '消费凭证名称不能为空',
                }, {
                  whitespace: true,
                  message: '不能输入空格',
                }, {
                  validator: (rule, value, callback) => {
                    if (value.length > 64) {
                      return callback('消费凭证名称长度不能超过 64')
                    }
                  },
                }],
              })(
                <Input placeholder="请输入消费凭证名称" ref={input => { this.nameInput = input }} />
              )
            }
          </FormItem>
        </Modal>}
        {
          updateVisible && <UpdateConsumerVoucher
            loading={confirmLoading}
            callback={this.triggerUpdateConsumeVoucher}
            closeModalMethod={() => this.setState({ updateVisible: false })}
            record={currentConsumerVoucher}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match, location } = ownProps
  const { instanceID } = match.params
  const consumeVoucherList = consumeVoucherSlt(state, ownProps)
  location.query = parseQuerystring(location.search)
  return {
    consumeVoucherList,
    instanceID,
  }
}

export default connect(mapStateToProps, {
  createConsumerVoucher,
  getConsumerVouchersList,
  triggerUpdateConsumerVoucher,
  confirmUpdateConsumerVoucher,
  editConsumerVoucher,
  deleteConsumerVoucher,
})(Form.create()(ConsumerVouchers))
