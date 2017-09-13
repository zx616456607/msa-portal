/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetailEnv
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { Button, Icon, Table } from 'antd'
import './style/index.less'

export default class MsaDetailEnv extends React.Component {
  render() {
    const columns = [{
      title: 'key',
      dataIndex: 'keys',
      width: '40%',
    }, {
      title: 'value',
      dataIndex: 'value',
      width: '60%',
    }]
    const data = [{
      key: '1',
      keys: 'profiles',
      value: '[]',
    }, {
      key: '2',
      keys: 'service.ports',
      value: '{local.server.port:9003}',
    }, {
      key: '3',
      keys: 'configService:configClient',
      value: '{config.client.version:"asdfgghjjllfadfafsdfasdfadsf"}',
    }, {
      key: '4',
      keys: 'commandLineArgs',
      value: '{"spring.output.ansi.enabled":"always"}',
    }, {
      key: '5',
      keys: 'systemProfiles',
      value: '{\ncom.sun.management.jmxremote.authenticate:false,\n' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name:Java(TM) SE Runtime Environment' +
      'java.runtime.name: Java(TM) SE Runtime Environment' +
      '}',
    }]
    return (
      <div className="msaDetailEnv">
        <div className="layout-content-btns">
          <Button type="primary"><Icon type="sync"/>刷新</Button>
        </div>
        <Table
          bordered
          className="msaDetailEnv-table"
          pagination={false}
          columns={columns}
          dataSource={data} />
      </div>
    )
  }
}
