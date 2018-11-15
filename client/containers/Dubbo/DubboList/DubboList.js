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
import { Card, Table, Button, Input, Pagination, notification } from 'antd'
import { Link } from 'react-router-dom'
import Ellipsis from '@tenx-ui/ellipsis'
import { formatDate } from '../../../common/utils';
import { getDubboList } from '../../../actions/dubbo'
import './style/DubboList.less'

@connect(state => {
  const { dubbo } = state
  const { cluster } = state.current.config
  const { dubboList } = dubbo
  return {
    dubboList,
    clusterId: cluster.id,
  }
}, {
  getDubboList,
})
class DubboList extends React.Component {
  state = {
    columns: [
      {
        dataIndex: 'name',
        title: '服务名称',
        render: (record, row) => <Link to={{
          pathname: `/dubbo/dubbo-manage/dubbo-detail/${row.name}/${row.groupVersion}`,
        }}>{record}</Link>,
      },
      {
        dataIndex: 'groupVersion',
        title: '服务版本',
        render: record => {
          const recordArr = record.split(':')
          return <div>{recordArr[1]}</div>
        },
      },
      {
        dataIndex: 'group',
        title: '服务分组',
        render: (record, row) => {
          const recordArr = row.groupVersion.split(':')
          return <div>{recordArr[0]}</div>
        },
      },
      {
        dataIndex: 'belong',
        title: '所属应用',
        render: (record, row) => {
          return <div style={{ width: 100 }}>
            <Ellipsis>{row.applications.join(',')}</Ellipsis>
          </div>
        },
      },
      {
        dataIndex: 'status',
        title: '服务状态',
        render: (record, row) => {
          const status = row.status
          if (status.consumers === 0 && status.providers === 0) {
            return <span>无提供者 及 消费者</span>
          }
          if (status.consumers === 0) {
            return <span>无消费者</span>
          }
          if (status.providers === 0) {
            return <span>无提供者</span>
          }
          return <span>提供者、消费者均有</span>
        },
      },
      {
        dataIndex: 'createTime',
        title: '注册时间',
        render: text => <span>{formatDate(text)}</span>,
      },
    ],
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const { getDubboList, clusterId } = this.props
    const result = await getDubboList(clusterId, { isHandleError: true })
    if (result.error) {
      notification.warning({
        message: '列表请求出错',
      })
    }

  }
  render() {
    const { dubboList } = this.props
    return <div className="dubbo-list">
      <div className="dubbo-list-top">
        <div>
          <Button icon="sync" onClick={() => this.getData()}>刷新</Button>
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
