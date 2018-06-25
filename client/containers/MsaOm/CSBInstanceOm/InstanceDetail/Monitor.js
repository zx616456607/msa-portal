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
import './style/Monitor.less'
import { instanceMonitor } from '../../../../actions/CSB/instance'
import CPU from './CPU'
import Memory from './Memory'
import Network from './Network'
import Disk from './Disk'
import TimeControl from './TimeControl'
import {
  METRICS_CPU, METRICS_MEMORY, METRICS_NETWORK_RECEIVED,
  METRICS_NETWORK_TRANSMITTED, METRICS_DISK_READ, METRICS_DISK_WRITE,
  UPDATE_INTERVAL,
} from '../../../../constants'

const timeFrequency = {
  1: {
    freshInterval: '1分钟',
  },
  6: {
    freshInterval: '5分钟',
  },
  24: {
    freshInterval: '20分钟',
  },
  168: {
    freshInterval: '2小时',
  },
  720: {
    freshInterval: '6小时',
  },
}

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
    freshInterval: '1分钟',
    loading: true,
  }

  componentDidMount() {
    this.intervalLoadMetrics()
  }

  componentWillUnmount() {
    clearInterval(this.metricsInterval)
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
    const { freshInterval } = timeFrequency[value]
    this.setState({
      freshInterval,
      currentValue: value,
    }, () => {
      this.intervalLoadMetrics()
    })
  }

  render() {
    const { loading, currentValue, freshInterval } = this.state
    const { instanceMetrics, clusterID, instance } = this.props
    return (
      <div id="instance-detail-monitor">
        <div className="select-time-radio">
          <TimeControl value={currentValue} onChange={this.handleTimeChange}/>
        </div>
        <div className="monitor-item">
          <CPU
            dataSource={instanceMetrics}
            {...{ loading, freshInterval, clusterID, instance }}
          />
          <Memory
            dataSource={instanceMetrics}
            {...{ loading, freshInterval, clusterID, instance }}
          />
          <Network
            dataSource={instanceMetrics}
            {...{ loading, freshInterval, clusterID, instance }}
          />
          <Disk
            dataSource={instanceMetrics}
            {...{ loading, freshInterval, clusterID, instance }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instanceMonitor: instanceMetrics } = state.CSB
  return {
    instanceMetrics,
  }
}

export default connect(mapStateToProps, {
  instanceMonitor,
})(Monitor)
