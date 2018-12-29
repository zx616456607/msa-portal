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
import QueueAnim from 'rc-queue-anim'
import './style/AuthMode.less'
import { withNamespaces } from 'react-i18next'

@withNamespaces('identityManage')
export default class AuthMode extends React.Component {
  render() {
    const { t } = this.props
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: t('authModeTable.authMode'),
        dataIndex: 'authMode',
        key: 'authMode',
      },
      {
        title: t('authModeTable.desc'),
        dataIndex: 'desc',
        key: 'desc',
      },
    ]
    const data = [
      {
        key: 1,
        authMode: 'authorization_code',
        desc: t('authModeTable.normalAuth'),
      },
      {
        key: 2,
        authMode: 'implicit',
        desc: t('authModeTable.simpleAuth'),
      },
      {
        key: 3,
        authMode: 'password',
        desc: t('authModeTable.secretsAuth'),
      },
      {
        key: 4,
        authMode: 'client_credentials',
        desc: t('authModeTable.appSecretsAuth'),
      },
    ]
    return (
      <QueueAnim>
        <Card className="auth-mode" key="bdoy">
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
