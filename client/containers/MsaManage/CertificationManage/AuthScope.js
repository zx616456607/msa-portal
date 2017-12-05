/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * AuthScope container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { Card, Table } from 'antd'
import QueueAnim from 'rc-queue-anim'
import './style/AuthScope.less'

export default class AuthScope extends React.Component {
  render() {
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '授权范围',
        dataIndex: 'authScope',
        key: 'authScope',
      },
      {
        title: '说明',
        dataIndex: 'desc',
        key: 'desc',
      },
    ]
    const data = [
      {
        key: 1,
        authScope: 'read',
        desc: '读权限',
      },
      {
        key: 2,
        authScope: 'write',
        desc: '写权限',
      },
      {
        key: 3,
        authScope: 'trust',
        desc: '信任权限',
      },
    ]
    return (
      <QueueAnim>
        <Card className="auth-scope" key="body" hoverable={false}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </Card>
      </QueueAnim>
    )
  }
}
