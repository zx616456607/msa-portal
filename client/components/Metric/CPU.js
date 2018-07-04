/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Monitor of CPU
 *
 * @author zhangxuan
 * @date 2018-06-21
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Tooltip } from 'antd'
import MonitorChart from '../../components/MonitorChart'
import './style/ChartComponent.less'
import {
  METRICS_CPU,
} from '../../constants'

export default class CPU extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    freshInterval: PropTypes.string,
    loading: PropTypes.bool,
    checked: PropTypes.bool,
    handleSwitch: PropTypes.func,
  }

  formatterTooltip = (time, metric, service) => {
    return {
      title: time,
      name: service,
      value: `${metric.toFixed(1)} %`,
    }
  }

  handleSwitch = checked => {
    const { handleSwitch } = this.props
    handleSwitch(checked, 'cpu')
  }

  render() {
    const { checked, dataSource, freshInterval, loading } = this.props
    const { data } = dataSource[METRICS_CPU] || { data: [] }
    let mergeData = []
    data && data.forEach(item => {
      mergeData = mergeData.concat(item.metrics)
    })
    return (
      <div className="monitor-chart-component">
        <div className="chart-name">CPU</div>
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
          formatterValue={val => `${val} %`}
          formatterTooltip={this.formatterTooltip}
          loading={loading}
        />
      </div>
    )
  }
}

