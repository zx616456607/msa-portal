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
  Row, Col, Radio, Tooltip, Popover,
  Form, notification,
} from 'antd'
import './style/index.less'
import {
  createConsumerVoucher,
  getConsumerVouchersList,
} from '../../../../actions/CSB/instanceService/consumerVouchers'
import { connect } from 'react-redux'
import { consumeVoucherSlt } from '../../../../selectors/CSB/instanceService/consumerVoucher'
import { formatDate } from '../../../../common/utils'
import confirm from '../../../../components/Modal/confirm'

const Search = Input.Search
const { TextArea } = Input
const RadioGroup = Radio.Group
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
    upVisible: false,
    addVisible: false,
    confirmLoading: false,
    currentConsumerVoucher: {},
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

  loadData = () => {
    const { getConsumerVouchersList, instanceID } = this.props
    getConsumerVouchersList(instanceID)
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
          upVisible: true,
        })
      case 'delete':
        return this.confirmDeleteConsumerVoucher()
      default:
        return
    }
  }

  handleUpCancel = () => {
    this.setState({
      upVisible: false,
    })
  }

  handleIco = value => {
    if (value === 'minus') {
      this.setState({
        icoTip: false,
      })
    } if (value === 'plus') {
      this.setState({
        icoTip: true,
      })
    }
  }

  servercopyCode = () => {
    const code = document.getElementById(this.state.inputID)
    code.select()
    document.execCommand('Copy', false)
    this.setState({
      copyStatus: true,
    })
  }

  filterAs = record => {
    const { copyStatus, icoTip } = this.state
    return (
      <div>
        <span>{record.clientId} / {record.secret}</span>
        <Popover
          placement="right"
          trigger="click"
          content={
            <div>
              <div>
                <span style={{ color: '#2db7f5' }}> ak:{record.clientId}</span>
                <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                  <Icon type="copy" onClick={this.servercopyCode} style={{ color: '#2db7f5' }} />
                </Tooltip>
              </div>
              <div>
                <span style={{ color: '#2db7f5' }}> sk:{record.secret}</span>
                <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                  <Icon type="copy" onClick={this.servercopyCode} style={{ color: '#2db7f5' }} />
                </Tooltip>
              </div>
            </div>
          }
          arrowPointAtCenter={true}
        >
          {
            icoTip ? <Icon type="minus-square-o" onClick={() => this.handleIco('minus')} /> :
              <Icon type="plus-square-o" onClick={() => this.handleIco('plus')} />
          }
        </Popover>
      </div>
    )
  }

  render() {
    const {
      addVisible, isAdd, title,
      upVisible, name,
    } = this.state
    const { form, consumeVoucherList } = this.props
    const { content, size, isFetching, totalElements } = consumeVoucherList
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const columns = [{
      id: 'id',
      title: '凭证名称',
      width: '16%',
      dataIndex: 'name',
    }, {
      title: 'AccessKey / SecretKey',
      key: 'clientId',
      dataIndex: 'clientId',
      width: '20%',
      render: (text, record) => this.filterAs(record),
    }, {
      title: '订阅服务（个）',
      width: '16%',
      dataIndex: 'service',
    }, {
      title: '创建时间',
      key: 'creationTime',
      dataIndex: 'creationTime',
      width: '16%',
      render: creationTime => formatDate(creationTime),
    }, {
      title: '更新时间',
      dataIndex: 'utime',
      width: '16%',
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
            />
          </div>
          <div className="topRigth" type="card">
            <span>共计0条</span>
            <Pagination simple {...pagination} />
          </div>
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
        </Modal> }
        <Modal title="更新消费凭证"
          visible={upVisible}
          onCancel={this.handleUpCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleUpCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOK}>更 新</Button>,
          ]}>
          <div className="modal-up-vouchers">
            <Row>
              <Col span={4}>
                <span>凭证名称：</span>
              </Col>
              <Col span={20}>
                <span>abc</span>
              </Col>
            </Row>
            <Row>
              <div className="as-left">
                <span>当前 AccessKey / SecretKey</span>
                <div>
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                  <Icon type="eye-o" className="text-ico" />
                </div>
              </div>
              <div className="dec">
                <span className="decs-title">更新</span>
                <Icon type="arrow-right" className="dec-ico"/>
              </div>
              <div className="as-rigth">
                <span>新 AccessKey / SecretKey</span>
                <div>
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                  <Icon type="eye-o" className="text-ico" />
                </div>
              </div>
            </Row>
            <Row>
              <span>生效设置：</span>
              <RadioGroup>
                <Radio value={1}>更新过度，新旧凭证同时失效</Radio>
                <Radio value={2}>立即生效新凭证</Radio>
              </RadioGroup>
            </Row>
            <Row>
              <Input placeholder="输入过度时间，范围1~7200" style={{ width: '73%' }}/>&nbsp;&nbsp; 分
            </Row>
          </div>
        </Modal>
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
})(Form.create()(ConsumerVouchers))
