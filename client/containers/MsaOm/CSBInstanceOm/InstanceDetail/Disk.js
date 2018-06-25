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
import { connect } from 'react-redux'
import { Switch, Tooltip } from 'antd'
import MonitorChart from '../../../../components/MonitorChart'
import './style/ChartComponent.less'
import {
  METRICS_DISK_READ, METRICS_DISK_WRITE, REALTIME_INTERVAL,
} from '../../../../constants'
import { instanceRealTimeMonitor } from '../../../../actions/CSB/instance'

class Disk extends React.PureComponent {
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

  getMonitor = async () => {
    const { instanceRealTimeMonitor, clusterID, instance } = this.props
    const now = new Date()
    now.setHours(now.getHours() - 1)
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
    const promiseArray = [
      instanceRealTimeMonitor(clusterID, instance, readQuery),
      instanceRealTimeMonitor(clusterID, instance, writeQuery),
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
})(Disk)
