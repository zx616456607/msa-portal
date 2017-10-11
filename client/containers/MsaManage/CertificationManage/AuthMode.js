/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * AuthMode container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { Card, Table } from 'antd'
import './style/AuthMode.less'

export default class AuthMode extends React.Component {
  render() {
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '授权方式',
        dataIndex: 'authMode',
        key: 'authMode',
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
        authMode: 'authorization_code',
        desc: '标准服务端授权模式',
      },
      {
        key: 2,
        authMode: 'refresh_token',
        desc: '刷新 accessToken 授权模式',
      },
      {
        key: 3,
        authMode: 'password',
        desc: '用户密码授权模式',
      },
      {
        key: 4,
        authMode: 'client_credentials',
        desc: '应用端密钥授权模式',
      },
    ]
    return (
      <Card className="auth-mode">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Card>
    )
  }
}