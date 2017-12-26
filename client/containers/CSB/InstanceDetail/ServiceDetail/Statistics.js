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
  Row, Col, DatePicker,
} from 'antd'
import CreateG2 from '../../../../components/CreateG2'
import { getInstanceServiceDetail } from '../../../../actions/CSB/instanceService'
import { csbInstanceServiceDetailSlt } from '../../../../selectors/CSB/instanceService'

const RangePicker = DatePicker.RangePicker
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
const detailStr = csbInstanceServiceDetailSlt()

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
    forceFit: true,
    height: 300,
  }

  componentWillMount() {
    // this.loadData()
  }
  loadData = () => {
    const { serviceId, instanceId, getInstanceServiceDetail } = this.props
    getInstanceServiceDetail(instanceId, serviceId)
  }

  render() {
    // const { detailData } = this.props
    return (
      <div className="service-statistics">
        <div className="service-statistics-body">
          <Row>
            <Col span={9} className="service-statistics-item">
              <div>累计调用量</div>
              <div>
                <span>210</span>
                <span>个</span>
              </div>
            </Col>
            <Col span={10} className="service-statistics-item">
              <div>累计错误量</div>
              <div className="error-status">
                <span>210</span>
                <span>个</span>
              </div>
            </Col>
          </Row>
          <Row className="service-statistics-and-monitor">
            <Col span={12}>服务响应 & 调用监控趋势</Col>
            <Col span={12}>
              <RangePicker
                showTime
                size="small"
                format="YYYY-MM-DD HH:mm:ss"
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
  return {
    detailData: detailStr(state),
  }
}

export default connect(mapStateToProps, {
  getInstanceServiceDetail,
})(Statistics)
