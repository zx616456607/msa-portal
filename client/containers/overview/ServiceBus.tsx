/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * ServiceBus.tsx page
 *
 * @author zhangtao
 * @date Monday December 24th 2018
 */
import * as React from 'react'
import { Card, Row, Col } from 'antd'
import { Chart, Axis, Geom, Tooltip } from 'bizcharts'
import './styles/ServiceBus.less'

interface ServiceBusProps {

}

interface ServiceBusState {

}

export default class ServiceBus extends React.Component<ServiceBusProps, ServiceBusState> {
  render() {
    return(
      <Card
        className="ServiceBus"
        title={<div className="title"><span>服务总线</span><span className="info">（项目&集群无关）</span></div>}
      >
        <Row>
          <Col span={8}>
            <div className="IStatistics">
              <div className="instance">
                <div className="title">实例统计</div>
                <div className="messageBox ">
                <div className="message">
                  <div>
                    <div className="info color2">可用实例</div>
                    <div className="data">{`${0} 个`}</div>
                  </div>
                  <div>
                    <div className="info color3">申请中实例</div>
                    <div className="data">{`${0} 个`}</div>
                  </div>
                </div>
                <div className="message">
                  <div>
                    <div className="info color4">已拒绝实例</div>
                    <div className="data">{`${0} 个`}</div>
                  </div>
                  <div>
                    <div className="info color1">可申请实例</div>
                    <div className="data">{`${0} 个`}</div>
                  </div>
                </div>
                </div>
              </div>
              <div className="alreadySerive">
                <div>
                  <div>我发布的服务</div>
                  <div>{0}</div>
                </div>
                <div className="line"/>
                <div>
                  <div>我订阅的服务</div>
                  <div>{0}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <LineChart/>
          </Col>
        </Row>
      </Card>
    )
  }
}

interface LineChartProps {

}

interface LineChartState {

}

const data = [
  { month: 'Jan', city: 'Tokyo', temperature: 7 },
  { month: 'Jan', city: 'London', temperature: 3.9 },
  { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
  { month: 'Feb', city: 'London', temperature: 4.2 },
  { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
  { month: 'Mar', city: 'London', temperature: 5.7 },
  { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
  { month: 'Apr', city: 'London', temperature: 8.5 },
  { month: 'May', city: 'Tokyo', temperature: 18.4 },
  { month: 'May', city: 'London', temperature: 11.9 },
  { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
  { month: 'Jun', city: 'London', temperature: 15.2 },
  { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
  { month: 'Jul', city: 'London', temperature: 17 },
  { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
  { month: 'Aug', city: 'London', temperature: 16.6 },
  { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
  { month: 'Sep', city: 'London', temperature: 14.2 },
  { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
  { month: 'Oct', city: 'London', temperature: 10.3 },
  { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
  { month: 'Nov', city: 'London', temperature: 6.6 },
  { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
  { month: 'Dec', city: 'London', temperature: 4.8,
  }];

// function marker(x, y, r, ctx) {
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = ctx.fillStyle;
//   ctx.moveTo(x - r - 3, y);
//   ctx.lineTo(x + r + 3, y);
//   ctx.stroke();
//   ctx.arc(x, y, r, 0, Math.PI * 2, false);
//   ctx.fill();
// }

class LineChart extends React.Component<LineChartProps, LineChartState> {
  render() {
    return(
      <div className="lineChart">
        <div className="title">近5天我发布的服务累计调用量 / 累计错误量 </div>
        <Chart height={200} forceFit padding={'auto'} data={data} pixelRatio={window.devicePixelRatio * 2} >
          <Axis name="month" />
          <Axis name="temperature" />
          <Tooltip showTitle={false} />
          {/* <Legend marker={marker} /> */}
          <Geom type="line" position="month*temperature" color="city" />
          <Geom type="point" position="month*temperature" color="city" style={{ lineWidth: 1, stroke: '#FFF' }} />
        </Chart>
      </div>
    )
  }
}
