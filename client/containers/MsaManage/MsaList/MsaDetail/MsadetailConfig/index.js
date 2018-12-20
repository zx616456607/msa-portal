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
import { withNamespaces } from 'react-i18next'

@withNamespaces('MsaList')
class MsaDetailConfig extends React.Component {
  state = {
    refreshConfigLoading: false,
  }

  handleChange = () => { }

  loadMsaConfig = () => {
    const { t, getMsaConfig, clusterID, name, instances } = this.props
    getMsaConfig(clusterID, `${name}:${instances[0].port}`, { isHandleError: true }).then(res => {
      if (res.status === 404) {
        notification.warn({
          message: t('detail.MsadetailConfig.noConfigs'),
        })
      }
    })
  }

  componentDidMount() {
    this.loadMsaConfig()
  }

  refreshConfig = () => {
    const { t, refreshMsaConfig, clusterID, name, instances } = this.props
    this.setState({
      refreshConfigLoading: true,
    })
    refreshMsaConfig(clusterID, `${name}:${instances[0].port}`, { isHandleError: true }).then(res => {
      this.setState({
        refreshConfigLoading: false,
      })
      if (res.error) {
        if (res.status === 404) {
          notification.warn({
            message: t('detail.MsadetailConfig.noConfigs'),
          })
          return
        }
        return notification.warn({
          message: t('detail.MsadetailConfig.updateFailed'),
        })
      }
      notification.success({
        message: t('detail.MsadetailConfig.updateSucc'),
      })
      this.loadMsaConfig()
    })
  }

  render() {
    const { msaConfig, t } = this.props
    const { isFetching: loading, data } = msaConfig
    const dataKeys = Object.keys(data || {})
    const dataSource = []
    dataKeys.forEach(url => {
      Object.keys(data[url]).forEach(key => {
        const gitUrl = url.substring(0, url.lastIndexOf('/'))
        dataSource.push({
          key,
          url: gitUrl,
          value: data[url][key],
        })
      })
    })
    const columns = [{
      title: t('detail.MsadetailConfig.configProp'),
      dataIndex: 'key',
    }, {
      title: t('detail.MsadetailConfig.propValue'),
      dataIndex: 'value',
    }, {
      title: t('detail.MsadetailConfig.opera'),
      render: (text, record) => <a target="blank" href={record.url}>{t('detail.MsadetailConfig.check')}</a>,
    }]
    return (
      <div className="msaDetailConfig">
        <div className="layout-content-btns">
          <Button type="primary" icon="sync" onClick={this.loadMsaConfig}>
            {t('detail.MsadetailConfig.reflesh')}
          </Button>
          <Button
            icon="reload"
            onClick={this.refreshConfig}
            loading={this.state.refreshConfigLoading}
          >
            {t('detail.MsadetailConfig.updateConfig')}
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
