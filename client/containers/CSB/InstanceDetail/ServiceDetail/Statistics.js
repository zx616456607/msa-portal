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
    type: 'time',
    mask: 'yyyy-mm-dd hh:MM:ss',
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
    forceFit: true,
    height: 300,
    rangeDateTime: [],
  }

  componentWillMount() {
    const { serviceId, instanceId, getInstanceServiceOverview } = this.props
    getInstanceServiceOverview(instanceId, serviceId)
    this.loadData()
  }

  loadData = () => {
    const { rangeDateTime } = this.state
    const {
      serviceId,
      instanceId,
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
    getInstanceServiceDetailMap(instanceId, serviceId, query)
  }

  filterTimer = time => {
    const startT = time.length > 0 ?
      time[0].toISOString().split('.')[0] + 'Z' :
      new Date(new Date() - 300 * 1000).toISOString().split('.')[0] + 'Z'
    const endT = time.length > 0 ?
      time[1].toISOString().split('.')[0] + 'Z' : new Date().toISOString().split('.')[0] + 'Z'
    const timer = {
      start: startT,
      end: endT,
    }
    return timer
  }

  fetchMapList = data => {
    if (data.length === 0) return
    const curAry = []
    data.forEach(item => {
      const dataAry = {
        count: item.callCount,
        dateTime: formatDate(item.timeStamp),
      }
      curAry.push(dataAry)
    })
    return curAry
  }

  render() {
    const { rangeDateTime } = this.state
    const { dataMap, detailData, serviceId } = this.props
    const { maxCallTime, minCallTime, averageCallTime, diagramData } = dataMap && dataMap.data || {}
    const { totalCallCount, totalErrorCallCount } = detailData && detailData[`${serviceId}`] || {}
    const dataList = this.fetchMapList(diagramData || []) || []
    return (
      <div className="service-statistics">
        <div className="service-statistics-body">
          <Row>
            <Col span={9} className="service-statistics-item">
              <div>累计调用量</div>
              <div>
                <span>{totalCallCount || 0}</span>
                <span>个</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>累计错误量</div>
              <div className="error-status">
                <span>{totalErrorCallCount || 0}</span>
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
                <span>{averageCallTime || 0}</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>最小响应时间</div>
              <div>
                <span>{minCallTime || 0}</span>
                <span>ms</span>
              </div>
            </Col>
            <Col span={5} className="service-statistics-item">
              <div>最大响应时间</div>
              <div>
                <span>{maxCallTime || 0}</span>
                <span>ms</span>
              </div>
            </Col>
          </Row>
          <div className="service-detail-body-monitor">
            <Chart
              data={dataList}
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

const mapStateToProps = (state, ownProps) => {
  const { CSB } = state
  const { serviceId } = ownProps
  const overviewList = CSB.serviceOverview
  const dataMap = CSB.serviceDetailMap[serviceId]
  return {
    dataMap,
    detailData: overviewList || {},
  }
}

export default connect(mapStateToProps, {
  getInstanceServiceOverview,
  getInstanceServiceDetailMap,
})(Statistics)
