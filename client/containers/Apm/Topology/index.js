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
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT, TIMES_WITHOUT_YEAR } from '../../../constants'
import { formatDate } from '../../../common/utils'
import createG2 from 'g2-react'
const G2 = require('g2')
import keys from 'lodash/keys'
const Option = Select.Option

// 点图
// 设置鼠标 hove 至气泡的样式
G2.Global.activeShape.point = {
  lineWidth: 2,
  shadowBlur: 12,
  shadowColor: '#3182bd',
}

// 柱状筛选
const Chart3 = createG2(chart => {
  chart.legend({
    position: 'top',
  })
  chart.axis('请求时间', {
    title: null,
  })
  chart.axis('请求数量', {
    // titleOffset: 75,
    formatter(val) {
      return val
    },
    // position: 'right',
  })
  chart.intervalStack().position('State*请求数量').color('请求时间', [ '#98ABC5', '#8A89A6', '#7B6888', '#6B486B', '#A05D56', '#D0743C', '#FF8C00' ])
    .size(9)
  chart.render()
})
class Topology extends React.Component {
  constructor() {
    super()
    this.state = {
      size: 'defalut',
      firstData: [],
      forceFit: true,
      width: 100,
      height: 450,
      plotCfg: {
        margin: [ 20, 80, 90, 80 ],
        background: {
          stroke: '#ccc', // 边颜色
          lineWidth: 1, // 边框粗细
        }, // 绘图区域背景设置
      },
      secondData: [],
      thirdData: [],
      application: null,
      rangeDateTime: [],
      agentList: [],
      currentAgent: 'all,0',
      dotList: [],
      from: null,
      checkSuccess: true,
      checkFailed: true,
      totalCount: 0,
      errorCount: 0,
    }
  }
  componentDidMount() {
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
    loadScatterData(clusterID, apmID, query).then(() => {
      const { pinpoint } = this.props
      const { scatter, from } = pinpoint.queryScatter[apmID][application]
      const { dotList } = scatter
      this.setState({
        dotList,
        from,
      }, () => {
        this.formatScatterData()
      })
    })
  }
  formatScatterData = () => {
    const { dotList, from, currentAgent, checkSuccess, checkFailed } = this.state
    const data = []
    let objFirst
    let objSecond
    let oneSenc = 0
    let threeSenc = 0
    let fiveSenc = 0
    let slow = 0
    let error = 0
    for (let i = 0; i < dotList.length; i++) {
      for (let j = 0; j < dotList[i].length; j++) {
        const time = dotList[i][0]
        const req = dotList[i][1]
        const isError = dotList[i][4]
        if (currentAgent && (currentAgent.split(',')[1] !== '0')) {
          if (parseInt(currentAgent.split(',')[1]) !== dotList[i][2]) {
            continue
          }
        }
        if (!checkFailed && !checkSuccess) {
          continue
        } else {
          if (checkSuccess && !checkFailed && (dotList[i][4] === 0)) {
            continue
          } else if (checkFailed && !checkSuccess && (dotList[i][4] === 1)) {
            continue
          }
        }
        if (j === 1) {
          objFirst = Object.assign({
            x: parseInt(time + from),
            y: req,
          })
        }
        objSecond = Object.assign({
          '1s': req < 1000 && j === 1 && isError ? ++oneSenc : oneSenc || 0,
          '3s': req >= 1000 && req < 3000 && j === 1 && isError ? ++threeSenc : threeSenc || 0,
          '5s': req >= 3000 && req < 5000 && j === 1 && isError ? ++fiveSenc : fiveSenc || 0,
          '10s': req >= 5000 && j === 1 && isError ? ++slow : slow || 0,
          '100s': !isError && j === 4 ? ++error : error || 0,
        })
      }
      data.unshift(objFirst)
    }
    let secondData = []
    for (const i in objSecond) {
      secondData.push({
        reqTime: i,
        countNum: objSecond[i],
      })
    }
    const FrameSecond = G2.Frame
    secondData = new FrameSecond(secondData)
    this.setState({
      firstData: data,
      secondData,
    })
  }
  getAgentList = arr => {
    const { application } = this.state
    const currentNode = arr.filter(item => item.applicationName === application)
    const { agentHistogram, totalCount, errorCount, timeSeriesHistogram } = currentNode[0]
    const thirdData = []
    if (timeSeriesHistogram && timeSeriesHistogram.length) {
      timeSeriesHistogram.forEach(item => {
        const obj = {}
        Object.assign(obj, { key: item.key })
        const data = item.values
        data.forEach(record => {
          Object.assign(obj, { [record[0]]: record[1] })
        })
        thirdData.push(obj)
      })
    }
    const Frame = G2.Frame
    let frame = new Frame(thirdData)
    frame = Frame.combinColumns(frame, [ '1s', '3s', '5s', 'slow', 'error' ], '请求数量', '请求时间')
    this.setState({
      totalCount,
      errorCount,
      agentList: keys(agentHistogram),
      thirdData: frame,
    })
  }
  getPinpointMap = () => {
    const { clusterID, apmID, loadPinpointMap, apps } = this.props
    const { rangeDateTime, application } = this.state
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
    }).then(() => {
      const { pinpoint } = this.props
      const { nodeDataArray } = pinpoint.serviceMap[apmID][application].applicationMapData
      this.getAgentList(nodeDataArray)
    })
  }
  getData = () => {
    this.loadData()
    this.getPinpointMap()
  }
  handleSizeChange = e => {
    this.setState({ size: e.target.value })
  }
  selectAgent = currentAgent => {
    this.setState({ currentAgent }, () => {
      this.formatScatterData()
    })
  }
  checkSuccess = e => {
    this.setState({
      checkSuccess: e.target.checked,
    }, () => {
      this.formatScatterData()
    })
  }
  checkFailed = e => {
    this.setState({
      checkFailed: e.target.checked,
    }, () => {
      this.formatScatterData()
    })
  }
  render() {
    const { size, application, rangeDateTime, agentList, currentAgent } = this.state
    const { apps } = this.props
    const Chart1 = createG2(chart => {
      chart.setMode('select') // 开启框选模式
      chart.select('rangeX') // 设置 X 轴范围的框选
      chart.col('x', {
        alias: ' ',
        nice: false, // 不对最大最小值优化
        // tickInterval: 10000,
        min: rangeDateTime.length && rangeDateTime[0].valueOf(), // 自定义最大值
        max: rangeDateTime.length && rangeDateTime[1].valueOf(), // 自定义最小值
      })
      chart.col('y', {
        alias: ' ',
        nice: false,
        max: 10000,
        tickInterval: 2500,
      })
      chart.axis('x', {
        formatter(val) {
          return formatDate(parseInt(val), TIMES_WITHOUT_YEAR)
        },
        grid: {
          line: {
            stroke: '#e6e6e6',
            lineWidth: 1,
          },
        },
      })
      chart.axis('y', {
        titleOffset: 80, // 设置标题距离坐标轴的距离
        formatter(val) {
          if (val > 0) {
            return val + '(ms)'
          }
        },
      })
      chart.legend(false)
      chart.tooltip({
        map: {
          title: 'y',
        },
      })
      chart.point().position('x*y').size('x', 3, 3)
        .color('#3182bd')
        .opacity(0.5)
        .shape('circle')
        .tooltip('y')
      chart.render()
      // 监听双击事件，这里用于复原图表
      chart.on('plotdblclick', function() {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    })
    // 柱状图
    const colorSet = {
      '1s': '#5bb85d',
      '3s': '#2db7f5',
      '5s': '#8e68fc',
      '10s': '#ffc000',
      '100s': '#f85a5b',
    }
    const Chart2 = createG2(chart => {
      chart.axis('reqTime', {
        formatter(val) {
          return val === '10s' ? 'slow' : (val === '100s' ? 'error' : val)
        },
      })
      chart.axis('countNum', {
        formatter(val) {
          return val
        },
      })
      chart.col('reqTime', {
        alias: ' ',
      })
      chart.col('countNum', {
        alias: ' ',
        max: this.state.totalCount + 10,
      })
      chart.legend(false)
      chart.interval().position('reqTime*countNum').tooltip('countNum')
        .color('reqTime', countNum => colorSet[countNum])
      chart.render()
    })
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
                <div className="service-info-example">实例数量：2/2</div>
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
                    value={currentAgent}
                    onChange={this.selectAgent}
                  >
                    <Option key="all,0">All</Option>
                    {
                      agentList.map((item, index) => (
                        <Option key={`${item},${index + 1}`}>{item}</Option>
                      ))
                    }
                  </Select>
                </Col>
              </Row>
              <div>请求响应时间分布（2 day）：{this.state.totalCount}</div>
              <Row style={{ margin: '10px 0' }}>
                <Col span={6} offset={6}>
                  <Checkbox checked={this.state.checkSuccess} onChange={this.checkSuccess}><span style={{ color: '#4aac47' }}>Success: {this.state.totalCount - this.state.errorCount}</span></Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox checked={this.state.checkFailed} onChange={this.checkFailed}><span style={{ color: '#f76565' }}>Failed: {this.state.errorCount}</span></Checkbox>
                </Col>
              </Row>
              <div>
                <Chart1
                  data={this.state.firstData}
                  width={this.state.width}
                  height={this.state.height}
                  plotCfg={this.state.plotCfg}
                  forceFit={this.state.forceFit}
                />
              </div>
              <div>
                请求响应时间摘要（2 day）：{this.state.totalCount}
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
                请求分时段负载（2 day）：{this.state.totalCount}
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
