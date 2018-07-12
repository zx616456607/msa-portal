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
import { Row, Col } from 'antd'
import { Chart, Geom, Tooltip } from 'bizcharts'
import './style/index.less'

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9, scale: 20, height: 8 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const cols = {
  value: { min: 0 },
  year: { range: [ 0, 1 ] },
  height: { min: 0, max: 13 },
};

export default class BlownChart extends React.PureComponent {

  render() {
    return (
      <div className="blown-monitor">
        <div className="monitor-content">
          <Chart className="blown-chart" height={150} width={156} padding={10} data={data} scale={cols} forceFit>
            <Tooltip crosshairs={{ type: 'y' }}/>
            <Geom
              type="point"
              tooltip={false}
              active={false}
              position="year*height"
              size={[ 'scale', [ 4, 60 ]]}
              shape={'circle'}
              style={{ stroke: '#fff', lineWidth: 1 }}
              opacity={0.5}
            />
            <Geom type="line" position="year*value" size={2} />
          </Chart>
          <div className="blow-chart-right">
            <div className="service-name">test#1.0.0 <span className="unit">hhh</span></div>
            <ul className="request-detail">
              <li>
                <div className="success-status">120</div>
                <div className="warning-status">0</div>
              </li>
              <li>
                <div className="timeout-status">0</div>
                <div className="warning-status">0</div>
                <div className="error-status">0</div>
              </li>
              <li>1%</li>
            </ul>
            <div className="handle-capacity">
              吞吐量： 0.1/s
            </div>
            <div className="blown-status">
              熔断状态：关闭
            </div>
          </div>
        </div>
        <div className="monitor-footer">
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>实例数</Col>
            <Col span={4}>0</Col>
            <Col span={6}>90 th</Col>
            <Col span={6}>NaN</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>中位数时延</Col>
            <Col span={4}>NAN</Col>
            <Col span={6}>99 th</Col>
            <Col span={6}>NaN</Col>
          </Row>
          <Row type={'flex'} align={'middle'} justify={'center'} gutter={16}>
            <Col span={7} offset={1}>平均时延</Col>
            <Col span={4}>NAN</Col>
            <Col span={6}>99.5 th</Col>
            <Col span={6}>NaN</Col>
          </Row>
        </div>
      </div>
    )
  }
}
