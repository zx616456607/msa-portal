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
import { Row, Col } from 'antd'
import { Chart, Geom, Tooltip } from 'bizcharts'
import './style/index.less'

const threadData = [
  { x: 0.5, y: 0.5, value: 60 },
];


const threadCols = {
  x: { min: 0, max: 1 },
  y: { min: 0, max: 1 },
}

export default class ThreadChart extends React.PureComponent {

  render() {
    return (
      <div className="thread-monitor">
        <div className="monitor-content">
          <Chart className="thread-chart" height={150} width={'100%'} padding={10} data={threadData} scale={threadCols} forceFit>
            <Tooltip crosshairs={{ type: 'y' }}/>
            <Geom type="point" position="x*y" active={false} size={[ 'value', [ 4, 60 ]]} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1 }} />
          </Chart>
          <div className="blow-chart-right">
            <div className="thread-name">xxx线程池</div>
            <div className="request-frequency">
              请求频率： 0.1/s
            </div>
          </div>
        </div>
        <div className="monitor-footer">
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前活动线程数</Col>
            <Col span={2}>2</Col>
            <Col span={11}>活动最大线程数</Col>
            <Col span={2}>1</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前队列数</Col>
            <Col span={2}>0</Col>
            <Col span={11}>已执行的活动线程数</Col>
            <Col span={2}>2</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={9}>当前线程池数</Col>
            <Col span={2}>1</Col>
            <Col span={11}>队列数</Col>
            <Col span={2}>3</Col>
          </Row>
        </div>
      </div>
    )
  }
}
