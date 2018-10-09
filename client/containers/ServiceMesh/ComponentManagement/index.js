/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * ComponentManagement container
 *
 * 2018-09-30
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Link } from 'react-router-dom'
import { loadComponent, getComponent, deleteComponent } from '../../../actions/serviceMesh'
import { Button, Input, Table, Card, Modal, Pagination } from 'antd'
import './style/index.less'

const Search = Input.Search

class ComponentManagement extends React.Component {
  state = {
    componentName: '',
    deleteVisible: false,
  }

  componentDidMount() {
    this.load()
  }

  load = () => {
    const { clusterID, loadComponent } = this.props
    loadComponent(clusterID)
  }

  handleRefresh = () => {
    this.load()
  }

  onSearch = () => {
    const { getComponent } = this.props
    const { componentName } = this.state
    getComponent(componentName)
  }

  handleEdit = () => {
    this.props.history.push('/service-mesh/component-management/name?detail=false&id=')
  }

  handleDelete = () => {
    this.setState({
      deleteVisible: true,
    })
  }

  handleDel = () => {}

  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }

  render() {
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    const data = [{
      name: '张安',
      servicecount: '1',
      router: '1',
      start: '2018-09-20 12:00',
    }]
    const columns = [{
      id: 'id',
      title: '组件名称',
      width: '15%',
      dataIndex: 'name',
      render: text =>
        <Link to={'/service-mesh/component-management/component/detail'}>{text}</Link>,
    }, {
      title: '关联服务数量',
      dataIndex: 'servicecount',
    }, {
      title: '描述',
      width: '25%',
      dataIndex: '',
    }, {
      title: '路由规则',
      dataIndex: 'router',
    }, {
      title: '创建时间',
      dataIndex: 'start',
    }, {
      title: '操作',
      render: record => <div>
        <Button type="primary" className="edit" onClick={() => this.handleEdit(record)}>编辑</Button>
        <Button onClick={() => this.handleDelete()}>删除</Button>
      </div>,
    }]
    return (
      <QueueAnim className="component-management">
        <div className="component-management-btn layout-content-btns" key="btn">
          <Button icon="plus" type="primary" onClick={() =>
            this.props.history.push('/service-mesh/component-management/component/create')}>创建组件</Button>
          <Button icon="sync" onClick={() => this.handleRefresh()}> 刷新</Button>
          <Search
            placeholder="请输入组件名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ componentName: e.target.value })}
            onSearch={this.onSearch}
          />
          <div className="pages">
            <span className="total">共计0条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <Card>
          <Table
            pagination={false}
            loading={false}
            dataSource={data}
            columns={columns}
            rowKey={row => row.id}
          />
        </Card>
        <Modal title="删除操作" visible={this.state.deleteVisible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
          ]}>
          <div className="prompt" style={{ height: 45, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
            <span>删除组件后，该组件关联的服务在路由规则中设置的规则和对外访问方式将失效</span>
            <span>确定是否删除该组件 ？</span>
          </div>
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
  }
}

export default connect(mapStateToProps, {
  getComponent,
  loadComponent,
  deleteComponent,
})(ComponentManagement)
