/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetailConfig
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { Row, Col, Select, Button, Icon, Table } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaConfig,
} from '../../../../../actions/msa'
import './style/index.less'

const Option = Select.Option

class MsaDetailConfig extends React.Component {
  handleChange = value => {
    console.log(value)
  }

  loadMsaConfig = () => {
    const { getMsaConfig, clusterID, name, instances } = this.props
    getMsaConfig(clusterID, `${name}:${instances[0].port}`)
  }

  componentDidMount() {
    this.loadMsaConfig()
  }

  render() {
    const columns = [{
      title: '配置名称',
      dataIndex: 'name',
    }, {
      title: '更新时间',
      dataIndex: 'time',
    }, {
      title: '操作',
      render: () => <a href="#">查看</a>,
    }]
    const data = [{
      key: '1',
      name: 'config.client.properties',
      time: '19天前',
    }, {
      key: '2',
      name: 'config.client.properties',
      time: '12小时前',
    }, {
      key: '3',
      name: 'config.client.properties',
      time: '10小时前',
    }, {
      key: '4',
      name: 'config.client.properties',
      time: '6小时前',
    }, {
      key: '5',
      name: 'config.client.properties',
      time: '5小时前',
    }]
    return (
      <div className="msaDetailConfig">
        <Button type="primary" icon="sync" onClick={this.loadMsaConfig}>
        刷新
        </Button>
        <Table
          className="msaDetailConfig-table"
          pagination={false}
          columns={columns}
          dataSource={data} />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  getMsaConfig,
})(MsaDetailConfig)
