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
import { Card, Row, Col, Spin } from 'antd'
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts'
import './styles/ServiceBus.less'
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'
import * as OVSActions from '../../actions/overview'
interface ServiceBusProps {
  getServiceBus: () => any
}

interface ServiceBusState {
  SVCBusData: any
  loading: boolean
}

function mapStateToProps(state) {
  return {}
}

class ServiceBus extends React.Component<ServiceBusProps, ServiceBusState> {
  state = {
    SVCBusData: {} as any,
    loading: true,
  }
  async componentDidMount() {
    const SVCBus = await this.props.getServiceBus()
    const SVCBusData = getDeepValue(SVCBus, ['response', 'result', 'data']) || {}
    this.setState({ SVCBusData, loading: false })
  }
  render() {
    return(
      <Spin spinning={this.state.loading}>
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
                    <div className="data">{`${this.state.SVCBusData.availableInstance || 0} 个`}</div>
                  </div>
                  <div>
                    <div className="info color3">申请中实例</div>
                    <div className="data">{`${this.state.SVCBusData.applyInstance || 0} 个`}</div>
                  </div>
                </div>
                <div className="message">
                  <div>
                    <div className="info color4">已拒绝实例</div>
                    <div className="data">{`${this.state.SVCBusData.rejectedInstance || 0} 个`}</div>
                  </div>
                  <div>
                    <div className="info color1">可申请实例</div>
                    <div className="data">{`${this.state.SVCBusData.mayApplyInstance || 0} 个`}</div>
                  </div>
                </div>
                </div>
              </div>
              <div className="alreadySerive">
                <div>
                  <div>我发布的服务</div>
                  <div>{this.state.SVCBusData.myPublishedServiceCount || 0}</div>
                </div>
                <div className="line"/>
                <div>
                  <div>我订阅的服务</div>
                  <div>{this.state.SVCBusData.mySubscribeServiceCount || 0}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <LineChart callInfo={this.state.SVCBusData.callInfo || {}}/>
          </Col>
        </Row>
      </Card>
      </Spin>
    )
  }
}

export default connect(mapStateToProps, {
  getServiceBus: OVSActions.getServiceBus,
})(ServiceBus)

interface LineChartProps {
  callInfo: { [index: string]: Count }
}

interface Count {
  failCount: string
  successCount: string
}

interface LineChartState {

}

const defaultData = [
  { month: 0, city: '累计错误量', temperature: 0 },
  { month: 0, city: '累计调用量', temperature: 0 },
]
class LineChart extends React.Component<LineChartProps, LineChartState> {
  render() {
    const ChartData: any[] = Object.entries(this.props.callInfo).map(([month, { failCount, successCount }]) => {
      return [
        { month, city: '累计错误量', temperature: failCount },
        { month, city: '累计调用量', temperature: successCount },
      ]
    }).reduce((current, next) => { return current.concat(next)  }, [])
    const realChartData = ChartData.length === 0 ? defaultData : ChartData
    return(
      <div className="lineChart">
        <div className="title">近5天我发布的服务累计调用量 / 累计错误量 </div>
        <Chart height={200} forceFit padding={'auto'} data={realChartData} pixelRatio={window.devicePixelRatio * 2} >
          {/* <Legend /> */}
          <Axis name="month" />
          <Axis name="temperature" />
          <Tooltip showTitle={false} />
          <Legend
            name="city"
            position="top-right"
          />
          <Geom type="line" position="month*temperature" color="city" />
          <Geom type="point" position="month*temperature" color="city" style={{ lineWidth: 1, stroke: '#FFF' }} />
        </Chart>
        <div className="y-info">次数</div>
        <div className="x-info">时间</div>
      </div>
    )
  }
}
