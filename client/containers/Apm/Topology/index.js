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
import { Row, Col, Checkbox, Select, message } from 'antd'
import '../style/topology.less'
import RelationSchema from '../../../components/RelationSchema'
import { loadApms } from '../../../actions/apm'
import { loadPinpointMap, loadPPApps, loadScatterData } from '../../../actions/pinpoint'
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT, TIMES_WITHOUT_YEAR } from '../../../constants'
import { formatDate } from '../../../common/utils'
import ApmButtonGroup from '../../../components/ApmButtonGroup'
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


class Topology extends React.Component {
  constructor() {
    super()
    this.state = {
      firstData: [],
      forceFit: true,
      width: 100,
      height: 450,
      plotCfg: {
        margin: [ 20, 80, 90, 100 ],
        background: {
          stroke: '#ccc',
          lineWidth: 1,
        },
      },
      sortPlotCfg: {
        margin: [ 60, 80, 90, 80 ],
        background: '#ccc',
        lineWidth: 1,
      },
      secondData: [],
      thirdData: [],
      application: undefined,
      rangeDateTime: [],
      agentList: [],
      currentAgent: 'all,0',
      dotList: [],
      from: undefined,
      checkSuccess: true,
      checkFailed: true,
      totalCount: 0,
      errorCount: 0,
    }
  }
  componentWillMount() {
    const now = Date.parse(new Date())
    const startTime = now - (5 * 60 * 1000)
    this.setState({
      rangeDateTime: [ startTime, now ],
    })
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
    loadScatterData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
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
  // 散点图数据
  formatScatterData = () => {
    const { dotList, from, currentAgent, checkSuccess, checkFailed } = this.state
    const data = []
    let objFirst
    for (let i = 0; i < dotList.length; i++) {
      for (let j = 0; j < dotList[i].length; j++) {
        const time = dotList[i][0]
        const req = dotList[i][1]
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
      }
      if (objFirst) {
        data.unshift(objFirst)
        objFirst = null
      }
    }
    this.setState({
      firstData: data,
    })
  }
  // 柱状图数据
  getSecondChart = name => {
    const { currentNode } = this.state
    const { histogram, agentHistogram } = currentNode
    const FrameSecond = G2.Frame
    let secondData = []
    let objSecond
    if (name === 'all') {
      objSecond = histogram
    } else {
      objSecond = agentHistogram[name]
    }
    for (const i in objSecond) {
      secondData.push({
        reqTime: i,
        countNum: objSecond[i],
      })
    }
    secondData = new FrameSecond(secondData)
    this.setState({
      secondData,
    })
  }
  // 分类柱状图数据
  getSortGroupChart = name => {
    const { currentNode } = this.state
    const { timeSeriesHistogram, agentTimeSeriesHistogram } = currentNode
    if (name === 'all') {
      this.getSortData(timeSeriesHistogram)
      return
    }
    this.getSortData(agentTimeSeriesHistogram)
  }
  getSortData = arr => {
    const thirdData = []
    arr[0].values.forEach(item => {
      thirdData.push({
        time: item[0],
        '1s': 0,
        '3s': 0,
        '5s': 0,
        Slow: 0,
        Error: 0,
      })
    })
    thirdData.forEach(record => {
      arr.forEach(item => {
        const reqTime = item.key
        const values = item.values
        values.forEach(timeWithCount => {
          if (timeWithCount[0] === record.time) {
            Object.assign(record, { [reqTime]: record[reqTime] + timeWithCount[1] })
          }
        })
      })
    })
    const Frame = G2.Frame
    let frame = new Frame(thirdData)
    frame = Frame.combinColumns(frame, [ '1s', '3s', '5s', 'Slow', 'Error' ], '请求数量', '请求时间')
    this.setState({
      thirdData: frame,
    })
  }
  getAgentList = arr => {
    if (!arr.length) { return }
    const { application } = this.state
    const currentNode = arr.filter(item => item.applicationName === application)
    const { agentHistogram, totalCount, errorCount } = currentNode[0]
    this.setState({
      totalCount,
      errorCount,
      agentList: keys(agentHistogram),
      currentNode: currentNode[0],
    }, () => {
      this.getSecondChart('all')
      this.getSortGroupChart('all')
    })
  }
  getPinpointMap = () => {
    const { clusterID, apmID, loadPinpointMap, apps } = this.props
    const { rangeDateTime, application } = this.state
    let serviceTypeName = ''
    apps.every(app => {
      if (app.applicationName === application) {
        serviceTypeName = app.serviceType
        return false
      }
      return true
    })
    loadPinpointMap(clusterID, apmID, {
      applicationName: application,
      from: rangeDateTime[0].valueOf(),
      to: rangeDateTime[1].valueOf(),
      callerRange: 4,
      calleeRange: 4,
      serviceTypeName,
    }).then(res => {
      if (res.error) {
        return
      }
      const { pinpoint } = this.props
      const { nodeDataArray } = pinpoint.serviceMap[apmID][application].applicationMapData || { nodeDataArray: [] }
      this.getAgentList(nodeDataArray)
    })
  }
  getData = () => {
    const { application, rangeDateTime } = this.state
    if (!application) {
      message.warning('请选择服务')
      return
    }
    if (!rangeDateTime || !rangeDateTime[0]) {
      message.warning('请选择开始跟结束时间')
      return
    }
    this.loadData()
    this.getPinpointMap()
  }
  selectAgent = currentAgent => {
    this.setState({ currentAgent }, () => {
      this.formatScatterData()
      this.getSecondChart(currentAgent.split(',')[0])
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
  getCurrentApp = application => {
    this.setState({
      application,
    }, () => {
      this.getData()
    })
  }
  getTimeRange = rangeDateTime => {
    this.setState({
      rangeDateTime,
    }, () => {
      this.getData()
    })
  }
  render() {
    const { application, rangeDateTime, agentList, currentAgent } = this.state
    const { apmID, pinpoint } = this.props
    const sub = pinpoint.queryScatter[apmID]
    const isEmpty = sub && sub[application] && sub[application].scatter && sub[application].scatter.length
    const Chart1 = createG2(chart => {
      chart.setMode('select') // 开启框选模式
      chart.select('rangeX') // 设置 X 轴范围的框选
      chart.col('x', {
        alias: '请求时刻',
        nice: false, // 不对最大最小值优化
        // tickInterval: 10000,
        min: rangeDateTime.length && rangeDateTime[0].valueOf(), // 自定义最大值
        max: rangeDateTime.length && rangeDateTime[1].valueOf(), // 自定义最小值
      })
      chart.col('y', {
        alias: '响应时间',
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
        title: null,
      })
      chart.point().position('x*y').size('x', 3, 3)
        .color('#3182bd')
        .opacity(0.5)
        .shape('circle')
        .tooltip('x*y')
      chart.render()
      chart.on('rangeselectend', ev => {
        const selectRange = ev.selected.x
        const start = new Date(parseInt(selectRange[0])).toISOString()
        const end = new Date(parseInt(selectRange[1])).toISOString()
        window.open(`${window.location.origin}/apms/call-link-tracking?application=${application}&from=${start}&to=${end}`)
      })
      // 监听双击事件，这里用于复原图表
      chart.on('plotdblclick', function() {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
      chart.on('rangeselectend', () => {
        chart.get('options').filters = {}
        chart.repaint()
      })
    })
    // 柱状图
    const colorSet = {
      '1s': '#5bb85d',
      '3s': '#2db7f5',
      '5s': '#8e68fc',
      Slow: '#ffc000',
      Error: '#f85a5b',
    }
    const Chart2 = createG2(chart => {
      chart.axis('reqTime', {
        formatter(val) {
          return val
        },
      })
      chart.axis('countNum', {
        formatter(val) {
          return val
        },
      })
      chart.col('reqTime', {
        alias: '请求时间',
      })
      chart.col('countNum', {
        alias: '请求数量',
        max: this.state.totalCount + 10,
      })
      chart.legend(false)
      chart.tooltip({
        title: null,
      })
      chart.interval().position('reqTime*countNum').tooltip('reqTime*countNum')
        .color('reqTime', countNum => colorSet[countNum])
      chart.render()
    })
    // 柱状筛选
    const Chart3 = createG2(chart => {
      chart.legend({
        position: 'top',
      })
      chart.axis('time', {
        title: null,
        formatter(val) {
          return formatDate(parseInt(val), TIMES_WITHOUT_YEAR)
        },
      })
      chart.col('请求数量', {
        alias: ' ',
      })
      chart.col('time', {
        alias: ' ',
      })
      chart.tooltip({
        title: null,
      })
      chart.intervalStack().position('time*请求数量').color('请求时间', [ '#5db75d', '#2db7f6', '#8d67fb', '#ffc000', '#f85a5b' ])
        .size(9)
      chart.render()
    })
    return (
      <div className="topology">
        <ApmButtonGroup
          getCurrentApp={this.getCurrentApp}
          loadData={this.getData}
          getTimeRange={this.getTimeRange}
          rangeDateTime={rangeDateTime}
          application={application}
        />
        {
          (!application || !rangeDateTime.length)
            ?
            <div className="topology-default">
              <img src={require('../../../assets/img/apm/topology-default.png')}/>
              <p>请选择上述申请和期限</p>
            </div>
            :
            <Row className="topology-body layout-content-body">
              <Col span={14} className="topology-body-relation-schema">
                {
                  isEmpty
                    ?
                    <div className="topology-body-empty">
                      <img src={require('../../../assets/img/apm/topology-empty.png')}/>
                      <p>暂时无数据</p>
                    </div>
                    :
                    <RelationSchema data={[]}/>
                }
              </Col>
              {
                isEmpty ? '' :
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
                          plotCfg={this.state.sortPlotCfg}
                          forceFit={this.state.forceFit} />
                      </div>
                    </div>
                  </Col>
              }
            </Row>
        }
      </div>
    )
  }
}


const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const clusterID = current.config.cluster.id
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
