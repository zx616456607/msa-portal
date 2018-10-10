/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * RoutesManagement container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Button, Input, Table, Card, Pagination } from 'antd'
import './style/index.less'

const Search = Input.Search
class RoutesManagement extends React.Component {
  state = {
    routesName: '',
    columns: [
      {
        dataIndex: 'name',
        title: '路由规则名称',
      },
      {
        dataIndex: 'visitType',
        title: '访问方式',
      },
      {
        dataIndex: 'net',
        title: '网关',
      },
      {
        dataIndex: 'exportUrl',
        title: '对外访问地址',
      },
      {
        dataIndex: 'type',
        title: '路由类型',
      },
      {
        dataIndex: 'service',
        title: '路由服务',
      },
      {
        dataIndex: 'creationTime',
        title: '创建时间',
      },
      {
        dataIndex: 'operation',
        title: '操作',
      },
    ],
  }
  onSearch = () => {

  }
  render() {
    return <QueueAnim id="routes-management">
      <div className="options-wrapper" key="options-wrapper">
        <div className="left">
          <Button type="primary" icon="plus" onClick={() => this.props.history.push('/service-mesh/routes-management/new-route/3')}>创建路由规则</Button>
          <Button icon="sync">刷新</Button>
          <Search
            placeholder="请输入路由名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ routesName: e.target.value })}
            onSearch={this.onSearch}
          />
        </div>
        <div className="right">
          <Pagination defaultCurrent={1} simple total={50}/>
        </div>
      </div>
      <Card key="table-wrapper">
        <Table
          columns={this.state.columns}
          dataSource={[]}
        />
      </Card>
    </QueueAnim>

  }
}

export default RoutesManagement
