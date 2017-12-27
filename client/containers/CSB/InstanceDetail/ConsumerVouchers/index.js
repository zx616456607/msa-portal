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
import {
  Button, Icon, Input, Pagination,
  Dropdown, Table, Card, Menu, Modal,
  Row, Col, Tooltip, Popover,
  Form, notification,
} from 'antd'
import './style/index.less'
import {
  createConsumerVoucher,
  getConsumerVouchersList,
  triggerUpdateConsumerVoucher,
  confirmUpdateConsumerVoucher,
} from '../../../../actions/CSB/instanceService/consumerVouchers'
import { connect } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { consumeVoucherSlt } from '../../../../selectors/CSB/instanceService/consumerVoucher'
import { formatDate } from '../../../../common/utils'
import confirm from '../../../../components/Modal/confirm'
import UpdateConsumerVoucher from './UpdateConsumerVoncher'

const Search = Input.Search
const FormItem = Form.Item

class ConsumerVouchers extends React.Component {

  state = {
    name: '',
    title: '',
    isUse: true,
    isAdd: false,
    delValue: '',
    icoTip: false,
    copyStatus: false,
    addVisible: false,
    confirmLoading: false,
    currentConsumerVoucher: {},
    updateVisible: false,
  }

  componentWillMount() {
    this.loadData()
  }

  confirmDeleteConsumerVoucher = () => {
    const { currentConsumerVoucher } = this.state
    return confirm({
      modalTitle: '使用实例',
      title: `确定删除消费凭证 ${currentConsumerVoucher.name}？`,
      content: '',
      onOk() {
        return 123
      },
    })
  }

  loadData = (query = {}) => {
    const { getConsumerVouchersList, instanceID } = this.props
    const { name } = this.state
    query = Object.assign({}, { name }, query)
    getConsumerVouchersList(instanceID, query)
  }

  handleAdd = () => {
    this.setState({
      isAdd: true,
      title: '创建消费凭证',
      addVisible: true,
    })
  }

  handleButtonClick = () => {
    this.setState({
      isAdd: false,
      title: '编辑消费凭证',
      addVisible: true,
    })
  }

  createConsumerVoucher = (instanceID, values) => {
    const { createConsumerVoucher } = this.props
    createConsumerVoucher(instanceID, values).then(res => {
      this.setState({
        confirmLoading: false,
      })
      if (res.error) {
        return
      }
      notification.success({
        message: '创建消费凭证成功',
      })
      this.setState({
        addVisible: false,
      })
      this.loadData()
    })
  }

  closeUpdateModal = () => {
    this.setState({
      updateVisible: false,
    })
  }

  confirmUpdateConsumeVoucher = record => {
    console.log('record= ', record)
    const { confirmUpdateConsumerVoucher, instanceID } = this.props
    const { currentConsumerVoucher } = this.state
    const { id } = currentConsumerVoucher
    confirmUpdateConsumerVoucher(instanceID, id).then(res => {
      console.log('res=', res)
      if (res.error) return
    })
  }

  triggerUpdateConsumeVoucher = values => {
    const { triggerUpdateConsumerVoucher, instanceID } = this.props
    const { currentConsumerVoucher } = this.state
    const { id } = currentConsumerVoucher
    const { updateSetting, delayTime } = values
    let body = {}
    if (updateSetting === 'delay') {
      const nowTime = new Date()
      const sec = nowTime.getTime() + delayTime * 60 * 1000
      const expireAt = new Date(sec).toISOString()
      body = Object.assign({}, body, { expireAt })
    }
    triggerUpdateConsumerVoucher(instanceID, id, body).then(res => {
      console.log('res= ', res)
      if (res.error) return

    })
  }

  updateConsumeVocuher = values => {
    console.log('values=', values)
  }

  handleOK = () => {
    const { isAdd } = this.state
    const { form, instanceID } = this.props
    const validateArray = [ 'name' ]
    form.validateFields(validateArray, (errors, values) => {
      if (errors) return
      this.setState({
        confirmLoading: true,
      })
      if (isAdd) {
        this.createConsumerVoucher(instanceID, values)
        return
      }
    })
  }

  handleCancel = () => {
    this.setState({
      addVisible: false,
    })
  }

