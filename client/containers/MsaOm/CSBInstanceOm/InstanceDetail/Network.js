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
import { connect } from 'react-redux'
import { Switch, Tooltip } from 'antd'
import { instanceRealTimeMonitor } from '../../../../actions/CSB/instance'
import MonitorChart from '../../../../components/MonitorChart'
import './style/ChartComponent.less'
import {
  METRICS_NETWORK_RECEIVED, METRICS_NETWORK_TRANSMITTED, REALTIME_INTERVAL,
} from '../../../../constants'

class Network extends React.PureComponent {
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
  getMonitor = async () => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
    now.setHours(now.getHours() - 1)
    const receivedQuery = {
      type: METRICS_NETWORK_RECEIVED,
      start: now.toISOString(),
      end: new Date().toISOString(),
    }
    const metricsQuery = {
      type: METRICS_NETWORK_TRANSMITTED,
      start: now.toISOString(),
      end: new Date().toISOString(),
    }
    const promiseArray = [
      instanceRealTimeMonitor(clusterID, instance, receivedQuery),
      instanceRealTimeMonitor(clusterID, instance, metricsQuery),
    ]
    await Promise.all(promiseArray)
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
    const { dataSource, freshInterval, loading } = this.props
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
          loading={checked ? realTimeLoading : loading}
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  instanceRealTimeMonitor,
})(Network)
