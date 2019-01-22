/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * instance detail monitor component
 *
 * 2018-2-01
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import { instanceMonitor, instanceRealTimeMonitor } from '../../../../actions/CSB/instance'
import {
  METRICS_CPU, METRICS_MEMORY, METRICS_NETWORK_RECEIVED,
  METRICS_NETWORK_TRANSMITTED, METRICS_DISK_READ, METRICS_DISK_WRITE,
  UPDATE_INTERVAL, REALTIME_INTERVAL,
} from '../../../../constants'
import Metric from '@tenx-ui/monitorChart'
import '@tenx-ui/monitorChart/assets/index.css'
import './style/Monitor.less'

const sourceTypeArray = [
  METRICS_CPU, METRICS_MEMORY, METRICS_NETWORK_TRANSMITTED,
  METRICS_NETWORK_RECEIVED, METRICS_DISK_READ, METRICS_DISK_WRITE,
]

class Monitor extends React.Component {
  static propTypes = {
    clusterID: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired,
  }

  state = {
    currentValue: '1',
    loading: true,
    realTimeLoading: {},
    realTimeChecked: {},
  }

  componentDidMount() {
    this.intervalLoadMetrics()
  }

  componentWillUnmount() {
    clearInterval(this.metricsInterval)
    sourceTypeArray.forEach(item => {
      clearInterval(this[`${item}RealTimeInterval`])
    })
  }

  intervalLoadMetrics = () => {
    clearInterval(this.metricsInterval)
    this.loadInstanceAllMetrics()
    this.metricsInterval = setInterval(() => {
      this.loadInstanceAllMetrics()
    }, UPDATE_INTERVAL)
  }

  loadInstanceAllMetrics = async () => {
    const promiseArray = sourceTypeArray.map(item => this.getInstanceMetricsByType(item))
    this.setState({
      loading: true,
    })
    await Promise.all(promiseArray)
    this.setState({
      loading: false,
    })
  }

  getInstanceMetricsByType = type => {
    const { instanceMonitor, clusterID, instance } = this.props
    const { currentValue } = this.state
    const query = {
      type,
      start: this.changeTime(currentValue),
      end: new Date().toISOString(),
    }
    return instanceMonitor(clusterID, instance, query)
  }

  changeTime = hours => {
    const d = new Date()
    d.setHours(d.getHours() - hours)
    return d.toISOString()
  }

  handleTimeChange = e => {
    const { value } = e.target
    this.setState({
      currentValue: value,
    }, () => {
      this.intervalLoadMetrics()
    })
  }

  getNetworkMonitor = async () => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
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
    const networkPromiseArray = [
      instanceRealTimeMonitor(clusterID, instance, receivedQuery),
      instanceRealTimeMonitor(clusterID, instance, metricsQuery),
    ]
    await Promise.all(networkPromiseArray)
  }

  getDiskMonitor = async () => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
    const readQuery = {
      type: METRICS_DISK_READ,
      start: now.toISOString(),
      end: new Date().toISOString(),
    }
    const writeQuery = {
      type: METRICS_DISK_WRITE,
      start: now.toISOString(),
      end: new Date().toISOString(),
    }
    const diskPromiseArray = [
      instanceRealTimeMonitor(clusterID, instance, readQuery),
      instanceRealTimeMonitor(clusterID, instance, writeQuery),
    ]
    await Promise.all(diskPromiseArray)
  }

  getMonitor = async type => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
    now.setHours(now.getHours() - 1)
    switch (type) {
      case 'cpu':
        await instanceRealTimeMonitor(clusterID, instance, {
          type: METRICS_CPU,
          start: now.toISOString(),
          end: new Date().toISOString(),
        })
        break
      case 'memory':
        await instanceRealTimeMonitor(clusterID, instance, {
          type: METRICS_MEMORY,
          start: now.toISOString(),
          end: new Date().toISOString(),
        })
        break
      case 'network':
        await this.getNetworkMonitor()
        break
      case 'disk':
        await this.getDiskMonitor()
        break
      default:
        break
    }
    const realTimeLoading = cloneDeep(this.state.realTimeLoading)
    realTimeLoading[type] = false
    this.setState({
      realTimeLoading,
    })
  }

  realTimeMonitor = type => {
    const realTimeLoading = cloneDeep(this.state.realTimeLoading)
    realTimeLoading[type] = true
    this.setState({
      realTimeLoading,
    })
    clearInterval(this[`${type}RealTimeInterval`])
    this.getMonitor(type)
    this[`${type}RealTimeInterval`] = setInterval(this.getMonitor.bind(this, type), REALTIME_INTERVAL)
  }

  handleSwitch = (checked, type) => {
    const realTimeChecked = cloneDeep(this.state.realTimeChecked)
    realTimeChecked[type] = checked
    this.setState({
      realTimeChecked,
    })
    if (checked) {
      this.realTimeMonitor(type)
    }
  }

  render() {
    const { loading, realTimeChecked, realTimeLoading } = this.state
    const { instanceMetrics, realTimeMonitor } = this.props
    return (
      <div id="instance-detail-monitor">
        <Metric
          onChange={this.handleTimeChange}
          dataSource={instanceMetrics}
          realTimeDataSource={realTimeMonitor}
          handleSwitch={this.handleSwitch}
          {...{ loading, realTimeChecked, realTimeLoading }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instanceMonitor: instanceMetrics, instanceRealTimeMonitor } = state.CSB
  return {
    instanceMetrics,
    realTimeMonitor: instanceRealTimeMonitor,
  }
}

export default connect(mapStateToProps, {
  instanceMonitor,
  instanceRealTimeMonitor,
})(Monitor)
