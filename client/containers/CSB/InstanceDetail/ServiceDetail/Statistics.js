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
import { formatDate } from '../../../../common/utils'
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
  // chart.col('monitorType', {
  //   type: 'cat',
  // })
  chart.line()
    .position('dateTime*count')
    // .color('monitorType', [ '#5cb85c', '#f85a5a' ])
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
    data: [],
    callCount: 0,
    errorCallCount: 0,
    forceFit: true,
    height: 300,
    rangeDateTime: [],
    averageTime: 0,
    minTime: 0,
    maxTime: 0,
  }

  componentWillMount() {
    this.loadData()
  }

  componentWillReceiveProps(nextProps) {
    const { isFetching } = nextProps.detailData
    if (!nextProps.dataMap.isFetching) {
      if (nextProps.dataMap.data) {
        this.fetchMapList(nextProps.dataMap.data)
      }
    }
    if (isFetching !== undefined) {
      if (!isFetching && nextProps.detailData.data) {
        if (!nextProps.detailData.data[`${nextProps.serviceId}`]) return
        this.fetchDetailList(nextProps.detailData.data, nextProps.serviceId)
      }
    }
  }

  loadData = () => {
    const { rangeDateTime } = this.state
    const {
      serviceId,
      instanceId,
      getInstanceServiceOverview,
      getInstanceServiceDetailMap } = this.props
    const timer = this.filterTimer(rangeDateTime)
    let query = {
      period: '16',
      startTime: timer.start,
      endTime: timer.end,
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

  filterTimer = time => {
    const startT = time.length > 0 ?
      time[0].toISOString().split('.')[0] + 'Z' : new Date().toISOString().split('.')[0] + 'Z'
    const endT = time.length > 0 ?
      time[1].toISOString().split('.')[0] + 'Z' :
      new Date(new Date() - 300 * 1000).toISOString().split('.')[0] + 'Z'
    const timer = {
      start: startT,
      end: endT,
    }
    return timer
  }

  fetchDetailList = (data, serviceId) => {
    const { totalCallCount, totalErrorCallCount } = data[`${serviceId}`]
    this.setState({
      callCount: totalCallCount,
      errorCallCount: totalErrorCallCount,
    })
  }

  fetchMapList = data => {
    const curAry = []
    data.diagramData.forEach(item => {
      const dataAry = {
        count: item.callCount,
        dateTime: formatDate(item.timeStamp),
      }
      curAry.push(dataAry)
    })
    this.setState({
      maxTime: data.maxCallTime,
      minTime: data.minCallTime,
      averageTime: data.averageCallTime,
      data: curAry,
    })
  }

  render() {
    const { data, averageTime, minTime, maxTime } = this.state
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
            <Col span={8}>服务响应 & 调用监控趋势</Col>
            <Col span={16} style={{ textAlign: 'right' }}>
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
                <span>{averageTime}</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>最小响应时间</div>
              <div>
                <span>{minTime}</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={5} className="service-statistics-item">
              <div>最大响应时间</div>
              <div>
                <span>{maxTime}</span>
                <span>ms</span>
              </div>
            </Col>
          </Row>
          <div className="service-detail-body-monitor">
            <Chart
              data={data}
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
  const dataMap = CSB.serviceDetailMap.default
  return {
    dataMap,
    detailData: overviewList || [],
  }
}

export default connect(mapStateToProps, {
  getInstanceServiceOverview,
  getInstanceServiceDetailMap,
})(Statistics)
