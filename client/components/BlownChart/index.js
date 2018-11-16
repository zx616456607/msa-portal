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
import { formatDate } from '../../common/utils'
import './style/index.less'
import EmptyCircle from '../../components/BlownChart/EmptyCircle'

const cols = {
  count: { min: -10, max: 100 },
  vertical: { min: 0, max: 100 },
}

export default class BlownChart extends React.PureComponent {

  static propTypes = {
    dataSource: PropTypes.object.isRequired,
  }

  state = {}

  componentDidMount() {
    const radius = this.calculateRadius(this.props.dataSource)
    this.setState({
      radius,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource: newDataSource } = nextProps
    const { dataSource: oldDataSource } = this.props
    const newRadius = this.calculateRadius(newDataSource)
    const oldRadius = this.calculateRadius(oldDataSource)
    if (newRadius !== oldRadius) {
      this.setState({
        radius: newRadius,
      })
    }
  }

  calculateRadius = dataSource => {
    const {
      reportingHosts, requestCount,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds: parseValue,
    } = dataSource
    return (requestCount / (parseValue / 1000) / reportingHosts).toFixed(1)
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
      allPoint,
    } = this.props.dataSource
    const ratePerSecondPerHost = this.calculateRadius(this.props.dataSource)

    const finalData = allPoint.map(item => {
      return {
        count: Number(item.count),
        time: formatDate(Number(item.time) * 1000, 'HH:mm:ss'),
      }
    })
    const circleInfo = {
      radius: Number(ratePerSecondPerHost), // 圆的半径
      vertical: 50, // 圆的y轴坐标
    }
    // 圆的位置在数据中间位置的前一个
    Object.assign(finalData[Math.floor(finalData.length / 2)], circleInfo)
    return finalData
  }

  renderColor = () => {
    const { errorPercentage } = this.props.dataSource
    if (errorPercentage <= 25) {
      return '#85ca87'
    } else if (errorPercentage <= 40) {
      return '#fdd552'
    } else if (errorPercentage <= 50) {
      return '#ffa15b'
    }
    return '#fd726f'
  }

  render() {
    const { radius } = this.state
    const { dataSource } = this.props
    const {
      circuitBreakerName, requestCount, rollingCountShortCircuited,
      rollingCountTimeout, rollingCountThreadPoolRejected, rollingCountFailure,
      reportingHosts, isCircuitBreakerOpen, latencyExecute, latencyExecute_mean,
    } = dataSource
    return (
      <div className="blown-monitor">
        <div className="monitor-content">
          <div className="monitor-content-wrapper">
            {
              !Number(radius) &&
              <div className="empty-data-box" style={{ color: this.renderColor() }}>
                <EmptyCircle style={{ fill: this.renderColor() }}/>
              </div>
            }
            <Chart className="blown-chart" height={150} width={156} padding={10} data={this.formatMonitor()} scale={cols} forceFit>
              <Tooltip crosshairs={{ type: 'y' }}/>
              {
                Number(radius) ?
                  <Geom
                    type="point"
                    tooltip={false}
                    active={false}
                    position="time*vertical"
                    size={[ 'radius', [ 4, 60 ]]}
                    shape={'circle'}
                    style={{ stroke: '#fff', lineWidth: 1 }}
                    color={this.renderColor()}
                    opacity={0.5}
                  /> : null
              }
              <Geom type="line" position="time*count" size={2} color={this.renderColor()}/>
            </Chart>
          </div>
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
