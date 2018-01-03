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
import { Button, Table, notification } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaConfig,
  refreshMsaConfig,
} from '../../../../../actions/msa'
import './style/index.less'

class MsaDetailConfig extends React.Component {
  state = {
    refreshConfigLoading: false,
  }

  handleChange = () => {}

  loadMsaConfig = () => {
    const { getMsaConfig, clusterID, name, instances } = this.props
    getMsaConfig(clusterID, `${name}:${instances[0].port}`)
  }

  componentDidMount() {
    this.loadMsaConfig()
  }

  refreshConfig = () => {
    const { refreshMsaConfig, clusterID, name, instances } = this.props
    this.setState({
      refreshConfigLoading: true,
    })
    refreshMsaConfig(clusterID, `${name}:${instances[0].port}`).then(res => {
      this.setState({
        refreshConfigLoading: false,
      })
      if (res.error) {
        return
      }
      notification.success({
        message: '更新配置成功',
      })
      this.loadMsaConfig()
    })
  }

  render() {
    const { msaConfig } = this.props
    const { isFetching: loading, data } = msaConfig
    const dataKeys = Object.keys(data || {})
    const dataSource = []
    dataKeys.forEach(url => {
      Object.keys(data[url]).forEach(key => {
        let gitUrl = url.substring(0, url.lastIndexOf('/'))
        dataSource.push({
          key,
          url: gitUrl,
          value: data[url][key],
        })
      })
    })
    const columns = [{
      title: '配置属性',
      dataIndex: 'key',
    }, {
      title: '属性值',
      dataIndex: 'value',
    }, {
      title: '操作',
      render: (text, record) => <a target="blank" href={record.url}>查看</a>,
    }]
    return (
      <div className="msaDetailConfig">
        <div className="layout-content-btns">
          <Button type="primary" icon="sync" onClick={this.loadMsaConfig}>
          刷新
          </Button>
          <Button
            icon="reload"
            onClick={this.refreshConfig}
            loading={this.state.refreshConfigLoading}
          >
          更新配置
          </Button>
        </div>
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
  refreshMsaConfig,
})(MsaDetailConfig)
