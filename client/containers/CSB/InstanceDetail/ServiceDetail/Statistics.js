/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service statistics detail
 *
 * 2017-12-22
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Row, Col,
} from 'antd'
import CreateG2 from '../../../../components/CreateG2'
import ApmTimePicker from '../../../../components/ApmTimePicker'
import { getInstanceServiceOverview, getInstanceServiceDetailMap } from '../../../../actions/CSB/instanceService'

const Chart = CreateG2(chart => {
  chart.col('dateTime', {
    alias: '时间',
    // type: 'time',
    // mask: 'MM:ss',
    tickCount: 10,
    // nice: false,
  })
  chart.col('count', {
    alias: '次数',
  })
  chart.col('monitorType', {
    type: 'cat',
  })
  chart.line()
    .position('dateTime*count')
    .color('monitorType', [ '#5cb85c', '#f85a5a' ])
    .shape('smooth')
    .size(2)
  chart.legend({
    title: '调用监控趋势',
    position: 'right', // 设置图例的显示位置
  })
  chart.render()
})

class Statistics extends React.Component {
  state = {
    data: [
      { dateTime: '09:59:00', count: 12, monitorType: 'qps' },
      { dateTime: '10:00:00', count: 56, monitorType: 'qps' },
      { dateTime: '10:01:00', count: 78, monitorType: 'qps' },
      { dateTime: '10:02:00', count: 144, monitorType: 'qps' },
      { dateTime: '10:03:00', count: 345, monitorType: 'qps' },
      { dateTime: '10:04:00', count: 567, monitorType: 'qps' },
      { dateTime: '10:05:00', count: 456, monitorType: 'qps' },
      { dateTime: '10:06:00', count: 333, monitorType: 'qps' },
      { dateTime: '10:07:00', count: 233, monitorType: 'qps' },
      { dateTime: '10:08:00', count: 123, monitorType: 'qps' },
      { dateTime: '10:09:00', count: 56, monitorType: 'qps' },
      { dateTime: '10:10:00', count: 35, monitorType: 'qps' },
      { dateTime: '09:59:00', count: 0, monitorType: 'errNum' },
      { dateTime: '10:00:00', count: 1, monitorType: 'errNum' },
      { dateTime: '10:01:00', count: 3, monitorType: 'errNum' },
      { dateTime: '10:02:00', count: 6, monitorType: 'errNum' },
      { dateTime: '10:03:00', count: 7, monitorType: 'errNum' },
      { dateTime: '10:04:00', count: 9, monitorType: 'errNum' },
      { dateTime: '10:05:00', count: 12, monitorType: 'errNum' },
      { dateTime: '10:06:00', count: 5, monitorType: 'errNum' },
      { dateTime: '10:07:00', count: 12, monitorType: 'errNum' },
      { dateTime: '10:08:00', count: 4, monitorType: 'errNum' },
      { dateTime: '10:09:00', count: 3, monitorType: 'errNum' },
      { dateTime: '10:10:00', count: 2, monitorType: 'errNum' },
    ],
    callCount: 0,
    errorCallCount: 0,
    forceFit: true,
    height: 300,
    rangeDateTime: [],
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = () => {
    const { rangeDateTime } = this.state
    const {
      serviceId,
      instanceId,
      getInstanceServiceOverview,
      getInstanceServiceDetailMap } = this.props
    let query = {
      period: '16',
      startTime: rangeDateTime.length > 0 ?
        rangeDateTime[0].toISOString() : new Date().toISOString(),
      endTime: rangeDateTime.length > 0 ?
        rangeDateTime[1].toISOString() : new Date(new Date() - 300 * 1000).toISOString(),
    }
    query = Object.assign({}, query)
    if (query.startTime === '') {
      delete query.startTime
      delete query.period
    }
    if (query.endTime === '') {
      delete query.endTime
    }
    getInstanceServiceOverview(instanceId, serviceId)
    getInstanceServiceDetailMap(instanceId, serviceId, query)
  }

  componentWillReceiveProps(nextProps) {
    const { isFetching } = nextProps.detailData
    if (isFetching !== undefined) {
      if (!isFetching && nextProps.detailData.data) {
        if (!nextProps.detailData.data[`${nextProps.serviceId}`]) return
        const { totalCallCount, totalErrorCallCount } = nextProps.detailData.data[`${nextProps.serviceId}`]
        this.setState({
          callCount: totalCallCount,
          errorCallCount: totalErrorCallCount,
        })
      }
    }
  }

  render() {
    const { callCount, errorCallCount, rangeDateTime } = this.state
    return (
      <div className="service-statistics">
        <div className="service-statistics-body">
          <Row>
            <Col span={9} className="service-statistics-item">
              <div>累计调用量</div>
              <div>
                <span>{callCount}</span>
                <span>个</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>累计错误量</div>
              <div className="error-status">
                <span>{errorCallCount}</span>
                <span>个</span>
              </div>
            </Col>
          </Row>
          <Row className="service-statistics-and-monitor">
            <Col span={11}>服务响应 & 调用监控趋势</Col>
            <Col span={13}>
              <ApmTimePicker
                value={rangeDateTime}
                onChange={rangeDateTime => this.setState({ rangeDateTime })}
                onOk={this.loadData}
              />
            </Col>
          </Row>
          <Row>
            <Col span={9} className="service-statistics-item">
              <div>平均响应时间</div>
              <div>
                <span>210</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>最小响应时间</div>
              <div>
                <span>210</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={5} className="service-statistics-item">
              <div>最大响应时间</div>
              <div>
                <span>210</span>
                <span>ms</span>
              </div>
            </Col>
          </Row>
          <div className="service-detail-body-monitor">
            <Chart
              data={this.state.data}
              height={this.state.height}
              width={100}
              forceFit={this.state.forceFit}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { CSB } = state
  const overviewList = CSB.serviceOverview.default
  return {
    // dataMap,
    detailData: overviewList || [],
  }
}

export default connect(mapStateToProps, {
  getInstanceServiceOverview,
  getInstanceServiceDetailMap,
})(Statistics)
