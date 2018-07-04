/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Monitor of Memory
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
  METRICS_MEMORY,
} from '../../constants'

export default class Memory extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    freshInterval: PropTypes.string,
    loading: PropTypes.bool,
    checked: PropTypes.bool,
    handleSwitch: PropTypes.func,
  }

  componentWillUnmount() {
    clearInterval(this.realTimeInterval)
  }

  formatter = val => {
    return `${(val / 1024 / 1024).toFixed(0)} M`
  }

  formatterTooltip = (time, metric, service) => {
    metric = (metric / 1024 / 1024).toFixed(1)
    return {
      title: time,
      name: service,
      value: `${metric} M`,
    }
  }

  handleSwitch = checked => {
    const { handleSwitch } = this.props
    handleSwitch(checked, 'memory')
  }

  render() {
    const { checked, dataSource, freshInterval, loading } = this.props
    let mergeData = []
    const { data } = dataSource[METRICS_MEMORY] || { data: [] }
    data && data.forEach(item => {
      mergeData = mergeData.concat(item.metrics)
    })
    return (
      <div className="monitor-chart-component">
        <div className="chart-name">内存</div>
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
