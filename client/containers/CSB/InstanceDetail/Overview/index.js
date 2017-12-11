/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Overview
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Card, Button, Row, Col } from 'antd'
import './style/index.less'
import G2 from 'g2'
import CreateG2Group from '../../../../components/CreateG2/Group'

const Chart = chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('profit'))
    .color('area', [ '#d9d9d9', '#5cb85c', '#f85a5a' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
}
const Chart1 = chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('profit'))
    .color('area', [ '#5cb85c', '#f85a5a' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
}
const ChartTrial = chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('profit'))
    .color('area', [ '#d9d9d9', '#5cb85c', '#f85a5a', '#ffbf00' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
}
const chartAry = [ Chart, Chart1, ChartTrial ]
const ChartGroup = CreateG2Group(chartAry, true)
const [ Charts, Charts1, Charts2 ] = ChartGroup
export default class InstanceDetailOverview extends React.Component {
  state = {
    data: [
      { year: 2007, area: '亚太地区', profit: 7860 * 0.189 },
      { year: 2007, area: '非洲及中东', profit: 7860 * 0.042 },
      { year: 2007, area: '拉丁美洲', profit: 7860 * 0.025 },
    ],
    datas: [
      { year: 2007, area: '亚太地区', profit: 7860 * 0.189 },
      { year: 2007, area: '非洲及中东', profit: 7860 * 0.042 },
    ],
    width: 260,
    height: 210,
  }
  goPublishService = () => {
    const { history, match } = this.props
    const { instanceID } = match.params
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  render() {
    const images = [
      { src: require('../../../../assets/img/csb/csb.png') },
    ]
    return (
      <QueueAnim className="csb-overview">
        <div className="top" key="top">
          <div className="topLeft">
            <div className="imgs">
              <img src={images[0].src} />
            </div>
            <div className="desc">
              <h2>实例名称：</h2>
              <div className="descs">
                <div>创建人：小白</div>
                <div>创建时间：2017-12-12</div>
                <div>描述：Asia圣诞节</div>
              </div>
            </div>
          </div>
          <div className="btn">
            <Button onClick={this.goPublishService} type="primary">
              发布服务
            </Button>
            <Button className="subscribe">订阅服务</Button>
          </div>
        </div>
        <div className="release" key="release">
          <span className="first-title">服务发布</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card title="我的服务调用" bodyStyle={{ height: 180 }}>
                <span>累计调用量</span>
                <h1>10000个</h1>
                <span>累计错误量</span>
                <h1>10000个</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我发布的服务" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
                <Charts
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="desc">
                  <div>
                    <div className="dec-run"></div>
                    <p>已激活</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-error"></div>
                    <p>已停用</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-on"></div>
                    <p>已注销</p>
                    <span>0个</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="服务订阅审批" extra={<a href="#">去审批>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
                <Charts2
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="desc-trial">
                  <div>
                    <div className="dec-run"></div>
                    <p>已通过</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-error"></div>
                    <p>已拒绝</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-on"></div>
                    <p>已退订</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-trial"></div>
                    <p>待审批</p>
                    <span>0个</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="release" key="subscribe">
          <span className="first-title">服务订阅</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card title="消费凭证" bodyStyle={{ height: 180 }}>
                <span>我创建</span>
                <h1>10000个</h1>
                <span>最近更新时间</span>
                <h1>2017-11-11 12:00</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我订阅的服务" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
                <Charts1
                  data={this.state.datas}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="des">
                  <div>
                    <div className="dec-runs"></div>
                    <p>已激活</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-errors"></div>
                    <p>已停用</p>
                    <span>0个</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="可订阅的服务" extra={<a href="#">去订阅>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
                <Charts1
                  data={this.state.datas}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="des">
                  <div>
                    <div className="dec-runs"></div>
                    <p>已激活</p>
                    <span>0个</span>
                  </div>
                  <div>
                    <div className="dec-errors"></div>
                    <p>已停用</p>
                    <span>0个</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}
