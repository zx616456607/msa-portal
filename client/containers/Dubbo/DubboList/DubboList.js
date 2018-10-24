/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * DubboList Component
 *
 * 2018-10-24
 * @author zhouhaitao
 */

import React from 'react'
import { connect } from 'react-redux'
import { Card, Table, Button, Input, Pagination } from 'antd'
import { Link } from 'react-router-dom'
import { getDubboList } from '../../../actions/dubbo'
import './style/DubboList.less'

@connect(state => {
  const { dubbo } = state
  const { dubboList } = dubbo
  return {
    dubboList,
  }
}, {
  getDubboList,
})
class DubboList extends React.Component {
  state = {
    columns: [
      {
        dataIndex: 'serviceName',
        title: '服务名称',
        render: (record, row) => <Link to={`/dubbo/dubbo-manage/dubbo-detail/${row.id}`}>{record}</Link>,
      },
      {
        dataIndex: 'version',
        title: '服务版本',
      },
      {
        dataIndex: 'group',
        title: '服务分组',
      },
      {
        dataIndex: 'belong',
        title: '所属应用',
      },
      {
        dataIndex: 'status',
        title: '服务状态',
        render: text => {
          switch (text) {
            case '0':
              return <span>无提供者</span>
            case '1':
              return <span>无消费者</span>
            default:
              return null
          }
        },
      },
      {
        dataIndex: 'time',
        title: '注册时间',
      },
    ],
  }
  componentDidMount() {
    const { getDubboList } = this.props
    getDubboList()
  }
  render() {
    const { dubboList } = this.props
    return <div className="dubbo-list">
      <div className="dubbo-list-top">
        <div>
          <Button icon="sync">刷新</Button>
          <Input style={{ width: 200, marginLeft: 16 }} placeholder="请输入服务名称搜索"/>
        </div>
        <div className="pagination">
          <Pagination
            total={10}
            simple={true}
          />
        </div>
      </div>
      <Card>
        <Table
          columns={this.state.columns}
          dataSource={dubboList.data}
          loading={dubboList.isFetching}
          pagination={false}
        />
      </Card>
    </div>
  }
}

export default DubboList
