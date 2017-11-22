/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Components
 *
 * 2017-11-10
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import './style/index.less'
import { Card, Button, Input, Table, Pagination, Progress, Dropdown, Menu, Modal, Icon, Row, Col, Slider, InputNumber } from 'antd'
const Search = Input.Search

const tooltip = [{
  title: '重启组件',
  content: '该操作将重启 SpringCloud 对应组件, 重启会消耗一段时间, 重启后组件相关服务自动生效。',
}, {
  title: '停止组件',
  content: '该操作将停止 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  title: '重新部署',
  content: '该操作将重新部署 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  title: '水平扩展',
  content: 'Tips：实例数量调整, 保存后系统将调整实例数量至设置预期',
}, {
  title: '查看日志',
  content: '',
}, {
  title: '高可用',
  content: '',
}]

export default class MsaComponents extends React.Component {
  state = {
    Data: [],
    inputValue: 0,
    logsVisible: false,
    toopVisible: false,
    extendVisible: false,
    tooltipTitle: '',
    tooltipContent: '',
    loading: false,
  }

  handleButtonClick = () => {
    this.setState({
      extendVisible: true,
      tooltipTitle: tooltip[3].title,
      tooltipContent: tooltip[3].content,
    })
  }

  tooptic = key => {
    switch (key) {
      case '重启组件':
        return tooltip[0]
      case '停止组件':
        return tooltip[1]
      case '重新部署':
        return tooltip[2]
      case '查看日志':
        return tooltip[4]
      case '高可用':
        return tooltip[5]
      default:
        return
    }
  }
  handleMenuClick = key => {
    const tips = this.tooptic(key.key)
    this.setState({
      toopVisible: true,
      tooltipTitle: tips.title,
      tooltipContent: tips.content,
    })
  }

  handleRealNum = value => {
    this.setState({
      inputValue: value,
    })
  }

  handleToopCancel = () => {
    this.setState({
      toopVisible: false,
    })
  }

  handleExtendCancel = () => {
    this.setState({
      extendVisible: false,
    })
  }

  handleLogsCancel = () => {
    this.setState({
      logsVisible: false,
    })
  }

  render() {
    const { loading, tooltipContent, tooltipTitle, extendVisible, toopVisible,
      logsVisible } = this.state
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    const menu = (
      <Menu onClick={this.handleMenuClick} style={{ width: 90 }}>
        <Menu.Item key="重启组件">重启组件</Menu.Item>
        <Menu.Item key="停止组件">停止组件</Menu.Item>
        <Menu.Item key="3">高可用</Menu.Item>
        <Menu.Item key="重新部署">重新部署</Menu.Item>
        <Menu.Item key="查看日志">查看日志</Menu.Item>
      </Menu>
    )
    const columns = [{
      id: 'id',
      key: 'component',
      title: '组件',
      dataIndex: 'component',
    }, {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    }, {
      key: 'state',
      title: '状态',
      dataIndex: 'state',
      render: () => <div>
        <Progress percent={30} showInfo={false} />
      </div>,
    }, {
      key: 'count',
      title: '实例数量',
      dataIndex: 'count',
    }, {
      key: 'time',
      title: '启动时间',
      dataIndex: 'time',
    }, {
      id: 'id',
      title: '操作',
      dataIndex: 'operation',
      render: () => <div>
        <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>水平扩展</Dropdown.Button>
      </div>,
    }]

    const dataSource = [{
      key: '1',
      component: 'asasas',
      name: '胡彦斌',
      state: 32,
      count: '12',
      time: '1分钟',
    }, {
      key: '2',
      component: 'asasas',
      name: '胡斌',
      state: 32,
      count: '12',
      time: '1分钟',
    }]

    return (
      <QueueAnim className="info">
        <div className="nav" key="nav">
          <Button type="primary" size="large"><Icon type="sync" />刷 新</Button>
          <Search className="input" size="large" placeholder="按微服务名称搜索" />
          <div className="pages">
            <span className="total">共计10条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <Card key="body">
          <div className="body">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              loading={loading}
              rowKey={row => row.name} />
          </div>
        </Card>
        <Modal title={tooltipTitle} visible={toopVisible} onCancel={this.handleToopCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleToopCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
          ]}>
          <div className="prompt" style={{ height: 70, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10, borderRadius: 4 }}>
            <div style={{ position: 'absolute', top: 90, left: 30 }}>
              <Icon type="exclamation-circle" style={{ fontSize: 25, color: '#ffbf00' }} />
            </div>
            <div style={{ width: '90%', marginLeft: 40 }}>
              <div>{tooltipTitle}</div>
              <span>{tooltipContent}</span>
            </div>
          </div>
        </Modal>
        <Modal title={tooltipTitle} visible={extendVisible} onCancel={this.handleExtendCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleExtendCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
          ]}>
          <div>
            <div className="prompt" style={{ height: 40, backgroundColor: '#d9edf6', border: '1px dashed #85d7fd', padding: 10, borderRadius: 4, marginBottom: 20 }}>
              <span style={{ color: '#1a7db6' }}>{tooltipContent}</span>
            </div>
            <Row className="cardItem">
              <Col className="itemTitle" span={4} style={{ textAlign: 'left' }}>组件名称</Col>
              <Col className="itemBody" span={20}>qwqeqweqwe</Col>
            </Row>
            <Row className="cardItem">
              <Col className="itemTitle" span={4} style={{ textAlign: 'left', lineHeight: 2.5 }}>
                实例数量
              </Col>
              <Col className="itemBody" span={20}>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={20}
                      onChange={this.handleRealNum}
                      value={this.state.inputValue} />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      min={1}
                      max={20}
                      style={{ marginLeft: '16px' }}
                      value={this.state.inputValue}
                    /> 个
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal title={tooltipTitle} visible={logsVisible} onCancel={this.handleLogsCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleLogsCancel}>取 消</Button>,
          ]}>
          <div>

          </div>
        </Modal>
      </QueueAnim>
    )
  }
}

