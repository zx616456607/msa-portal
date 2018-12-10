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
import { Button, Table, notification } from 'antd'
import { connect } from 'react-redux'
import {
  getMsaEnv,
} from '../../../../../actions/msa'
import './style/index.less'
import { MSA_TYPE_MAN } from '../../../../../constants'

class MsaDetailEnv extends React.Component {
  loadMsaEnv = async () => {
    const { getMsaEnv, clusterID, name, instances } = this.props
    const res = await getMsaEnv(clusterID, `${name}:${instances[0].port}`, { isHandleError: true })
    if (res.status === 404) {
      notification.warn({
        message: '暂无配置',
      })
    }
  }

  componentDidMount() {
    this.loadMsaEnv()
  }

  render() {
    const { msaEnv, registryType } = this.props
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
    const locale = {
      emptyText: '暂无数据',
    };
    if (registryType === MSA_TYPE_MAN) {
      locale.emptyText = '无法获取外部服务数据'
    }
    return (
      <div className="msaDetailEnv">
        <div className="layout-content-btns">
          <Button onClick={this.loadMsaEnv} type="primary" icon="sync">
            刷新
          </Button>
        </div>
        <Table
          bordered
          locale={locale}
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
