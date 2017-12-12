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
import { Button, Input, Icon, Card, Table } from 'antd'
import './style/index.less'

const Search = Input.Search

class AvailableInstances extends React.Component {

  render() {
    const pagination = {
      simple: true,
      total: 10,
      current: 1,
      pageSize: 10,
    }
    const data = [{
      key: '1',
      name: 'TreadCode21',
      status: '运行中',
      cluster: '上海',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      applyTime: '2016-09-21 08:50:08',
    }, {
      key: '2',
      name: 'TreadCode21',
      status: '正在启动',
      cluster: '上海',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      applyTime: '2016-09-21 08:50:08',
    }, {
      key: '3',
      name: 'TreadCode21',
      status: '已停止',
      cluster: '上海',
      publish: '是',
      subscribe: '是',
      description: '我是描述',
      applyTime: '2016-09-21 08:50:08',
    }]
    const columns = [{
      title: '实例名称',
      dataIndex: 'name',
      width: '10%',
      render: text => <Link to="/csb-instances-available/test-instance">{text}</Link>,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      filters: [{
        text: '运行中',
        value: 'run',
      }, {
        text: '正在启动',
        value: 'starting',
      }, {
        text: '已停止',
        value: 'stop',
      }],
    }, {
      title: '部署集群',
      dataIndex: 'cluster',
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
      title: '申请时间',
      dataIndex: 'applyTime',
      width: '10%',
    }, {
      title: '操作',
      width: '20%',
      render: () => {
        return (
          <div>
            <Button type="primary">查看实例</Button>
            <Button>放弃使用</Button>
          </div>
        )
      },
    }]
    return (
      <QueueAnim className="available-instance">
        <div className="layout-content-btns" key="btns">
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
