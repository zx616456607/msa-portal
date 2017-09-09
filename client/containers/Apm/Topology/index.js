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
import { Button, Row, Col, Checkbox, Select, message } from 'antd'
import '../style/topology.less'
import { loadApms } from '../../../actions/apm'
import { loadPinpointMap, loadPPApps, loadScatterData, fetchAgentData } from '../../../actions/pinpoint'
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT, TIMES_WITHOUT_YEAR } from '../../../constants'
import { formatDate } from '../../../common/utils'
import ApmTimePicker from '../../../components/ApmTimePicker'
import createG2 from '../../../components/CreateG2'
import createG6 from '../../../components/CreateG6'
const G2 = require('g2')
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'
const Option = Select.Option

// 设置鼠标 hove 至气泡的样式
G2.Global.activeShape.point = {
  lineWidth: 2,
  shadowBlur: 12,
  shadowColor: '#3182bd',
}

// 点图
let duplicateC1
let appName = ''
const Chart1 = createG2(chart => {
  duplicateC1 = chart
  chart.setMode('select') // 开启框选模式
  chart.select('rangeX') // 设置 X 轴范围的框选
  chart.col('x', {
    alias: '请求时刻',
    nice: false, // 不对最大最小值优化
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
    window.open(`${window.location.origin}/apms/call-link-tracking?application=${appName}&from=${start}&to=${end}`)
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
  chart.on('tooltipchange', function(ev) {
    const item = ev.items[0] // 获取tooltip要显示的内容
    item.name = '请求时刻'
    item.value = formatDate(parseInt(item.value), TIMES_WITHOUT_YEAR)
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
  chart.intervalStack().position('time*请求数量')
    .color('请求时间', [ '#5db75d', '#2db7f6', '#8d67fb', '#ffc000', '#f85a5b' ])
    .size(9)
  chart.render()
})
let Chart4
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
      grid: null,
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
      topologyData: {},
      isNode: true,
    }
  }
  componentDidMount() {
    const { application } = this.state
    Chart4 = createG6(chart => {
      chart.render()
      chart.on('click', ev => {
        if (ev.itemType !== 'node') {
          return
        }
        const app = ev.item._attrs.model.label
        if (app !== application) {
          this.setState({
            isNode: false,
          })
        }
        this.getCurrentNode(app)
      })
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
    this.getSortData(agentTimeSeriesHistogram[name])
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
  getCurrentNode = app => {
    const { nodeDataArray } = this.state
    const currentNode = nodeDataArray.filter(item => item.applicationName === app)
    const { totalCount, errorCount } = currentNode[0]
    this.setState({
      totalCount,
      errorCount,
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
      this.getNodeAndLinkData()
    })
  }
  getNodeAndLinkData = () => {
    const { apmID, pinpoint } = this.props
    const { application } = this.state
    const { nodeDataArray, linkDataArray } = pinpoint.serviceMap[apmID][application].applicationMapData || { nodeDataArray: [], linkDataArray: [] }
    this.setState({
      nodeDataArray,
      linkDataArray,
    }, () => {
      this.getCurrentNode(application)
      this.getTopologyData()
    })
  }
  getTopologyData = () => {
    const { nodeDataArray, linkDataArray } = this.state
    const node = []
    const edge = []
    console.log(nodeDataArray, linkDataArray)
    nodeDataArray.length && nodeDataArray.forEach(item => {
      node.push({
        shape: 'rect',
        label: item.applicationName,
        size: [ 100, 80 ],
        id: item.key,
      })
    })
    linkDataArray.length && linkDataArray.forEach(item => {
      edge.push({
        shape: 'arrow',
        source: item.from,
        target: item.to,
        label: item.totalCount,
      })
    })
    console.log(node, edge)
    const topologyData = { nodes: node, edges: edge }
    this.setState({
      topologyData,
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
    this.getAgentList()
  }
  getAgentList = () => {
    const { fetchAgentData, apmID, clusterID } = this.props
    const { application, rangeDateTime } = this.state
    fetchAgentData(clusterID, apmID, {
      application,
      from: rangeDateTime[0].valueOf(),
      to: rangeDateTime[1].valueOf(),
    }).then(r => {
      if (r.error) {
        return
      }
      const agentList = flatten(Object.values(r.response.result), true)
      this.setState({
        agentList,
        currentAgentDetail: agentList[0],
      })
    })
  }
  selectAgent = currentAgent => {
    const { agentList } = this.state
    this.setState({ currentAgent,
      currentAgentDetail: agentList.filter(item => item.agentId === currentAgent.split(',')[0]),
    }, () => {
      this.formatScatterData()
      this.getSecondChart(currentAgent.split(',')[0])
      this.getSortGroupChart(currentAgent.split(',')[0])
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
    appName = application
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
      if (rangeDateTime.length && this.state.application) {
        duplicateC1 && duplicateC1.col('x', {
          min: rangeDateTime[0].valueOf(), // 自定义最大值
          max: rangeDateTime[1].valueOf(), // 自定义最小值
        })
      }
    })
  }
  getAgentStatus = code => {
    return <span className={classNames({ 'success-status': code === 100, 'error-status': code !== 100 })}>{code === 100 ? '在线' : '离线'}</span>
  }
  render() {
    const { application, rangeDateTime, agentList, currentAgent, topologyData, currentAgentDetail } = this.state
    const { apps } = this.props
    return (
      <div className="topology">
        <div className="layout-content-btns">
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="选择微服务"
            optionFilterProp="children"
            value={application}
            onChange={application => this.getCurrentApp(application)}
          >
            {
              apps.map(app => (
                <Option key={app.applicationName}>{app.applicationName}</Option>
              ))
            }
          </Select>
          <Button icon="reload" onClick={this.getData}>
            刷新
          </Button>
          <ApmTimePicker
            onOk={this.getData}
            onChange={this.getTimeRange}
            value={rangeDateTime}
          />
        </div>
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
                  !isEmpty(topologyData) &&
                  <Chart4
                    data={topologyData}
                    width={900}
                    height={this.state.height}
                    grid={this.state.grid}
                  />
                }
              </Col>
              <Col span={10} className="topology-body-service-detail">
                <Row className="service-info">
                  <Col span={6}>
                    image
                  </Col>
                  <Col span={18}>
                    <div className="service-info-name">{currentAgentDetail && currentAgentDetail.agentId}</div>
                    <div className="service-info-app">所属应用：{currentAgentDetail && currentAgentDetail.applicationName}</div>
                    <div className="service-info-status">状态：{this.getAgentStatus(currentAgentDetail && currentAgentDetail.status && currentAgentDetail.status.state.code)}</div>
                    <div className="service-info-example">实例数量：{`1 / ${agentList.length}`}</div>
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
                        optionFilterProp="children"
                        value={currentAgent}
                        onChange={this.selectAgent}
                      >
                        <Option key="all,0">All</Option>
                        {
                          agentList.map((item, index) => (
                            <Option key={`${item.agentId},${index + 1}`}>{item.agentId}</Option>
                          ))
                        }
                      </Select>
                    </Col>
                  </Row>
                  <div>请求响应时间分布（2 day）：{this.state.totalCount}</div>
                  <Row style={{ margin: '10px 0' }}>
                    <Col span={6} offset={6}>
                      <Checkbox checked={this.state.checkSuccess} onChange={this.checkSuccess}><span className="success-status">Success: {this.state.totalCount - this.state.errorCount}</span></Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox checked={this.state.checkFailed} onChange={this.checkFailed}><span className="error-status">Failed: {this.state.errorCount}</span></Checkbox>
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
            </Row>
        }
      </div>
    )
  }
}


const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const clusterID = current.config.cluster.id
  const namespace = current.config.project.namespace
  const apms = queryApms[namespace][clusterID]
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
  fetchAgentData,
})(Topology)
