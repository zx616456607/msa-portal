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
import EmptyCircle from '../../components/BlownChart/EmptyCircle'

const threadCols = {
  x: { min: 0, max: 1 },
  y: { min: 0, max: 1 },
}

export default class ThreadChart extends React.PureComponent {

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
    const newRadius = this.calculateRadius(nextProps.dataSource)
    const oldRadius = this.calculateRadius(this.props.dataSource)
    if (newRadius !== oldRadius) {
      this.setState({
        radius: newRadius,
      })
    }
  }

  calculateRadius = dataSource => {
    const {
      rollingCountThreadsExecuted, reportingHosts,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds: parseProperty,
    } = dataSource
    return (rollingCountThreadsExecuted / (parseProperty / 1000) / reportingHosts).toFixed(1)
  }

  renderRequestFrequency = () => {
    const {
      rollingCountThreadsExecuted,
      propertyValue_metricsRollingStatisticalWindowInMilliseconds: parseProperty,
    } = this.props.dataSource
    return (rollingCountThreadsExecuted / (parseProperty / 1000)).toFixed(1) + '/s'
  }

  formatPoolCircleData = () => {
    const ratePerSecondPerHost = this.calculateRadius(this.props.dataSource)
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
      poolName, currentActiveCount, rollingMaxActiveThreads,
      currentQueueSize, rollingCountThreadsExecuted,
      propertyValue_queueSizeRejectionThreshold, currentPoolSize,
    } = dataSource
    return (
      <div className="thread-monitor">
        <div className="monitor-content">
          <div className="monitor-content-wrapper">
            {
              !Number(radius) &&
              <div className="empty-data-box" style={{ color: this.renderColor() }}>
                <EmptyCircle style={{ fill: this.renderColor() }}/>
              </div>
            }
            <Chart className="thread-chart" height={150} width={156} padding={10} data={this.formatPoolCircleData()} scale={threadCols} forceFit>
              {/* <Tooltip crosshairs={{ type: 'y' }}/>*/}
              <Geom
                type="point"
                position="x*y"
                active={false}
                size={[ 'radius', radius => Number(radius) * 10 ]}
                shape={'circle'}
                style={{ stroke: '#fff', lineWidth: 1 }}
                color={this.renderColor()}
                opacity={0.5}
              />
            </Chart>
          </div>
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
