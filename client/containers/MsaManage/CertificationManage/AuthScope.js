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
        width: '10%',
        key: 'key',
      },
      {
        title: '授权范围',
        dataIndex: 'value',
        width: '40%',
        key: 'value',
      },
      {
        title: '说明',
        dataIndex: 'text',
        width: '50%',
        key: 'text',
      },
    ]
    const authScope = [
      { key: 1, value: 'uaa.user', text: '用户都拥有的权限' },
      { key: 2, value: 'uaa.none', text: '此 OAuth 应用 将不会代表用户执行操作' },
      { key: 3, value: 'uaa.admin', text: '超级用户权限' },
      { key: 4, value: 'scim.write', text: '对整个跨域身份管理系统授予添加、更新、删除用户和组的权限' },
      { key: 5, value: 'scim.read ', text: '对整个跨域身份管理系统授予读用户和组的权限' },
      { key: 6, value: 'scim.create', text: '仅授予添加用户的权限，无删、改、查用户的权限' },
      { key: 7, value: 'scim.userids', text: '用于用户名和用户 ID 之间转换' },
      { key: 8, value: 'scim.invite', text: '用于 /invite_users 的 endpoint 参加邀请' },
      { key: 9, value: 'groups.update', text: '提供更新组的能力，scim.write 也包含该能力' },
      { key: 10, value: 'password.write', text: '提供修改用户密码的能力' },
      { key: 11, value: 'openid', text: '获取用户信息，适用于 OpenID clients' },
      { key: 12, value: 'idps.read', text: '读取、检索 identity providers的能力' },
      { key: 13, value: 'idps.write', text: '添加、更新 identity providers 的能力' },
      { key: 14, value: 'clients.admin', text: '添加、修改和删除 OAuth 应用的能力' },
      { key: 15, value: 'clients.write', text: '添加、修改 OAuth 应用能力' },
      { key: 16, value: 'clients.read', text: '获取客户端注册信息的能力' },
      { key: 17, value: 'clients.secret', text: '修改自己 OAuth 应用密钥的能力' },
      { key: 18, value: 'zones.read', text: '用于获取认证域信息' },
      { key: 19, value: 'zones.write', text: '用于添加和修改认证域信息' },
      { key: 20, value: 'scim.zones', text: '限制仅能在某个认证域组内添加、删除用户' },
      { key: 21, value: 'oauth.approval', text: '默认授权，需要允许或拒绝 OAuth 应用代表用户行事' },
      { key: 22, value: 'oauth.login', text: '用于登录应用程序（例如外部登录服务器，可以执行可信操作，或添加的用户未进行身份验证）' },
      // {value: 'approvals.me', text: '尚未使用'}
      { key: 23, value: 'uaa.resource', text: '用于检查 token 的资源服务' },
      { key: 24, value: 'zones.ZONE-ID.admin', text: '允许在指定认证域内操作' },
      { key: 25, value: 'zones.ZONE-ID.read', text: '允许获取特定的认证域信息' },
      { key: 26, value: 'zones.ZONE-ID.clients.admin', text: '切换区域后与 clients.admin 一致' },
      { key: 27, value: 'zones.ZONE-ID.clients.read', text: '切换区域后与 clients.read 一致' },
      { key: 28, value: 'zones.ZONE-ID.clients.write', text: '切换区域后与 clients.write 一致' },
      { key: 29, value: 'zones.ZONE-ID.clients.scim.read', text: '切换区域后与 scim.read 一致' },
      { key: 30, value: 'zones.ZONE-ID.clients.scim.create', text: '切换区域后与 scim.create 一致' },
      { key: 31, value: 'zones.ZONE-ID.clients.scim.write', text: '切换区域后与 scim.write 一致' },
      { key: 32, value: 'zones.ZONE-ID.idps.read', text: '切换区域后与 idps.read 一致' },
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
