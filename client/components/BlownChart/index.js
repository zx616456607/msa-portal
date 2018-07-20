/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 *  Blown monitor chart
 *
 * @author zhangxuan
 * @date 2018-07-11
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tooltip as AntTooltip } from 'antd'
import { Chart, Geom, Tooltip } from 'bizcharts'
import { formatDate } from '../../common/utils';
import './style/index.less'

const cols = {
  count: { min: 0 },
  time: { range: [ 0, 1 ] },
  vertical: { min: 0 },
};

export default class BlownChart extends React.PureComponent {

  static propTypes = {
    dataSource: PropTypes.object.isRequired,
  }

  renderFailureRage = () => {
    const {
      requestCount, rollingCountFailure, rollingCountTimeout,
      rollingCountThreadPoolRejected,
    } = this.props.dataSource
    const parseFailure = parseInt(rollingCountFailure, 10)
    const parseTimeout = parseInt(rollingCountTimeout, 10)
    const parseRejected = parseInt(rollingCountThreadPoolRejected, 10)
    const failureRate = (parseFailure + parseTimeout + parseRejected) / requestCount
    if (isNaN(failureRate)) {
      return '0.0%'
    }
    return (failureRate * 100).toFixed(0) + '%'
  }

  renderAmount = () => {
    const {
      rollingCountThreadsExecuted, reportingHosts,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds: parseValue,
    } = this.props.dataSource
    return ((rollingCountThreadsExecuted / (parseValue / 1000)) / reportingHosts).toFixed(1) + '/s'
  }

  formatLatency = value => {
    const { reportingHosts } = this.props.dataSource
    return Math.floor(value / reportingHosts)
  }

  formatMonitor = () => {
    const {
      allPoint, reportingHosts, requestCount,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds: parseValue,
    } = this.props.dataSource
    const ratePerSecondPerHost = (requestCount / (parseValue / 1000) / reportingHosts).toFixed(1) // 圆半径
    // 找出 y 轴最大值，用于定位圆的 y 轴位置
    let maxValue = 0
    let minValue = parseInt(allPoint[0].count, 10)
    allPoint.every(item => {
      if (parseInt(item.count) > maxValue) {
        maxValue = parseInt(item.count)
      }
      if (parseInt(item.count) < minValue) {
        minValue = parseInt(item.count)
      }
      return true
    })
    cols.vertical.max = maxValue || 1
    const finalData = allPoint.map(item => {
      return {
        count: item.count,
        time: formatDate(item.time * 1000, 'mm:ss'),
      }
    })
    const circleInfo = {
      radius: Number(ratePerSecondPerHost),
      vertical: maxValue > 0 ? (maxValue) / 2 : 0.5, // 圆的 y 轴坐标
    }
    // 圆的位置在数据中间位置的前一个
    Object.assign(finalData[Math.floor(finalData.length / 2)], circleInfo)
    return finalData
  }

  renderColor = () => {
    const { errorPercentage } = this.props.dataSource
    if (errorPercentage <= 25) {
      return 'green'
    } else if (errorPercentage <= 40) {
      return '#FFCC00'
    } else if (errorPercentage <= 50) {
      return '#FF9900'
    }
    return 'red'
  }

  render() {
    const { dataSource } = this.props
    const {
      circuitBreakerName, requestCount, rollingCountShortCircuited,
      rollingCountTimeout, rollingCountThreadPoolRejected, rollingCountFailure,
      reportingHosts, isCircuitBreakerOpen, latencyExecute, latencyExecute_mean,
    } = dataSource
    return (
      <div className="blown-monitor">
        <div className="monitor-content">
          <Chart className="blown-chart" height={150} width={156} padding={10} data={this.formatMonitor()} scale={cols} forceFit>
            <Tooltip crosshairs={{ type: 'y' }}/>
            <Geom
              type="point"
              tooltip={false}
              active={false}
              position="time*vertical"
              size={[ 'radius', radius => Number(radius) * 10 || 4 ]}
              shape={'circle'}
              style={{ stroke: '#fff', lineWidth: 1 }}
              color={this.renderColor()}
              opacity={0.5}
            />
            <Geom type="line" position="time*count" size={2} />
          </Chart>
          <div className="blow-chart-right">
            <AntTooltip title={circuitBreakerName}>
              <div className="service-name txt-of-ellipsis">{circuitBreakerName}</div>
            </AntTooltip>
            <ul className="request-detail">
              <li>
                <div className="success-status">{requestCount}</div>
                <div className="warning-status">{rollingCountShortCircuited}</div>
              </li>
              <li>
                <div className="timeout-status">{rollingCountTimeout}</div>
                <div className="warning-status">{rollingCountThreadPoolRejected}</div>
                <div className="error-status">{rollingCountFailure}</div>
              </li>
              <li>{this.renderFailureRage()}</li>
            </ul>
            <div className="handle-capacity">
              吞吐量： {this.renderAmount()}
            </div>
            <div className="blown-status">
              熔断状态：{parseInt(isCircuitBreakerOpen, 10) ? '开启' : '关闭'}
            </div>
          </div>
        </div>
        <div className="monitor-footer">
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>实例数</Col>
            <Col span={4}>{reportingHosts}</Col>
            <Col span={6}>90 th</Col>
            <Col span={6}>{this.formatLatency(latencyExecute['90']) + ' ms'}</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>中位数时延</Col>
            <Col span={4}>{this.formatLatency(latencyExecute['50']) + ' ms'}</Col>
            <Col span={6}>99 th</Col>
            <Col span={6}>{this.formatLatency(latencyExecute['99']) + ' ms'}</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>平均时延</Col>
            <Col span={4}>{parseInt(latencyExecute_mean, 10) + ' ms'}</Col>
            <Col span={6}>99.5 th</Col>
            <Col span={6}>{this.formatLatency(latencyExecute['99.5']) + ' ms'}</Col>
          </Row>
        </div>
      </div>
    )
  }
}
