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
import { Button, Table } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaEnv,
} from '../../../../../actions/msa'
import './style/index.less'

class MsaDetailEnv extends React.Component {
  loadMsaEnv = () => {
    const { getMsaEnv, clusterID, name, instances } = this.props
    getMsaEnv(clusterID, `${name}:${instances[0].port}`)
  }

  componentDidMount() {
    this.loadMsaEnv()
  }

  render() {
    const { msaEnv } = this.props
    const { isFetching: loading, data } = msaEnv
    const dataKeys = Object.keys(data || {})
    const dataSource = dataKeys.map(key => ({
      key,
      value: data[key],
    }))
    const columns = [{
      title: 'key',
      dataIndex: 'key',
      width: '40%',
    }, {
      title: 'value',
      dataIndex: 'value',
      width: '60%',
    }]
    return (
      <div className="msaDetailEnv">
        <div className="layout-content-btns">
          <Button onClick={this.loadMsaEnv} type="primary" icon="sync">
            刷新
          </Button>
        </div>
        <Table
          bordered
          className="msaDetailEnv-table"
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
    msaEnv: state.msa.msaEnv || {},
  }
}

export default connect(mapStateToProps, {
  getMsaEnv,
})(MsaDetailEnv)
