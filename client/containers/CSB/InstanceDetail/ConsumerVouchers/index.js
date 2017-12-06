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
import { Button, Icon, Input, Pagination, Dropdown, Table, Card, Menu, Modal, Row, Col, Radio, Tooltip, Popover } from 'antd'
import './style/index.less'
const Search = Input.Search
const { TextArea } = Input
const RadioGroup = Radio.Group

export default class ConsumerVouchers extends React.Component {

  state = {
    title: '',
    isUse: true,
    isAdd: false,
    delValue: '',
    icoTip: false,
    voucherName: '',
    copyStatus: false,
    upVisible: false,
    delVisible: false,
    addVisible: false,
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

  handleOK = () => { }

  handleCancel = () => {
    this.setState({
      addVisible: false,
    })
  }

  handleMenu = value => {
    if (value.key === '更新') {
      this.setState({
        upVisible: true,
      })
    } if (value.key === '删除') {
      this.setState({
        delValue: '',
        delVisible: true,
      })
    }
  }

  handleDelOk = () => { }

  handleDelcancel = () => {
    this.setState({
      delVisible: false,
    })
  }

  handleUpCancel = () => {
    this.setState({
      upVisible: false,
    })
  }

  handleModal = e => {
    this.setState({
      voucherName: e.target.value,
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

  filterAs = value => {
    const { copyStatus, icoTip } = this.state
    return (
      <div>
        <span>{value}</span>
        <Popover
          placement="right"
          trigger="click"
          content={
            <div>
              <div>
                <span style={{ color: '#2db7f5' }}> ak:{value}</span>
                <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                  <Icon type="copy" onClick={this.servercopyCode} style={{ color: '#2db7f5' }} />
                </Tooltip>
              </div>
              <div>
                <span style={{ color: '#2db7f5' }}> sk:{value}</span>
                <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
                  <Icon type="copy" onClick={this.servercopyCode} style={{ color: '#2db7f5' }} />
                </Tooltip>
              </div>
            </div>
          }
          arrowPointAtCenter={true}
          trigger="click">
          {
            icoTip ? <Icon type="minus-square-o" onClick={() => this.handleIco('minus')} /> :
              <Icon type="plus-square-o" onClick={() => this.handleIco('plus')} />
          }
        </Popover>
      </div>
    )
  }

  render() {
    const { addVisible, isAdd, title, delVisible, isUse, upVisible } = this.state
    const columns = [{
      id: 'id',
      title: '凭证名称',
      dataIndex: 'name',
    }, {
      title: 'AccessKey / SecretKey',
      dataIndex: 'as',
      render: text => this.filterAs(text),
    }, {
      title: '订阅服务（个）',
      dataIndex: 'service',
    }, {
      title: '创建时间',
      dataIndex: 'stime',
    }, {
      title: '更新时间',
      dataIndex: 'utime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <Dropdown.Button onClick={this.handleButtonClick} overlay={
          <Menu onClick={this.handleMenu} style={{ width: 85 }}>
            <Menu.Item key="更新">更新</Menu.Item>
            <Menu.Item key="删除">删除</Menu.Item>
          </Menu>
        }>编辑</Dropdown.Button>
      </div>,
    }]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
    }
    const data = [{
      key: '1',
      name: 'John Brown',
      as: 'asdasdasdhabab',
      service: 'New York',
      stime: '2017-01-01',
      utime: '2017-02-02',
    }]
    const pagination = {
      total: 1,
      defaultCurrent: 1,
    }
    return (
      <QueueAnim className="csb-comsumer-vouchers">
        <div className="top" key="top">
          <div className="topLeft">
            <Button className="vou" type="primary" onClick={this.handleAdd}><Icon type="plus" />创建凭证</Button>
            <Button className="res"><Icon type="sync" />刷新</Button>
            <Button className="del"><Icon type="delete" />删除</Button>
            <Search
              placeholder="按凭证名称搜索"
              style={{ width: 200 }}
              onSearch={value => console.log(value)}
            />
          </div>
          <div className="topRigth" type="card">
            <span>共计0条</span>
            <Pagination simple {...pagination} />
          </div>
        </div>
        <Card className="body" key="body">
          <Table
            hoverable={false}
            columns={columns}
            pagination={false}
            dataSource={data}
            rowSelection={rowSelection}
          />
        </Card>
        <Modal title={title} visible={addVisible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOK}>{isAdd ? '确 定' : '保 存'}</Button>,
          ]}>
          <div className="modal-add-vouchers">
            <span className="vouchers-name">凭证名称</span>
            <Input placeholder="请输入凭证名称" onChange={this.handleModal} />
          </div>
        </Modal>
        <Modal title="删除消费凭证"
          visible={delVisible}
          onCancel={this.handleDelcancel}
          footer={isUse ?
            [
              <Button key="back" type="primary" onClick={this.handleDelcancel}>知道了</Button>,
            ] :
            [
              <Button key="back" type="ghost" onClick={this.handleDelcancel}>取 消</Button>,
              <Button key="submit" type="primary" onClick={this.handleDelOk}>{isAdd ? '确 定' : '保 存'}</Button>,
            ]}>
          {
            isUse ?
              <div className="modal-del-vouchers-tip">
                <div className="img">
                  <Icon className="ico" type="exclamation-circle" />
                </div>
                <div className="desc">
                  <h3>删除消费凭证</h3>
                  <span>消费凭证 XX, XX 正被用于订阅服务，不可删除</span>
                </div>
              </div> :
              <div className="modal-del-vouchers">
                <div className="img">
                  <Icon type="exclamation-circle" />
                </div>
                <div className="desc">
                  <span>确定删除消费凭证 ？</span>
                </div>
              </div>
          }
        </Modal>
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
                  {/* <Icon type="eye-o" /> */}
                </div>
              </div>
              <div className="dec">
                <span className="decs-title">更新</span>
                <Icon type="arrow-right" style={{ fontSize: 25, color: '#5cb85c' }} />
              </div>
              <div className="as-rigth">
                <span>新 AccessKey / SecretKey</span>
                <div>
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                  <Icon type="eye-o" style={{ fontSize: 15 }} />
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
              <Input placeholder="输入过度时间，范围1~7200" />分
            </Row>
          </div>
        </Modal>
      </QueueAnim>
    )
  }
}
