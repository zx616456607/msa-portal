/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Performance
 *
 * 2017-08-24
 * @author zhaoyb
 */

import React from 'react'
import './style/index.less'
import G2 from 'g2'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import {
  loadPPApps,
  fetchAgentData,
  loadPinpointMap,
  fetchJVMGCData,
  fetchJVMCPUData,
  fetchJVMTRANData,
} from '../../../actions/pinpoint'
import { Row, Icon, Button, Select, DatePicker, Radio } from 'antd'
import CreateG2Group from '../../../components/CreateG2/Group'
import performance from '../../../assets/img/apm/performance.png'
import { formatDate } from '../../../common/utils'

const Option = Select.Option
const { RangePicker } = DatePicker
const ButtonGroup = Button.Group
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Frame = G2.Frame
const images = [
  '/img/service/java.png',
  '/img/service/mysql.png',
  '/img/service/tomcat.png',
]

class Performance extends React.Component {
  state = {
    forceFit: true,
    width: 530,
    height: 300,
    isTimerShow: true,
    agentData: [],
    exampleData: [],
    timer: [],
    timers: {},
    serviceName: '',
    heapData: [],
    gcData: [],
    permData: [],
    cpuData: [],
    tranData: [],
    isRowData: false,
    sTimer: '',
    customTimer: '',
    nodeName: [],
  }

  componentDidMount() {
    const { clusterID, apmID, loadPPApps } = this.props
    apmID && loadPPApps(clusterID, apmID)
    this.setState({
      sTimer: Date.parse(new Date()),
      customTimer: Date.parse(new Date(new Date() - 300 * 1000)),
    })
  }

  /**
   * 切换日期
   */
  handleTimer = () => {
    const { isTimerShow } = this.state
    if (isTimerShow) {
      this.setState({
        isTimerShow: false,
      })
    } else {
      this.setState({
        isTimerShow: true,
      })
    }
  }

  /**
   * 已定义日期
   */
  handleCustomTimer = () => {
    const { timer, serviceName } = this.state
    if (serviceName !== null) {
      const curTimer = {
        sTimer: Date.parse(timer[0]),
        eTimer: Date.parse(timer[1]),
      }
      this.setState({
        timers: curTimer,
      })
      serviceName && this.handleSelect(serviceName)
    }
  }

