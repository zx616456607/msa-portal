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
import { withNamespaces } from 'react-i18next'

@withNamespaces('identityManage')
export default class AuthScope extends React.Component {
  render() {
    const { t } = this.props
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        width: '10%',
        key: 'key',
      },
      {
        title: t('authScope.authRange'),
        dataIndex: 'value',
        width: '40%',
        key: 'value',
      },
      {
        title: t('authScope.desc'),
        dataIndex: 'text',
        width: '50%',
        key: 'text',
      },
    ]
    const authScope = [
      { key: 1, value: 'uaa.user', text: t('authScope.allAuth') },
      { key: 2, value: 'uaa.none', text: t('authScope.thisAppDontOpeartor') },
      { key: 3, value: 'uaa.admin', text: t('authScope.superAuth') },
      { key: 4, value: 'scim.write', text: t('authScope.crossManageSystem') },
      { key: 5, value: 'scim.read ', text: t('authScope.canUserAndGroup') },
      { key: 6, value: 'scim.create', text: t('authScope.donotDelCouldSend') },
      { key: 7, value: 'scim.userids', text: t('authScope.nameIDTransform') },
      { key: 8, value: 'scim.invite', text: t('authScope.inviteUsersEndpoint') },
      { key: 9, value: 'groups.update', text: t('authScope.canRefreshGroup') },
      { key: 10, value: 'password.write', text: t('authScope.canChangeSecrets') },
      { key: 11, value: 'openid', text: t('authScope.beUsedToGetUserInfo') },
      { key: 12, value: 'idps.read', text: t('authScope.couldReadandCheck') },
      { key: 13, value: 'idps.write', text: t('authScope.couldAddandRefresh') },
      { key: 14, value: 'clients.admin', text: t('authScope.anyOAuthApp') },
      { key: 15, value: 'clients.write', text: t('authScope.someOAuthApp') },
      { key: 16, value: 'clients.read', text: t('authScope.getUserAccountInfo') },
      { key: 17, value: 'clients.secret', text: t('authScope.changeMyselfSecrets') },
      { key: 18, value: 'zones.read', text: t('authScope.getUserAuthZoneInfo') },
      { key: 19, value: 'zones.write', text: t('authScope.addAndChangeAuthZoneInfo') },
      { key: 20, value: 'scim.zones', text: t('authScope.someZoneCouldAdd') },
      { key: 21, value: 'oauth.approval', text: t('authScope.defaultAuthUserOperator') },
      { key: 22, value: 'oauth.login', text: t('authScope.beUsedToLoginApp') },
      // {value: 'approvals.me', text: '尚未使用'}
      { key: 23, value: 'uaa.resource', text: t('authScope.beUsedToCheckResource') },
      { key: 24, value: 'zones.ZONE-ID.admin', text: t('authScope.authZoneOperatorInRange') },
      { key: 25, value: 'zones.ZONE-ID.read', text: t('authScope.shouldGetSomeAuthZoneInfo') },
      { key: 26, value: 'zones.ZONE-ID.clients.admin', text: t('authScope.changeRangeEqualadmin') },
      { key: 27, value: 'zones.ZONE-ID.clients.read', text: t('authScope.changeRangeEqualread') },
      { key: 28, value: 'zones.ZONE-ID.clients.write', text: t('authScope.changeRangeEqualwrite') },
      { key: 29, value: 'zones.ZONE-ID.clients.scim.read', text: t('authScope.changeRangeEqualScimRead') },
      { key: 30, value: 'zones.ZONE-ID.clients.scim.create', text: t('authScope.changeRangeEqualScimCreate') },
      { key: 31, value: 'zones.ZONE-ID.clients.scim.write', text: t('authScope.changeRangeEqualScimWrite') },
      { key: 32, value: 'zones.ZONE-ID.idps.read', text: t('authScope.changeRangeEqualIdpsRead') },
    ]
    return (
      <QueueAnim>
        <Card className="auth-scope" key="body">
          <Table
            columns={columns}
            dataSource={authScope}
            pagination={false}
          />
        </Card>
      </QueueAnim>
    )
  }
}
