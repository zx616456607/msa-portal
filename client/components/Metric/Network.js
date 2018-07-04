/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Monitor of Network
 *
 * @author zhangxuan
 * @date 2018-06-25
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Tooltip } from 'antd'
import MonitorChart from '../../components/MonitorChart'
import './style/ChartComponent.less'
import {
  METRICS_NETWORK_RECEIVED, METRICS_NETWORK_TRANSMITTED,
} from '../../constants'

export default class Network extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    freshInterval: PropTypes.string,
    loading: PropTypes.bool,
    checked: PropTypes.bool,
    handleSwitch: PropTypes.func,
  }

  formatter = val => {
    return `${(val / 1024).toFixed(2)} KB/s`
  }

  formatterTooltip = (time, metric, service) => {
    metric = (metric / 1024).toFixed(2)
    return {
      title: time,
      name: service,
      value: `${metric} KB/s`,
    }
  }

  handleSwitch = checked => {
    const { handleSwitch } = this.props
    handleSwitch(checked, 'network')
  }

  render() {
    const { checked, dataSource, freshInterval, loading } = this.props
    const networkReceived = dataSource[METRICS_NETWORK_RECEIVED] &&
        dataSource[METRICS_NETWORK_RECEIVED].data || []
    const networkTransmitted = dataSource[METRICS_NETWORK_TRANSMITTED] &&
        dataSource[METRICS_NETWORK_TRANSMITTED].data || []
    let mergeData = []
    networkReceived.forEach(item => {
      const data = item.metrics.map(metric => {
        return Object.assign({}, metric, { container_name: `${metric.container_name} 下载` })
      })
      mergeData = mergeData.concat(data)
    })
    networkTransmitted.forEach(item => {
      const data = item.metrics.map(metric => {
        return Object.assign({}, metric, { container_name: `${metric.container_name} 上传` })
      })
      mergeData = mergeData.concat(data)
    })
    return (
      <div className="monitor-chart-component">
        <div className="chart-name">网络</div>
        <div className="chart-switch-box">
          <div>时间间隔：{checked ? '1分钟' : freshInterval}</div>
          <Tooltip title={'实时开关'}>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={checked}
              onChange={this.handleSwitch}
            />
          </Tooltip>
        </div>
        <MonitorChart
          data={mergeData}
          formatterValue={this.formatter}
          formatterTooltip={this.formatterTooltip}
          loading={loading}
        />
      </div>
    )
  }
}