  handleSelect = value => {
    const { clusterID, apmID, fetchAgentData, loadPinpointMap } = this.props
    const { timers, customTimer, sTimer } = this.state
    const query = {
      applicationName: value,
      from: Object.keys(timers).length > 0 ? timers.sTimer : customTimer,
      to: Object.keys(timers).length > 0 ? timers.eTimer : sTimer,
      calleeRange: 4,
      callerRange: 4,
      serviceTypeName: 'STAND_ALONE',
    }
    fetchAgentData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      loadPinpointMap(clusterID, apmID, query)
      if (Object.keys(res.response.entities).length === 0) {
        this.setState({
          exampleData: Object.keys(res.response.result).length > 0
            ? res.response.result[value][0]
            : [],
          agentData: res.response.result,
          serviceName: value,
        })
      }
      Object.keys(res.response.result).length > 0 &&
        this.loadChartData(res.response.result[value][0].agentId)
    })
    this.setState({
      isRowData: true,
    })
  }

  handleOnExample = value => {
    const { agentData, serviceName } = this.state
    agentData[serviceName].forEach(values => {
      if (values.agentId === value) {
        this.setState({
          exampleData: values,
        })
      }
    })
    this.loadChartData(serviceName)
  }

  loadChartData = value => {
    const { timers, customTimer, sTimer } = this.state
    const {
      clusterID,
      apmID,
      fetchJVMGCData,
      fetchJVMCPUData,
      fetchJVMTRANData,
    } = this.props
    const from = Object.keys(timers).length > 0 ? timers.sTimer : customTimer
    const query = {
      agentId: value,
      from,
      to: Object.keys(timers).length > 0 ? timers.eTimer : sTimer,
    }
    fetchJVMGCData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      const { JVM_MEMORY_HEAP_MAX, JVM_MEMORY_HEAP_USED,
        JVM_MEMORY_NON_HEAP_MAX, JVM_MEMORY_NON_HEAP_USED } =
        this.sixToSeven(res.response.result).charts || {}

      const chartJVM = {
        heapMax: JVM_MEMORY_HEAP_MAX, // Heap Usage
        heapSued: JVM_MEMORY_HEAP_USED,
        permGenMax: JVM_MEMORY_NON_HEAP_MAX, // PermGen Usage
        permGenSued: JVM_MEMORY_NON_HEAP_USED,
      }
      const heapAry = chartJVM.heapMax && chartJVM.heapMax.points.map((item, index) => (
        {
          time: this.dateFtt(item.xVal),
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(this.bytesToSize(item.maxYVal)),
          yVal: chartJVM.heapSued.points[index].maxYVal === -1
            ? 0
            : this.bytesToSize(chartJVM.heapSued.points[index].maxYVal),
        }
      ))
      let frame = new Frame(heapAry.filter(item => new Date(item.time) > new Date(from)))
      frame = Frame.combinColumns(frame, [ 'xVal' ], 'count')
      this.setState({
        heapData: frame,
      })
      const permAry = chartJVM.permGenMax && chartJVM.permGenMax.points.map((item, index) => (
        {
          time: this.dateFtt(item.xVal),
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(item.maxYVal),
          yVal: chartJVM.permGenSued.points[index].maxYVal === -1
            ? 0
            : this.bytesToSize(chartJVM.permGenSued.points[index].maxYVal),
        }
      ))
      let frames = new Frame(permAry.filter(item => new Date(item.time) > new Date(from)))
      frames = Frame.combinColumns(frames, [ 'xVal' ], 'count')
      this.setState({
        gcData: frames,
      })
    })

    fetchJVMCPUData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      const { CPU_LOAD_SYSTEM, CPU_LOAD_JVM } = this.sixToSeven(res.response.result).charts || {}
      const chartJVM = {
        system: CPU_LOAD_SYSTEM,
        jvm: CPU_LOAD_JVM,
      }
      const cpumAry = chartJVM.system && chartJVM.system.points.map((item, index) => (
        {
          time: this.dateFtt(item.xVal),
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(item.maxYVal),
          yVal: chartJVM.jvm.points[index].maxYVal === -1
            ? 0
            : this.bytesToSize(chartJVM.jvm.points[index].maxYVal),
        }
      ))
      let frame = new Frame(cpumAry.filter(item => new Date(item.time) > new Date(from)))
      frame = Frame.combinColumns(frame, [ 'yVal', 'xVal' ], 'value')
      this.setState({
        cpuData: frame,
      })
    })

    fetchJVMTRANData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      const { TPS_TOTAL, TPS_SAMPLED_NEW, TPS_UNSAMPLED_NEW,
        TPS_SAMPLED_CONTINUATION, TPS_UNSAMPLED_CONTINUATION,
      } = this.sixToSeven(res.response.result).charts || {}
      const chartJVM = {
        unsampled_c: TPS_UNSAMPLED_CONTINUATION,
        unsampled_n: TPS_UNSAMPLED_NEW,
        sampled: TPS_SAMPLED_CONTINUATION,
        total: TPS_TOTAL,
        sampled_n: TPS_SAMPLED_NEW,
      }

      const tranAry = chartJVM.unsampled_c && chartJVM.unsampled_c.points.map((item, index) => (
        {
          time: this.dateFtt(item.xVal),
          total: chartJVM.total.points[index].maxYVal === -1
            ? 0
            : chartJVM.total.points[index].maxYVal,
          unsampledNew: chartJVM.unsampled_n.points[index].maxYVal === -1
            ? 0
            : chartJVM.unsampled_n.points[index].maxYVal,
          sampledContinuation: chartJVM.sampled.points[index].maxYVal === -1
            ? 0
            : chartJVM.sampled.points[index].maxYVal,
          sampledNew: chartJVM.sampled_n.points[index].maxYVal === -1
            ? 0
            : chartJVM.sampled_n.points[index].maxYVal,
        }
      ))
      let frame = new Frame(tranAry.filter(item => new Date(item.time) > new Date(from)))
      frame = Frame.combinColumns(
        frame,
        [ 'total', 'unsampledNew', 'sampledNew', 'sampledContinuation' ],
        'count'
      )
      this.setState({
        tranData: frame,
      })
    })
  }

  sixToSeven = body => {
    if (!this.isSeven(body)) {
      return body
    }
    const x = body.charts.x
    const ys = body.charts.y
    const schemas = body.charts.schema
    const keys = Object.getOwnPropertyNames(schemas)
    const six = { charts: {} }
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      if (key === 'x') {
        continue
      }
      const y = ys[key]
      const schema = schemas[key]
      six.charts[key] = { points: this.convertOneKey(schema, x, y) }
    }
    return six
  }

  convertOneKey = (schema, x, y) => {
    if (y.length === 0) {
      return []
    }
    const metricIndex = {}
    for (let i = 0; i < schema.length; ++i) {
      const key = schema[i]
      metricIndex[key + 'YVal'] = i
    }
    const keys = Object.getOwnPropertyNames(metricIndex)
    const points = []
    for (let i = 0; i < x.length; ++i) {
      points.push(this.convertOnePoint(metricIndex, keys, x[i], y[i]))
    }
    return points
  }

  convertOnePoint = (metricIndex, metricKeys, x, y) => {
    const point = { xVal: x }
    for (let i = 0; i < metricKeys.length; ++i) {
      const key = metricKeys[i]
      const index = metricIndex[key]
      point[key] = y[index]
    }
    return point
  }

  isSeven = body => {
    return body.charts && body.charts.schema
  }

  bytesToSize = bytes => {
    if (bytes === 0) return '0'
    const k = 1000 // or 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number((bytes / Math.pow(k, i)).toFixed(1))
  }
  dateFtt = value => {
    return value
    // const date = new Date(value)
    // const dd = date.toLocaleDateString().replace(/\//g, '/')
    //   + ' '
    //   + date.toTimeString().substr(0, 8)
    // return dd
  }
  handleRefresh = () => {
    const { serverName } = this.state
    serverName && this.handleSelect(serverName)
  }
  serverType = type => {
    switch (type) {
      case 'MYSQL':
        return images[1]
      case 'TOMCAT':
        return images[2]
      default:
        return images[0]
    }
  }
  handleLatelyTimer = timer => {
    const { serviceName } = this.state
    if (serviceName) {
      switch (timer) {
        case 'five':
          this.setState({
            customTimer: Date.parse(new Date(new Date() - 300 * 1000)),
          })
          this.handleSelect(serviceName)
          break
        case 'yesterday':
          this.setState({
            customTimer: Date.parse(new Date(new Date() - 24 * 60 * 60 * 1000)),
          })
          this.handleSelect(serviceName)
          break
        case 'three':
          this.setState({
            customTimer: Date.parse(new Date(new Date() - 180 * 60 * 1000)),
          })
          this.handleSelect(serviceName)
          break
        case 'seven':
          this.setState({
            customTimer: Date.parse(new Date(new Date() - 168 * 60 * 60 * 1000)),
          })
          this.handleSelect(serviceName)
          break
        default:
          this.setState({
            customTimer: Date.parse(new Date(new Date().setHours(0, 0, 0, 0))),
          })
          this.handleSelect(serviceName)
          break
      }
    }
  }

  nodeData = () => {
    const { serviceName } = this.state
    const { serverName } = this.props
    const nodeName = []
    if (serverName !== undefined && serviceName) {
      const nodeData = serverName[serviceName]
      if (nodeData !== undefined) {
        if (nodeData.isFetching === false) {
          if (nodeData.applicationMapData.nodeDataArray.length > 0) {
            nodeData.applicationMapData.nodeDataArray.forEach(item => {
              if (item.applicationName === serviceName) {
                if (Object.keys(item.agentHistogram).length !== 0) {
                  for (const node in item.agentHistogram) {
                    nodeName.push(node)
                  }
                  this.setState({
                    nodeName,
                  })
                }
              }
            })
          }
        }
      }
    }
  }

  render() {
    const {
      isTimerShow,
      timer,
      exampleData,
      agentData,
      heapData,
      cpuData,
      gcData,
      tranData,
      isRowData,
    } = this.state
    const { apps } = this.props
    // this.nodeData()
    const Charts = chart => {
      chart.line().position('time*count')
      chart.forceFit(true)
      chart.setMode('select')
      chart.select('rangeX')
      chart.on('rangeselectstart', () => {
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('time', {
        title: null,
      })
      chart.source(heapData, {
        time: {
          type: 'time',
          tickCount: 7,
          formatter: timeStamp => {
            return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
          },
        },
      })
      chart.col('count', {
        alias: 'Memory (bytes)',
        formatter: val => {
          return val + 'G'
        },
        release: {
          tickInterval: 3,
        },
      })
      chart.col('yVal', {
        alias: 'Used',
        formatter: val => {
          return val + 'M'
        },
      })
      chart.legend(false)
      chart.area().position('time*yVal').color('type', [ '#43b5d8' ])
      chart.intervalStack().position('time*count')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts1 = chart => {
      chart.setMode('select')
      chart.select('rangeX')
      chart.axis('time', {
        title: null,
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.source(cpuData, {
        time: {
          type: 'time',
          tickCount: 7,
          formatter: timeStamp => {
            return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
          },
        },
      })
      chart.col('value', {
        alias: 'Cpu Usage (%)',
      })
      chart.legend(false)
      chart.area().position('time*value').color('type')
      chart.line().position('time*value').color('type')
        .size(2)
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts2 = chart => {
      // chart.line().position('time*count').color('type').
      //   size(2).
      //   shape('smooth')
      chart.setMode('select')
      chart.select('rangeX')
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('time', {
        title: null,
      })
      chart.source(tranData, {
        time: {
          type: 'time',
          tickCount: 7,
          formatter: timeStamp => {
            return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
          },
        },
      })
      chart.col('count', {
        alias: 'TPS',
      })
      chart.legend(false)
      chart.area().position('time*count').color('type', [ '#43b5d8' ])
        .size(2)
        .shape('smooth')
      // chart.line().position('time*unsampledNew')
      // chart.line().position('time*sampledContinuation')
      // chart.line().position('time*sampledNew')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts3 = chart => {
      chart.line().position('time*count')
      chart.setMode('select')
      chart.select('rangeX')
      chart.on('rangeselectstart', () => {
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('time', {
        title: null,
      })
      chart.source(gcData, {
        time: {
          type: 'time',
          tickCount: 7,
          formatter: timeStamp => {
            return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
          },
        },
      })
      chart.col('count', {
        alias: 'Memory (bytes)',
        formatter: val => {
          return val + 'M'
        },
        release: {
          tickInterval: 3,
        },
      })
      chart.col('yVal', {
        alias: 'Used',
        formatter: val => {
          return val + 'M'
        },
      })
      chart.legend(false)
      chart.area().position('time*yVal').color('type', [ '#43b5d8' ])
      chart.intervalStack().position('time*count')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const nodeList = agentData && agentData[exampleData.applicationName] || []
    const chartAry = [ Charts, Charts1, Charts2, Charts3 ]
    const ChartGroup = CreateG2Group(chartAry, true)
    const [ Chart, Chart1, Chart2, Chart3 ] = ChartGroup
    return (
      <QueueAnim className="apm-performance">
        <div className="layout-content-btns" key="btns">
          <Select placeholder="选择微服务" style={{ width: 150 }} onChange={this.handleSelect}>
            {
              apps.map(app => (
                <Option key={app.applicationName}>{app.applicationName}</Option>
              ))
            }
          </Select>
          <Button onClick={this.handleRefresh}><Icon type="reload" />刷新</Button>
          <div className="timer">
            <ButtonGroup className="call-link-tracking-date">
              <Button icon="calendar" type="primary" onClick={() => this.handleTimer()}>
                自定义日期
              </Button>
              {
                isTimerShow ?
                  <Row>
                    <RadioGroup>
                      <RadioButton value="five" className="btn" onClick={() => this.handleLatelyTimer('five')} >最近5分钟</RadioButton>
                      <RadioButton value="three" className="btn" onClick={() => this.handleLatelyTimer('three')}>3小时</RadioButton>
                      <RadioButton value="today" className="btn" onClick={() => this.handleLatelyTimer('today')}>今天</RadioButton>
                      <RadioButton value="yesterday" className="btn" onClick={() => this.handleLatelyTimer('yesterday')}>昨天</RadioButton>
                      <RadioButton value="seven" className="btn" onClick={() => this.handleLatelyTimer('seven')}>最近7天</RadioButton>
                    </RadioGroup>
                  </Row> :
                  <Row>
                    <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      value={timer}
                      onChange={timer => this.setState({ timer })}
                    />
                    <Button icon="search" onClick={() => this.handleCustomTimer()} />
                  </Row>
              }
              <Button className="type-change-btn">自动刷新</Button>
            </ButtonGroup>
          </div>
          <Select className="example" style={{ width: 120 }} onChange={this.handleOnExample}
            defaultValue={nodeList.length > 0 && nodeList[0].agentId || ''}>
            {
              nodeList && nodeList.map(item => {
                return <Option key={item.agentId}>{item.agentId}</Option>
              })
            }
          </Select>
        </div>
        {
          isRowData ?
            <div key="data">
              <Row className="layout-content-body">
                <div className="section">
                  <img className="imgs" alt="service-type"
                    src={this.serverType(agentData.serverType)} />
                  <div className="left">
                    <span style={{ fontSize: 16 }}>
                      微服务名称 {exampleData.applicationName}
                    </span>
                    <br />
                    <span>Agent Id： {exampleData.agentId}</span><br />
                    <span>hostname： {exampleData.applicationName}</span><br />
                    <span>IP： {exampleData.ip}</span><br />
                    <span>Service Type： {exampleData.serviceType}</span><br />
                    <span>End Status Runing： (last checked: )</span>
                  </div>
                  <div className="rigth">
                    <span>Agent Version： {exampleData.vmVersion}</span><br />
                    <span>PID： {exampleData.pid}</span><br />
                    <span>JSM(GC Type)：</span><br />
                    <span>Start Time： {this.dateFtt(exampleData.startTimestamp)}</span>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="footer">
                  <div className="left">
                    <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage</span>
                      {/* <Button className="btn">重置</Button> */}
                    </div>
                    <Chart
                      data={this.state.heapData}
                      width={this.state.width}
                      height={this.state.height}
                      forceFit={this.state.forceFit} />
                    <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>JVM/System Cpu Usage</span>
                      {/* <Button className="btn">重置</Button> */}
                    </div>
                    <Chart1
                      data={this.state.cpuData}
                      width={this.state.width}
                      height={this.state.height}
                      forceFit={this.state.forceFit} />
                  </div>
                  <div className="rigth">
                    <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>PermGen Usage</span>
                      {/* <Button className="btn">重置</Button> */}
                    </div>
                    <Chart3
                      data={this.state.gcData}
                      width={this.state.width}
                      height={this.state.height}
                      forceFit={this.state.forceFit} />
                    <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Transactions Per Second</span>
                      {/* <Button className="btn">重置</Button> */}
                    </div>
                    <Chart2
                      data={this.state.tranData}
                      width={this.state.width}
                      height={this.state.height}
                      forceFit={this.state.forceFit} />
                  </div>
                </div>
              </Row>
            </div> :
            <div key="no-data">
              <img alt="no-data" style={{ marginTop: 7 + '%', marginLeft: 33 + '%' }} src={performance} />
            </div>
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const { project, cluster } = current.config
  const namespace = project.namespace
  const clusterID = cluster.id
  const apms = queryApms[namespace][clusterID]
  const apmID = apms.ids && apms.ids[0]
  let { apps, serviceMap } = pinpoint
  const { ppApps } = entities
  const serverName = serviceMap[apmID]
  const appIDs = apps[apmID] && apps[apmID].ids || []
  apps = appIDs.map(id => ppApps[id])
  return {
    serverName,
    clusterID,
    apmID,
    apps,
  }
}

export default connect(mapStateToProps, {
  loadPPApps,
  fetchAgentData,
  loadPinpointMap,
  fetchJVMGCData,
  fetchJVMCPUData,
  fetchJVMTRANData,
})(Performance)
