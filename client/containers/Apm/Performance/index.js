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
import { connect } from 'react-redux'
import { loadPPApps, fetchAgentData, loadPinpointMap, fetchJVMGCData, fetchJVMCPUData, fetchJVMTRANData } from '../../../actions/pinpoint'
import { Row, Icon, Button, Layout, Select, DatePicker } from 'antd'
import { formatDate } from '../../../common/utils.js'
import CreateG2Group from '../../../components/CreateG2Group'

const LayoutContent = Layout.Content
const Option = Select.Option
const { RangePicker } = DatePicker
const ButtonGroup = Button.Group
const Frame = G2.Frame

class Performance extends React.Component {
  state = {
    forceFit: true,
    width: 530,
    height: 300,
    isTimerShow: true,
    agentData: [],
    exampleData: [],
    timer: [],
    Timers: [],
    serviceName: '',
    heapData: [],
    gcData: [],
    permData: [],
    cpuData: [],
    tranData: [],
  }

  componentWillMount() {
    const { clusterID, apmID, loadPPApps } = this.props
    loadPPApps(clusterID, apmID)
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
    const { Timers, serviceName } = this.state
    const curTimer = {
      sTimer: Date.parse(Timers[0]),
      eTimer: Date.parse(Timers[1]),
    }
    this.setState({
      timer: curTimer,
    })
    serviceName ? this.handleSelect(serviceName) : ''
  }

