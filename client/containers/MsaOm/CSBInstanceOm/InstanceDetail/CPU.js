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
import { connect } from 'react-redux'
import { Switch, Tooltip } from 'antd'
import { instanceRealTimeMonitor } from '../../../../actions/CSB/instance'
import MonitorChart from '../../../../components/MonitorChart'
import './style/ChartComponent.less'
import {
  METRICS_CPU, REALTIME_INTERVAL,
} from '../../../../constants'

class CPU extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    freshInterval: PropTypes.string,
    loading: PropTypes.bool,
    clusterID: PropTypes.string,
    instance: PropTypes.object,
  }

  state = {}

  componentWillUnmount() {
    clearInterval(this.realTimeInterval)
  }

  formatterTooltip = (time, metric, service) => {
    return {
      title: time,
      name: service,
      value: `${metric.toFixed(1)} %`,
    }
  }

  getMonitor = async () => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
    now.setHours(now.getHours() - 1)
    const query = {
      type: METRICS_CPU,
      start: now.toISOString(),
      end: new Date().toISOString(),
    }
    await instanceRealTimeMonitor(clusterID, instance, query)
    this.setState({
      realTimeLoading: false,
    })
  }

  realTimeMonitor = () => {
    this.setState({
      realTimeLoading: true,
    })
    clearInterval(this.realTimeInterval)
    this.getMonitor()
    this.realTimeInterval = setInterval(this.getMonitor, REALTIME_INTERVAL)
  }

  handleSwitch = checked => {
    this.setState({
      checked,
    })
    if (checked) {
      this.realTimeMonitor()
      return
    }
    clearInterval(this.realTimeInterval)
  }

  render() {
    const { checked, realTimeLoading } = this.state
    const { dataSource, freshInterval, loading, realTimeMonitor } = this.props
    const { data } = checked
      ? (realTimeMonitor[METRICS_CPU] || { data: [] })
      : (dataSource[METRICS_CPU] || { data: [] })
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
          loading={checked ? realTimeLoading : loading}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { CSB } = state
  const { instanceRealTimeMonitor } = CSB
  return {
    realTimeMonitor: instanceRealTimeMonitor,
  }
}

export default connect(mapStateToProps, {
  instanceRealTimeMonitor,
})(CPU)
