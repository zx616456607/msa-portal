/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Thread monitor chart
 *
 * @author zhangxuan
 * @date 2018-07-11
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tooltip as AntTooltip } from 'antd'
import { Chart, Geom } from 'bizcharts'
import './style/index.less'
const threadCols = {
  x: { min: 0, max: 1 },
  y: { min: 0, max: 1 },
}

export default class ThreadChart extends React.PureComponent {

  static propTypes = {
    dataSource: PropTypes.object.isRequired,
  }

  renderRequestFrequency = () => {
    const {
      rollingCountThreadsExecuted,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds,
    } = this.props.dataSource
    const parseExecuted = parseInt(rollingCountThreadsExecuted, 10)
    const parseValue = parseInt(propertyValue_metricsRollingStatisticalWindowInMilliseconds, 10)
    return (parseExecuted / (parseValue / 1000)).toFixed(1) + '/s'
  }

  formatPoolCircleData = () => {
    const {
      rollingCountThreadsExecuted, reportingHosts,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds,
    } = this.props.dataSource
    const parseThreads = parseInt(rollingCountThreadsExecuted, 10)
    const parseHosts = parseInt(reportingHosts, 10)
    const parseProperty = parseInt(propertyValue_metricsRollingStatisticalWindowInMilliseconds, 10)
    const ratePerSecondPerHost = (parseThreads / parseProperty / parseHosts).toFixed(1)
    return [{
      x: 0.5,
      y: 0.5,
      radius: Number(ratePerSecondPerHost),
    }]
  }

  renderColor = () => {
    const { currentQueueSize, reportingHosts } = this.props.dataSource
    const errorPercentage = currentQueueSize / reportingHosts
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
      poolName, currentActiveCount, rollingMaxActiveThreads,
      currentQueueSize, rollingCountThreadsExecuted,
      propertyValue_queueSizeRejectionThreshold, currentPoolSize,
    } = dataSource
    return (
      <div className="thread-monitor">
        <div className="monitor-content">
          <Chart className="thread-chart" height={150} width={156} padding={10} data={this.formatPoolCircleData()} scale={threadCols} forceFit>
            {/* <Tooltip crosshairs={{ type: 'y' }}/>*/}
            <Geom
              type="point"
              position="x*y"
              active={false}
              size={[ 'radius', [ 4, 40 ]]}
              shape={'circle'}
              style={{ stroke: '#fff', lineWidth: 1 }}
              color={this.renderColor()}
              opacity={0.5}
            />
          </Chart>
          <div className="blow-chart-right">
            <div className="thread-name">
              <AntTooltip title={poolName}>
                <div className="pool-name txt-of-ellipsis">{poolName}</div>
              </AntTooltip>
              线程池
            </div>
            <div className="request-frequency">
              请求频率： {this.renderRequestFrequency()}
            </div>
          </div>
        </div>
        <div className="monitor-footer">
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前活动线程数</Col>
            <Col span={2}>{currentActiveCount}</Col>
            <Col span={11}>活动最大线程数</Col>
            <Col span={2}>{rollingMaxActiveThreads}</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前队列数</Col>
            <Col span={2}>{currentQueueSize}</Col>
            <Col span={11}>已执行的活动线程数</Col>
            <Col span={2}>{rollingCountThreadsExecuted}</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前线程池数</Col>
            <Col span={2}>{currentPoolSize}</Col>
            <Col span={11}>队列数</Col>
            <Col span={2}>{propertyValue_queueSizeRejectionThreshold}</Col>
          </Row>
        </div>
      </div>
    )
  }
}
