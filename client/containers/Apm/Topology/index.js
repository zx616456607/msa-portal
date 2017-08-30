/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Topology
 *
 * 2017-08-28
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon, DatePicker, Radio, Row, Col, Checkbox, Select } from 'antd'
import '../style/topology.less'
import RelationSchema from '../../../components/RelationSchema'
const { RangePicker } = DatePicker
import { loadApms } from '../../../actions/apm'
import { loadPinpointMap, loadPPApps, loadScatterData } from '../../../actions/pinpoint'
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT } from '../../../constants'
import createG2 from 'g2-react'
const G2 = require('g2')
const Option = Select.Option

// 点图
// 设置鼠标 hove 至气泡的样式
G2.Global.activeShape.point = {
  lineWidth: 2,
  shadowBlur: 12,
  shadowColor: '#3182bd',
}
const data = [
  { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
  { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
  { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
  { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
  { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
  { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
  { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
  { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
  { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
  { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
  { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
  { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
  { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
  { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
  { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' },
]
const Chart1 = createG2(chart => {
  chart.col('x', {
    alias: 'Daily fat intake', // 定义别名
    tickInterval: 5, // 自定义刻度间距
    nice: false, // 不对最大最小值优化
    max: 96, // 自定义最大值
    min: 62, // 自定义最小值
  })
  chart.col('y', {
    alias: 'Daily sugar intake',
    tickInterval: 50,
    nice: false,
    max: 165,
    min: 0,
  })
  chart.col('z', {
    alias: 'Obesity(adults) %',
  })
  // 开始配置坐标轴
  chart.axis('x', {
    formatter(val) {
      return val + ' gr' // 格式化坐标轴显示文本
    },
    grid: {
      line: {
        stroke: '#d9d9d9',
        lineWidth: 1,
        lineDash: [ 2, 2 ],
      },
    },
  })
  chart.axis('y', {
    titleOffset: 80, // 设置标题距离坐标轴的距离
    formatter(val) {
      if (val > 0) {
        return val + ' gr'
      }
    },
  })
  chart.legend(false)
  chart.tooltip({
    map: {
      title: 'country',
    },
  })
  chart.point().position('x*y').size('z', 40, 10)
    .label('name*country',
      {
        offset: 0, // 文本距离图形的距离
        label: {
          fill: '#000',
          fontWeight: 'bold', // 文本粗细
          shadowBlur: 5, // 文本阴影模糊
          shadowColor: '#fff', // 阴影颜色
        },
      })
    .color('#3182bd')
    .opacity(0.5)
    .shape('circle')
    .tooltip('x*y*z')
  chart.render()
})

// 柱状图
const Chart2 = createG2(chart => {
  const imageMap = {
    John: 'https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png',
    Damon: 'https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png',
    Patrick: 'https://zos.alipayobjects.com/rmsportal/zlkGnEMgOawcyeX.png',
    Mark: 'https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png',
  }
  // 自定义 shape, 支持图片形式的气泡
  const Shape = G2.Shape
  Shape.registShape('interval', 'image-top', {
    drawShape(cfg, container) {
      const points = cfg.points // 点从左下角开始，顺时针方向
      let path = []
      path.push([ 'M', points[0].x, points[0].y ])
      path.push([ 'L', points[1].x, points[1].y ])
      path = this.parsePath(path)
      container.addShape('rect', {
        attrs: {
          x: cfg.x - 50,
          y: path[1][2], // 矩形起始点为左上角
          width: 100,
          height: path[0][2] - cfg.y,
          fill: cfg.color,
          radius: 10,
        },
      })
      return container.addShape('image', {
        attrs: {
          x: cfg.x - 20,
          y: cfg.y - 20,
          width: 40,
          height: 40,
          img: cfg.shape[1],
        },
      })
    },
  })
  chart.col('vote', {
    min: 0,
  })
  chart.legend(false)
  chart.axis('vote', {
    labels: null,
    title: null,
    line: null,
    tickLine: null,
  })
  chart.axis('name', {
    title: null,
  })
  chart.interval().position('name*vote').color('name', [ '#7f8da9', '#fec514', '#db4c3c', '#daf0fd' ])
    .shape('name', function(name) {
      return [ 'image-top', imageMap[name] ] // 根据具体的字段指定 shape
    })
  chart.render()
})

// 柱状赛选
const Chart3 = createG2(chart => {
  chart.col('name', { alias: '城市' })
  chart.intervalDodge().position('月份*月均降雨量').color('name')
  chart.render()
})
const thirdData = [
  { name: 'Tokyo', data: [ 49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4 ] },
  { name: 'New York', data: [ 83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3 ] },
  { name: 'London', data: [ 48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2 ] },
  { name: 'Berlin', data: [ 42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1 ] },
]
for (let i = 0; i < thirdData.length; i++) {
  const item = thirdData[i]
  const datas = item.data
  const months = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.' ]
  for (let j = 0; j < datas.length; j++) {
    item[months[j]] = datas[j]
  }
  thirdData[i] = item
}
const Frame = G2.Frame
let frame = new Frame(thirdData)
frame = Frame.combinColumns(frame, [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.' ], '月均降雨量', '月份', 'name')
class Topology extends React.Component {
  constructor() {
    super()
    this.state = {
      size: 'defalut',
      data,
      forceFit: true,
      width: 500,
      height: 450,
      plotCfg: {
        margin: [ 20, 80, 90, 60 ],
        background: {
          stroke: '#ccc', // 边颜色
          lineWidth: 1, // 边框粗细
        }, // 绘图区域背景设置
      },
      secondData: [
        { name: 'John', vote: 35654 },
        { name: 'Damon', vote: 65456 },
        { name: 'Patrick', vote: 45724 },
        { name: 'Mark', vote: 13654 },
      ],
      thirdData: frame,
      application: null,
      rangeDateTime: null,
    }
  }
  componentWillMount() {
  }
  loadData = () => {
    const { loadScatterData, clusterID, apmID, apps } = this.props
    const { application, rangeDateTime } = this.state
    let serviceTypeName
    apps.every(app => {
      if (app.applicationName === application) {
        serviceTypeName = app.serviceType
        return false
      }
      return true
    })
    const query = {
      application,
      serviceTypeName,
      from: rangeDateTime[0].valueOf(),
      to: rangeDateTime[1].valueOf(),
      xGroupUnit: X_GROUP_UNIT,
      yGroupUnit: Y_GROUP_UNIT,
      limit: PINPOINT_LIMIT,
    }
    loadScatterData(clusterID, apmID, query)
  }
  getPinpointMap = () => {
    const { clusterID, apmID, loadPinpointMap, apps } = this.props
    const { rangeDateTime, application } = this.state
    const date = new Date().getTime()
    let serviceTypeName
    apps.every(app => {
      if (app.applicationName === application) {
        serviceTypeName = app.serviceType
        return false
      }
      return true
    })
    loadPinpointMap(clusterID, apmID, {
      applicationName: application,
      from: Date.parse(rangeDateTime[0]),
      to: Date.parse(rangeDateTime[1]),
      callerRange: 4,
      calleeRange: 4,
      serviceTypeName,
      _: date,
    })
  }
  getData = () => {
    this.getPinpointMap()
    this.loadData()
  }
  handleSizeChange = e => {
    this.setState({ size: e.target.value })
  }
  render() {
    const { size, application, rangeDateTime } = this.state
    const { apps } = this.props
    return (
      <div className="topology">
        <div className="layout-content-btns">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择微服务 （展示其所在链路拓扑）"
            optionFilterProp="children"
            value={application}
            onChange={application => this.setState({ application })}
          >
            {
              apps.map(app => (
                <Option key={app.applicationName}>{app.applicationName}</Option>
              ))
            }
          </Select>
          <Button>
            <i className="fa fa-refresh"/> 刷新
          </Button>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={[ '开始日期', '结束日期' ]}
            value={rangeDateTime}
            onChange={rangeDateTime => this.setState({ rangeDateTime })}
            onOk={this.getData}
          />
          <Radio.Group value={size} onChange={this.handleSizeChange}>
            <Radio.Button value="option"><Icon type="calendar" /> 自定义日期</Radio.Button>
            <Radio.Button value="fiveMin">最近5分钟</Radio.Button>
            <Radio.Button value="threeHour">3小时</Radio.Button>
            <Radio.Button value="today">今天</Radio.Button>
            <Radio.Button value="yesterday">昨天</Radio.Button>
            <Radio.Button value="sevenDay">最近7天</Radio.Button>
          </Radio.Group>
        </div>
        <Row className="topology-body layout-content-body">
          <Col span={14} className="topology-body-relation-schema">
            <RelationSchema data={[]}/>
          </Col>
          <Col span={10} className="topology-body-service-detail">
            <Row className="service-info">
              <Col span={6}>
              image
              </Col>
              <Col span={18}>
                <div className="service-info-name">service-micro#1</div>
                <div className="service-info-app">application-micro#0</div>
                <div className="service-info-status">状态：在线</div>
                <div className="service-info-example">实力数量：2/2</div>
              </Col>
            </Row>
            <div className="service-chart-wrapper">
              <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ lineHeight: '32px' }}>
                  服务实例
                </Col>
                <Col span={18}>
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="选择微服务"
                    optionFilterProp="children"
                    value={application}
                    onChange={application => this.setState({ application })}
                  >
                    {
                      apps.map(app => (
                        <Option key={app.applicationName}>{app.applicationName}</Option>
                      ))
                    }
                  </Select>
                </Col>
              </Row>
              <div>请求相应分布</div>
              <Row style={{ margin: '10px 0' }}>
                <Col span={6} offset={6}>
                  <Checkbox>Success: 0</Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox>Failed: 0</Checkbox>
                </Col>
              </Row>
              <div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  plotCfg={this.state.plotCfg}
                  forceFit={this.state.forceFit}
                />
              </div>
              <div>
                请求时间相应摘要（2 day）：82
              </div>
              <div>
                <Chart2
                  data={this.state.secondData}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit}
                />
              </div>
              <div>
                请求分时段负载（2 day）：82
              </div>
              <div>
                <Chart3
                  data={this.state.thirdData}
                  width={this.state.width}
                  height={this.state.height}
                  plotCfg={this.state.plotCfg}
                  forceFit={this.state.forceFit} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const clusterID = current.cluster.id
  const apms = queryApms[clusterID]
  // @Todo: not support other apm yet
  const apmID = apms.ids[0]
  let apps = []
  if (pinpoint.apps[apmID]) {
    apps = pinpoint.apps[apmID].ids || []
    apps = apps.map(id => entities.ppApps[id])
  }
  return {
    clusterID,
    apmID,
    apps,
    apms,
    pinpoint,
    entities,
  }
}

export default connect(mapStateToProps, {
  loadApms,
  loadPinpointMap,
  loadPPApps,
  loadScatterData,
})(Topology)
