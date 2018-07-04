/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Monitor of Disk
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
  METRICS_DISK_READ, METRICS_DISK_WRITE,
} from '../../constants'

export default class Disk extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    freshInterval: PropTypes.string,
    loading: PropTypes.bool,
    checked: PropTypes.bool,
    handleSwitch: PropTypes.func,
  }

  formatter = val => {
    return `${(val / 1024).toFixed(0)} KB/s`
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
    handleSwitch(checked, 'disk')
  }

  render() {
    const { checked, dataSource, freshInterval, loading } = this.props
    const diskRead = dataSource[METRICS_DISK_READ] &&
        dataSource[METRICS_DISK_READ].data || []
    const diskWrite = dataSource[METRICS_DISK_WRITE] &&
        dataSource[METRICS_DISK_WRITE].data || []
    let mergeData = []
    diskRead.forEach(item => {
      const data = item.metrics.map(metric => {
        return Object.assign({}, metric, { container_name: `${metric.container_name} 读取` })
      })
      mergeData = mergeData.concat(data)
    })
    diskWrite.forEach(item => {
      const data = item.metrics.map(metric => {
        return Object.assign({}, metric, { container_name: `${metric.container_name} 写入` })
      })
      mergeData = mergeData.concat(data)
    })
    return (
      <div className="monitor-chart-component">
        <div className="chart-name">磁盘</div>
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
