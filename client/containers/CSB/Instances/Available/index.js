/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Available instances component
 *
 * 2017-12-04
 * @author zhangxuan
 */

import React from 'react'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { Button, Input, Icon, Card, Table, Menu, Dropdown } from 'antd'
import './style/index.less'
import InstanceModal from './CreateModal'
import confirm from '../../../../components/Modal/confirm'

const Search = Input.Search

class AvailableInstances extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createModal: false,
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

  handleClick = () => {
    const { history } = this.props
    history.push('/csb-instances-available/test-instance')
  }

  menuClick = (menu, record) => {
    switch (menu.key) {
      case 'edit':
        this.setState({
          createModal: true,
          currentInstance: record,
        })
        break
      case 'delete':
        this.handleDelete()
        break
      default:
        break
    }
  }

  handleDelete = () => {
    confirm({
      modalTitle: '删除',
      content: '删除后将不能在此实例中发布、订阅服务；已发布的服务将被注销，已订阅的服务将被退订。确定是否删除实例？',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }
  render() {
    const { createModal, currentInstance } = this.state
    const pagination = {
      simple: true,
      total: 10,
      current: 1,
      pageSize: 10,
    }
    const data = [{
      key: '1',
      name: 'TreadCode21',
      rank: '私有',
      status: '可用',
      creator: 'admin',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      creationTime: '2016-09-21 08:50:08',
    }, {
      key: '2',
      name: 'TreadCode21',
      rank: '私有',
      status: '可用',
      creator: 'admin',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      creationTime: '2016-09-21 08:50:08',
    }, {
      key: '3',
      name: 'TreadCode21',
      rank: '私有',
      status: '可用',
      creator: 'admin',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      creationTime: '2016-09-21 08:50:08',
    }]
    const columns = [{
      title: '实例名称',
      dataIndex: 'name',
      width: '10%',
      render: text => <Link to="/csb-instances-available/test-instance">{text}</Link>,
    }, {
      title: '访问级别',
      dataIndex: 'rank',
      width: '10%',
      filters: [{
        text: '私有',
        value: 'private',
      }, {
        text: '公开',
        value: 'public',
      }],
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      filters: [{
        text: '可用',
        value: true,
      }, {
        text: '不可用',
        value: false,
      }],
    }, {
      title: '创建者',
      dataIndex: 'creator',
      width: '10%',
    }, {
      title: '可发布服务',
      dataIndex: 'publish',
      width: '10%',
      filters: [{
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      }],
    }, {
      title: '可订阅服务',
      dataIndex: 'subscribe',
      width: '10%',
      filters: [{
        text: '是',
        value: true,
      }, {
        text: '否',
        value: false,
      }],
    }, {
      title: '描述',
      dataIndex: 'description',
      width: '10%',
    }, {
      title: '创建时间',
      dataIndex: 'creationTime',
      width: '10%',
    }, {
      title: '操作',
      width: '20%',
      render: (text, record) => {
        const menu = (
          <Menu onClick={menu => this.menuClick(menu, record)} style={{ width: 100 }}>
            <Menu.Item key="edit">修改</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        )
        return (
          <Dropdown.Button onClick={this.handleClick} overlay={menu}>
            查看详情
          </Dropdown.Button>
        )
      },
    }]
    return (
      <QueueAnim className="available-instance">
        <div className="layout-content-btns" key="btns">
          <InstanceModal
            visible={createModal}
            currentInstance={currentInstance}
            closeCreateModal={this.closeCreateModal}
          />
          <Button type="primary" onClick={this.openCreateModal}><Icon type="plus" />创建实例</Button>
          <Button><Icon type="sync" />刷新</Button>
          <Search
            className="available-instance-search"
            placeholder="按实例名搜索"
          />
          <span className="available-instance-total float-right">共计 10 条</span>
        </div>
        <div className="layout-content-body" key="body">
          <Card className="available-instance-table" hoverable={false}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={pagination}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

export default AvailableInstances