  handleMenu = (record, item) => {
    const { key } = item
    this.setState({
      currentConsumerVoucher: record,
    })
    switch (key) {
      case 'update':
        return this.setState({
          updateVisible: true,
        })
      case 'delete':
        return this.confirmDeleteConsumerVoucher()
      default:
        return
    }
  }

  handleIco = (value, currentConsumerVoucher) => {
    this.setState({
      currentConsumerVoucher,
      icoTip: value === 'plus',
    })
  }

  copyKey = () => {
    this.setState({ copyStatus: true })
    setTimeout(() => {
      this.setState({ copyStatus: false })
    }, 1000)
  }

  filterAs = record => {
    const { copyStatus, icoTip, currentConsumerVoucher } = this.state
    return (
      <Row>
        <Col span={10} className="text">{record.clientId}</Col>
        <Col span={2}>/</Col>
        <Col span={10} className="text">{record.secret}</Col>
        <Col span={2} className="spread-icon">
          <Popover
            placement="right"
            trigger="click"
            arrowPointAtCenter={true}
            overlayClassName="keys-popover"
            content={
              <div>
                <div>
                  <span className="key-value">ak:{record.clientId}</span>
                  <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                    <CopyToClipboard text={record.clientId} onCopy={() => this.copyKey()} >
                      <Icon type="copy"/>
                    </CopyToClipboard>
                  </Tooltip>
                </div>
                <div>
                  <span className="key-value">sk:{record.secret}</span>
                  <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                    <CopyToClipboard text={record.secret} onCopy={() => this.copyKey()} >
                      <Icon type="copy"/>
                    </CopyToClipboard>
                  </Tooltip>
                </div>
              </div>
            }
          >
            {
              icoTip && currentConsumerVoucher.id === record.id
                ? <Icon type="minus-square-o" onClick={() => this.handleIco('minus', record)}/>
                : <Icon type="plus-square-o" onClick={() => this.handleIco('plus', record)}/>
            }
          </Popover>
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
    const { form, consumeVoucherList } = this.props
    const { content, size, isFetching, totalElements } = consumeVoucherList
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const columns = [{
      title: '凭证名称',
      width: '12%',
      dataIndex: 'name',
    }, {
      title: 'AccessKey / SecretKey',
      dataIndex: 'clientId',
      width: '12%',
      className: 'keys',
      render: (text, record) => this.filterAs(record),
    }, {
      title: '新 AccessKey / SecretKey',
      dataIndex: 'secret',
      width: '12%',
      className: 'keys',
      render: (text, record) => this.filterAs(record),
    }, {
      title: '订阅服务（个）',
      width: '10%',
      dataIndex: 'subscribedCount',
    }, {
      title: '创建时间',
      dataIndex: 'creationTime',
      width: '19%',
      render: creationTime => formatDate(creationTime),
    }, {
      title: '更新时间',
      dataIndex: 'utime',
      width: '19%',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '16%',
      render: (text, record) => <div>
        <Dropdown.Button onClick={this.handleButtonClick} overlay={
          <Menu onClick={this.handleMenu.bind(this, record)} style={{ width: 85 }}>
            <Menu.Item key="update">更新</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }>编辑</Dropdown.Button>
      </div>,
    }]
    // const rowSelection = {
    //  onChange: (selectedRowKeys, selectedRows) => {
    //    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    //  },
    // }
    const pagination = {
      total: totalElements,
      defaultCurrent: 1,
      size,
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
              // onSearch={() => this.loadData()}
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
          />
        </Card>
        {addVisible && <Modal
          title={title}
          visible={true}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOK}>
              {isAdd ? '确 定' : '保 存'}
            </Button>,
          ]}>
          <FormItem
            label="凭证名称"
            key="name"
            {...formItemLayout}
          >
            {
              getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '消费凭证名称不能为空',
                }],
              })(
                <Input placeholder="请输入消费凭证名称"/>
              )
            }
          </FormItem>
        </Modal>}
        {
          updateVisible && <UpdateConsumerVoucher
            loading={confirmLoading}
            callback={this.updateConsumeVocuher}
            closeModalMethod={this.closeUpdateModal}
            record={currentConsumerVoucher}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const { instanceID } = match.params
  const consumeVoucherList = consumeVoucherSlt(state, ownProps)
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
})(Form.create()(ConsumerVouchers))
