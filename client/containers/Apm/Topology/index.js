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
import QueueAnim from 'rc-queue-anim'
import './style/topology.less'
import { loadApms } from '../../../actions/apm'
import { loadPinpointMap, loadPPApps, loadScatterData, fetchAgentData } from '../../../actions/pinpoint'
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT, TIMES_WITHOUT_YEAR } from '../../../constants'
import { formatDate } from '../../../common/utils'
import ApmTimePicker from '../../../components/ApmTimePicker'
import createG2 from '../../../components/CreateG2'
import createG6 from '../../../components/CreateG6'
import G6 from '@antv/g6'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'

const G2 = require('g2')
const Option = Select.Option
const images = {
  JAVA: '/img/service/java.png',
  MYSQL: '/img/service/mysql.png',
  TOMCAT: '/img/service/tomcat.png',
  USER: '/img/service/user.png',
}
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
      return formatDate(parseInt(val, 10), TIMES_WITHOUT_YEAR)
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
  chart.point().position('x*y').size('x', 2, 2)
    .color('#3182bd')
    .opacity(0.5)
    .shape('circle')
    .tooltip('x*y')
  chart.render()
  chart.on('rangeselectend', ev => {
    const selectRange = ev.selected.x
    const start = new Date(parseInt(selectRange[0], 10)).toISOString()
    const end = new Date(parseInt(selectRange[1], 10)).toISOString()
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
    item.value = formatDate(parseInt(item.value, 10), TIMES_WITHOUT_YEAR)
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
      return formatDate(parseInt(val, 10), TIMES_WITHOUT_YEAR)
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
      height: 300,
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
    }
  }
  componentDidMount() {
    const { loadPPApps, clusterID, apmID } = this.props
    apmID && loadPPApps(clusterID, apmID)
    Chart4 = createG6(chart => {
      chart.render()
      chart.edge()
        .shape('smooth')
        .style({
          arrow: true,
        })
        .size(2)
      chart.on('click', ev => {
        let key = ''
        const item = ev.item
        if (chart.isNode(item)) {
          key = item._attrs.model.id
          this.getCurrentNode(key)
          chart.setItemActived(item, true)
        } else if (chart.isEdge(item)) {
          key = item._attrs.model.source
          const group = item.getShapeCfg()
          const { source, target } = group
          this.getCurrentNode(key)
          chart.setItemActived(source, true)
          chart.setItemActived(target, true)
        }
        chart.refresh()
      })
      chart.on('itemmouseenter', ev => {
        const item = ev.item
        if (chart.isEdge(item)) {
          chart.update(item, {
            color: '#2db7f5',
          })
          chart.refresh()
        }
      })
      chart.on('itemmouseleave', ev => {
        const item = ev.item
        if (chart.isEdge(item)) {
          chart.update(item, {
            color: '#999',
          })
          chart.refresh()
        }
      })
    })
  }
  loadScatter = () => {
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
          if (parseInt(currentAgent.split(',')[1], 10) !== dotList[i][2]) {
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
            x: parseInt(time + from, 10),
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
    const { histogram, agentHistogram } = currentNode || { histogram: {}, agentHistogram: {} }
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
    const {
      timeSeriesHistogram,
      agentTimeSeriesHistogram,
    } = currentNode || { timeSeriesHistogram: {}, agentTimeSeriesHistogram: {} }
    if (name === 'all') {
      this.getSortData(timeSeriesHistogram)
      return
    }
    this.getSortData(agentTimeSeriesHistogram[name])
  }
  getSortData = arr => {
    const thirdData = []
    arr[0] && arr[0].values.forEach(item => {
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
  getCurrentNode = key => {
    const { nodeDataArray } = this.state
    const currentNode = nodeDataArray.filter(item => item.key === key)
    const {
      totalCount,
      errorCount,
      agentHistogram,
    } = currentNode[0] || { totalCount: 0, errorCount: 0, agentHistogram: {} }
    this.setState({
      totalCount,
      errorCount,
      currentNode: currentNode[0],
      agentList: Object.keys(agentHistogram),
    }, () => {
      const { agentList } = this.state
      if (agentList.length) {
        this.selectAgent('all,0')
      }
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
    const applicationMapData = pinpoint.serviceMap[apmID][application].applicationMapData
    const {
      nodeDataArray,
      linkDataArray,
    } = applicationMapData || { nodeDataArray: [], linkDataArray: [] }
    this.setState({
      nodeDataArray,
      linkDataArray,
    }, () => {
      let key = ''
      for (let i = 0; i < nodeDataArray.length; i++) {
        if (nodeDataArray[i].applicationName === application) {
          key = nodeDataArray[i].key
          break
        }
      }
      this.getCurrentNode(key)
      this.getTopologyData()
    })
  }
  getTopologyData = () => {
    const origin = window.location.origin
    const { nodeDataArray, linkDataArray } = this.state
    const iconArr = [ 'user', 'mysql', 'tomcat', 'java' ]
    let nodes = []
    const edges = []
    nodeDataArray.length && nodeDataArray.forEach(item => {
      const shape = iconArr.includes(item.serviceType.toLowerCase())
        ? `${origin}/img/service/${item.serviceType.toLowerCase()}.png`
        : `${origin}/img/service/java.png`
      nodes.push({
        shape,
        label: item.applicationName,
        size: [ 50, 50 ],
        id: item.key,
        serviceType: item.serviceType,
      })
    })
    linkDataArray.length && linkDataArray.forEach(item => {
      const label = `${item.errorCount}/${item.totalCount}(失败/总共)`
      edges.push({
        shape: 'arrow',
        source: item.from,
        target: item.to,
        label,
      })
    })
    if (!nodes.length && !edges.length) {
      return
    }
    const margin = 10
    const height1 = 600 - 2 * margin
    const width1 = 500 - 2 * margin
    const layout = new G6.Layout.Flow({
      nodes,
      edges,
    })
    nodes = layout.getNodes()
    nodes.forEach(node => {
      const x = node.x * width1 + margin
      const y = node.y * height1 + margin
      node.x = x
      node.y = y
    })
    const topologyData = { nodes, edges }
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
    this.loadScatter()
    this.getPinpointMap()
    this.getAgentListWithStatus()
  }
  getAgentListWithStatus = () => {
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
      const agentListWithStatus = flatten(Object.values(r.response.result), true)
      this.setState({
        agentListWithStatus,
      })
    })
  }
  selectAgent = currentAgent => {
    const { agentListWithStatus } = this.state
    if (currentAgent.split(',')[0] !== 'all') {
      this.setState({
        currentAgentDetail: agentListWithStatus.filter(item => item.agentId === currentAgent.split(',')[0])[0],
      })
    } else {
      this.setState({
        currentAgentDetail: {},
      })
    }
    this.setState({ currentAgent }, () => {
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
    const { currentNode, application } = this.state
    this.setState({
      rangeDateTime,
    }, () => {
      if (rangeDateTime.length && application && currentNode && currentNode.isWas) {
        duplicateC1 && duplicateC1.col('x', {
          min: rangeDateTime[0].valueOf(), // 自定义最大值
          max: rangeDateTime[1].valueOf(), // 自定义最小值
        })
      }
    })
  }
  getAgentStatus = code => {
    return (
      <span className={classNames({ 'success-status': code === 100, 'error-status': code !== 100 })}>
        {code === 100 ? '在线' : ''}
        {code === 200 ? '关闭' : ''}
        {code === 201 ? '意外关闭' : ''}
        {code === 300 ? '断电' : ''}
        {code === -1 ? '未知错误' : ''}
      </span>
    )
  }
  getServiceType = type => {
    switch (type) {
      case 'MYSQL':
        return images.MYSQL
      case 'TOMCAT':
        return images.TOMCAT
      case 'USER':
        return images.USER
      default:
        return images.JAVA
    }
  }
  render() {
    const {
      application,
      rangeDateTime,
      agentList,
      currentAgent,
      topologyData,
      currentAgentDetail,
      currentNode,
      totalCount,
      errorCount,
    } = this.state
    const { apps } = this.props
    return (
      <QueueAnim className="topology">
        <div className="layout-content-btns" key="btns">
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
            <div className="topology-default" key="topology">
              <img alt="topology" src={require('../../../assets/img/apm/topology-default.png')}/>
              <p>请选择微服务</p>
            </div>
            :
            <Row className="topology-body layout-content-body" key="body">
              <Col span={14} className="topology-body-relation-schema">
                {
                  !isEmpty(topologyData) &&
                  <Chart4
                    data={topologyData}
                    // width={800}
                    height={1000}
                    grid={this.state.grid}
                  />
                }
              </Col>
              <Col span={10} className="topology-body-service-detail">
                <Row className="service-info">
                  <Col span={6}>
                    <img
                      className="service-info-type"
                      alt="service-type"
                      src={this.getServiceType(currentNode && currentNode.serviceType)}
                    />
                  </Col>
                  <Col span={18}>
                    <div className="service-info-name">{currentNode && currentNode.applicationName}</div>
                    {
                      !isEmpty(currentAgentDetail) &&
                      <div className="service-info-status">状态：{this.getAgentStatus(currentAgentDetail.status && currentAgentDetail.status.state.code)}</div>
                    }
                    {
                      currentNode && currentNode.isWas &&
                      <div className="service-info-example">实例数量：{agentList.length}</div>
                    }
                  </Col>
                </Row>
                <div className="service-chart-wrapper">
                  {
                    currentNode && currentNode.isWas &&
                    [
                      <Row key="agentSelect" style={{ margin: '10px 0' }}>
                        <Col span={6} style={{ lineHeight: '32px' }}>
                          服务实例
                        </Col>
                        <Col span={18}>
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            value={currentAgent}
                            onChange={app => this.selectAgent(app)}
                          >
                            <Option key="all,0">All</Option>
                            {
                              agentList.map((item, index) => (
                                <Option key={`${item},${index + 1}`}>{item}</Option>
                              ))
                            }
                          </Select>
                        </Col>
                      </Row>,
                      <div key="chart1">
                        <div>请求响应时间分布（2 day）：{totalCount}</div>
                        <Row style={{ margin: '10px 0' }}>
                          <Col span={6} offset={6}>
                            <Checkbox checked={this.state.checkSuccess} onChange={this.checkSuccess}><span className="success-status">Success: {totalCount - errorCount}</span></Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox checked={this.state.checkFailed} onChange={this.checkFailed}><span className="error-status">Failed: {errorCount}</span></Checkbox>
                          </Col>
                        </Row>
                        <Chart1
                          data={this.state.firstData}
                          width={this.state.width}
                          height={this.state.height}
                          plotCfg={this.state.plotCfg}
                          forceFit={this.state.forceFit}
                        />
                      </div>,
                    ]
                  }
                  <div>
                    请求响应时间摘要（2 day）：{totalCount}
                  </div>
                  <Chart2
                    data={this.state.secondData}
                    width={this.state.width}
                    height={this.state.height}
                    forceFit={this.state.forceFit}
                  />
                  <div>
                    请求分时段负载（2 day）：{totalCount}
                  </div>
                  <Chart3
                    data={this.state.thirdData}
                    width={this.state.width}
                    height={this.state.height}
                    plotCfg={this.state.sortPlotCfg}
                    forceFit={this.state.forceFit}
                  />
                </div>
              </Col>
            </Row>
        }
      </QueueAnim>
    )
  }
}


const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const clusterID = current.config.cluster.id
  const namespace = current.config.project.namespace
  const apms = queryApms[namespace][clusterID]
  // @Todo: not support other apm yet
  const apmID = apms.ids && apms.ids[0]
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
