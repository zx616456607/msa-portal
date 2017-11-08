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
import { Button, Table } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaConfig,
} from '../../../../../actions/msa'
import './style/index.less'

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
    const { msaConfig } = this.props
    const { isFetching: loading, data } = msaConfig
    const dataKeys = Object.keys(data || {})
    const dataSource = dataKeys.map(key => ({
      key: data[key].key,
      url: key,
      updateTime: '-',
    }))
    const columns = [{
      title: '配置名称',
      dataIndex: 'key',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
    }, {
      title: '操作',
      render: (text, record) => <a target="blank" href={record.url}>查看</a>,
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
          dataSource={dataSource}
          loading={loading}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    msaConfig: state.msa.msaConfig || {},
  }
}

export default connect(mapStateToProps, {
  getMsaConfig,
})(MsaDetailConfig)