  handleSelect = value => {
    const { clusterID, apmID, fetchAgentData, loadPinpointMap } = this.props
    const { Timers } = this.state
    const query = {
      applicationName: value,
      from: Timers.length > 0 ? Timers[0] : '1504610853000',
      to: Timers.length > 0 ? Timers[1] : '1504611153000',
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
          exampleData: Object.keys(res.response.result).length > 0 ? res.response.result[value][0] : [],
          agentData: res.response.result,
          serviceName: value,
        })
      }
      Object.keys(res.response.result).length > 0 ?
        this.loadChartData(res.response.result[value][0].agentId) : null
    })
  }

  handleOnExample = value => {
    const { agentData, serviceName } = this.state
    agentData[serviceName].map(values => {
      if (values.agentId === value) {
        this.setState({
          exampleData: values,
        })
      }
      return null
    })
    this.loadChartData(serviceName)
  }

  loadChartData = value => {
    const { Timers } = this.state
    const { clusterID, apmID, fetchJVMGCData, fetchJVMCPUData, fetchJVMTRANData } = this.props
    const query = {
      agentId: value,
      from: Timers.length > 0 ? Timers[0] : '1504610853000',
      to: Timers.length > 0 ? Timers[1] : '1504611153000',
    }
    fetchJVMGCData(clusterID, apmID, query).then(res => {
      const chartJVM = {
        heapMax: res.response.result.charts.JVM_MEMORY_HEAP_MAX, // Heap Usage
        heapSued: res.response.result.charts.JVM_MEMORY_HEAP_USED,
        permGenMax: res.response.result.charts.JVM_MEMORY_NON_HEAP_MAX, // PermGen Usage
        permGenSued: res.response.result.charts.JVM_MEMORY_NON_HEAP_USED,
      }
      let heapObj = null
      const heapAry = []
      chartJVM.heapMax.points.map((item, index) => {
        heapObj = Object.assign({
          timer: this.dateFtt(item.xVal), // formatDate(Number(item.xVal), 'HH:mm:ss')
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(this.bytesToSize(item.maxYVal)),
          yVal: chartJVM.heapSued.points[index].maxYVal === -1 ? 0 : this.bytesToSize(chartJVM.heapSued.points[index].maxYVal),
        })
        heapAry.push(heapObj)
        return null
      })
      let frame = new Frame(heapAry)
      frame = Frame.combinColumns(frame, [ 'xVal' ], 'count')
      this.setState({
        heapData: frame,
      })
      let permObj = null
      const permAry = []
      chartJVM.permGenMax.points.map((item, index) => {
        permObj = {
          timer: formatDate(Number(item.maxYVal), 'HH:mm:ss'),
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(item.maxYVal),
          yVal: chartJVM.permGenSued.points[index].maxYVal === -1 ? 0 : this.bytesToSize(chartJVM.permGenSued.points[index].maxYVal),
        }
        permAry.push(permObj)
        return null
      })
      let frames = new Frame(permAry)
      frames = Frame.combinColumns(frames, [ 'xVal' ], 'count')
      this.setState({
        gcData: frames,
      })
    })

    fetchJVMCPUData(clusterID, apmID, query).then(res => {
      const chartJVM = {
        system: res.response.result.charts.CPU_LOAD_SYSTEM,
        jvm: res.response.result.charts.CPU_LOAD_JVM,
      }
      let cpuObj = null
      const cpumAry = []
      chartJVM.system.points.map((item, index) => {
        cpuObj = {
          timer: formatDate(Number(item.xVal), 'HH:mm:ss'),
          xVal: item.maxYVal === -1 ? 0 : this.bytesToSize(item.maxYVal),
          yVal: chartJVM.jvm.points[index].maxYVal === -1 ? 0 : this.bytesToSize(chartJVM.jvm.points[index].maxYVal),
        }
        cpumAry.push(cpuObj)
        return null
      })
      let frame = new Frame(cpumAry)
      frame = Frame.combinColumns(frame, [ 'yVal', 'xVal' ], 'value')
      this.setState({
        cpuData: frame,
      })
    })

    fetchJVMTRANData(clusterID, apmID, query).then(res => {
      const chartJVM = {
        unsampled_c: res.response.result.charts.TPS_UNSAMPLED_CONTINUATION,
        unsampled_n: res.response.result.charts.TPS_UNSAMPLED_NEW,
        sampled: res.response.result.charts.TPS_SAMPLED_CONTINUATION,
        total: res.response.result.charts.TPS_TOTAL,
        sampled_n: res.response.result.charts.TPS_SAMPLED_NEW,
      }
      let tranObj = null
      const tranAry = []
      chartJVM.unsampled_c.points.map((item, index) => {
        tranObj = {
          timer: formatDate(Number(item.xVal), 'HH:mm:ss'),
          total: chartJVM.total.points[index].maxYVal === -1 ? 0 : chartJVM.total.points[index].maxYVal,
          unsampledNew: chartJVM.unsampled_n.points[index].maxYVal === -1 ? 0 : chartJVM.unsampled_n.points[index].maxYVal,
          sampledContinuation: chartJVM.sampled.points[index].maxYVal === -1 ? 0 : chartJVM.sampled.points[index].maxYVal,
          sampledNew: chartJVM.sampled_n.points[index].maxYVal === -1 ? 0 : chartJVM.sampled_n.points[index].maxYVal,
        }
        tranAry.push(tranObj)
        return null
      })
      let frame = new Frame(tranAry)
      frame = Frame.combinColumns(frame, [ 'total' ], 'count')
      this.setState({
        tranData: frame,
      })
    })
  }

  bytesToSize = bytes => {
    if (bytes === 0) return '0'
    const k = 1000 // or 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number((bytes / Math.pow(k, i)).toFixed(1))
  }
  dateFtt = value => {
    const d = Date(value)
    return d.toLocaleDateString().replace(/\//g, '-') + ' ' + d.toTimeString().substr(0, 8)
  }

  handleRefresh = () => { }

  render() {
    const { isTimerShow, timer, exampleData, serviceName, heapData } = this.state
    const { apps, serverName } = this.props
    const nodeName = []
    const nodeData = serverName === undefined ? '' : serverName[serviceName]
    nodeData === undefined ? null : nodeData !== undefined ? nodeData.isFetching === false ?
      nodeData.applicationMapData.nodeDataArray.length > 0 ?
        nodeData.applicationMapData.nodeDataArray.map(item => {
          if (item.applicationName === serviceName) {
            if (Object.keys(item.agentHistogram).length !== 0) {
              for (const node in item.agentHistogram) {
                nodeName.push(node)
              }
            }
          }
          return null
        }) : '' : '' : ''

    const Charts = chart => {
      chart.line().position('timer*count')
      chart.setMode('select')
      chart.select('rangeX')
      chart.on('rangeselectstart', () => {
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('timer', {
        title: null,
      })
      chart.source(heapData, {
        time: {
          type: 'timer',
          tickCount: 3,
          mask: 'hh:MM',
        },
      })
      chart.col('count', {
        alias: 'Memory（bytes）',
        formatter: val => {
          return val + 'G'
        },
        release: {
          tickInterval: 3,
        },
      })
      chart.legend(false)
      chart.area().position('timer*yVal').color('type', [ '#43b5d8' ])
      chart.intervalStack().position('timer*count')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts1 = chart => {
      chart.setMode('select')
      chart.select('rangeX')
      chart.axis('timer', {
        title: null,
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.col('value', {
        alias: 'Cpu Usage (%)',
      })
      chart.legend(false)
      chart.area().position('timer*value').color('type')
      chart.line().position('timer*value').color('type').
        size(2)
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts2 = chart => {
      chart.line().position('timer*count').size(2).
        shape('smooth')
      chart.setMode('select')
      chart.select('rangeX')
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('timer', {
        title: null,
      })
      chart.col('count', {
        alias: 'TPS',
      })
      chart.legend(false)
      chart.area().position('timer*count').color('type', [ '#43b5d8' ]).
        size(2).
        shape('smooth')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const Charts3 = chart => {
      chart.line().position('timer*count')
      chart.setMode('select')
      chart.select('rangeX')
      chart.on('rangeselectstart', () => {
      })
      chart.tooltip({
        crosshairs: true,
      })
      chart.axis('timer', {
        title: null,
      })
      chart.col('count', {
        alias: 'Memory（bytes）',
        formatter: val => {
          return val + 'M'
        },
      })
      chart.legend(false)
      chart.area().position('timer*yVal').color('type', [ '#43b5d8' ])
      chart.intervalStack().position('timer*count')
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    }
    const chartAry = [ Charts, Charts1, Charts2, Charts3 ]
    const ChartGroup = CreateG2Group(chartAry, true)
    const [ Chart, Chart1, Chart2, Chart3 ] = ChartGroup

    return (
      <LayoutContent className="content">
        <div className="capability">
          <div className="layout-content-btns">
            <Select placeholder="选择微服务" style={{ width: 150 }} onChange={this.handleSelect}>
              {
                apps.map(app => (
                  <Option key={app.applicationName}>{app.applicationName}</Option>
                ))
              }
            </Select>
            <Button className="" onClick={this.handleRefresh}><Icon type="reload" />刷新</Button>
            <div className="timer">
              <ButtonGroup className="call-link-tracking-date">
                <Button icon="calendar" type="primary" onClick={() => this.handleTimer()}>
                  自定义日期
                </Button>
                {
                  isTimerShow ?
                    <Row>
                      <Button className="btn" >最近5分钟</Button>
                      <Button className="btn" >3小时</Button>
                      <Button className="btn" >今天</Button>
                      <Button className="btn" >昨天</Button>
                      <Button className="btn" >最近7天</Button>
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
              </ButtonGroup>
            </div>
            <Select className="example" value={exampleData.agentId} style={{ width: 120 }} onChange={this.handleOnExample}>
              {
                nodeName ?
                  nodeName.map(value => (
                    <Option key={value}>{value}</Option>
                  )) : ''
              }
            </Select>
          </div>
          <Row className="layout-content-body">
            <div className="section">
              {/* <img src=""/> */}
              <div className="left">
                <span style={{ fontSize: 16 }}>微服务名称 {exampleData.applicationName}</span><br />
                <span>Agent Id： {exampleData.agentId}</span><br />
                <span>hostname： {exampleData.applicationName}</span><br />
                <span>IP： {exampleData.ip}</span><br />
                <span>Service Type： {exampleData.serviceType}</span><br />
                <span>End Status Runing： (last checked: 2017-08-07)</span>
              </div>
              <div className="rigth">
                <span>Agent Version： </span><br />
                <span>PID： {exampleData.pid}</span><br />
                <span>JSM(GC Type)：</span><br />
                <span>Start Time： {exampleData.startTimestamp}</span>
              </div>
            </div>
          </Row>
          <Row>
            <div className="footer">
              <div className="left">
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 1</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart
                  data={this.state.heapData}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 2</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.cpuData}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
              <div className="rigth">
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 3</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart3
                  data={this.state.gcData}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 4</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart2
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
            </div>
          </Row>
        </div>
      </LayoutContent>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const apmID = queryApms[clusterID].ids[0]
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
