/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * PerformanceOV.tsx page
 *
 * @author zhangtao
 * @date Monday December 24th 2018
 */
import * as React from 'react'
import { Card, Row, Col } from 'antd'
import './styles/PerformanceOV.less'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';

interface PerformanceOVProps {

}
interface PerformanceOVState {

}
export default class PerformanceOV extends React.Component<PerformanceOVProps, PerformanceOVState> {
  render() {
    return (
      <Card
        className="PerformanceOV"
        title={<div className="title"><span>性能管理</span><span>监控服务</span></div>}
      >
        <Row gutter={32}>
          <Col span={12}>
            <div className="info">近两天服务调用成功数 Top10</div>
            <Basiccolumn color="#43b3fb"/>
          </Col>
          <Col span={12}>
            <div className="info">近两天服务调用失败数 Top10</div>
            <Basiccolumn color="#f7565c"/>
          </Col>
        </Row>
      </Card>
    )
  }
}

interface BasiccolumnProps {
  color: string
  data?: NodeData[]
}

interface NodeData {
  time: string
  data: string
}
class Basiccolumn extends React.Component<BasiccolumnProps, {}> {
  render() {
    const data = [
      {
        time: '1951 年',
        data: 38,
      }, {
        time: '1952 年',
        data: 38,
      }, {
        time: '1953 年',
        data: 38,
      }, {
        time: '1954 年',
        data: 38,
      },
    ];
    const cols = {
      sales: {
        tickInterval: 20,
      },
    };
    return (
      <div>
        <Chart height={161} data={data} scale={cols} forceFit padding={'auto'}>
          <Axis name="year" />
          <Axis name="sales" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="interval" position="time*data" color={this.props.color}/>
        </Chart>
      </div>
    );
  }
}
