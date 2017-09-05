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
import { loadPPApps, fetchAgentData, loadPinpointMap, fetchJVMGCData, fetchJVMCPUData } from '../../../actions/pinpoint'
import { Row, Icon, Button, Layout, Select, DatePicker } from 'antd'
import { formatDate } from '../../../common/utils.js'
import CreateG2Group from '../../../components/CreateG2Group'

const LayoutContent = Layout.Content
const Option = Select.Option
const { RangePicker } = DatePicker
const ButtonGroup = Button.Group
const Frame = G2.Frame

let visib = 'hidden'
const Chart = chart => {
  chart.line().position('time*count').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.on('rangeselectstart', () => {
    visib = 'initial'
  })
  chart.tooltip({
    crosshairs: true,
  })
  chart.axis('time', {
    title: null,
  })
  chart.col('count', {
    alias: 'Memory（bytes）',
    min: 0,
  })
  chart.legend(false)
  chart.area().position('time*waiting').color('type', [ '#43b5d8' ])
  chart.intervalStack().position('time*count')
  chart.render()
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {} // 清空 filters
    chart.repaint()
  })
}
const Chart1 = chart => {
  chart.setMode('select')
  chart.select('rangeX')
  chart.axis('time', {
    title: null,
  })
  chart.tooltip({
    crosshairs: true,
  })
  chart.legend(false)
  chart.area().position('time*count').color('type')
  chart.line().position('time*count').color('type')
  chart.render()
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {} // 清空 filters
    chart.repaint()
  })
}
const Chart2 = chart => {
  chart.line().position('time*waiting').size(2).
    shape('smooth')
  chart.setMode('select')
  chart.select('rangeX')
  chart.tooltip({
    crosshairs: true,
  })
  chart.axis('time', {
    title: null,
  })
  chart.legend(false)
  chart.area().position('time*waiting').color('type', [ '#43b5d8' ]).
    size(2).
    shape('smooth')
  chart.render()
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {} // 清空 filters
    chart.repaint()
  })
}
const chartAry = [ Chart, Chart1, Chart2 ]
const ChartGroup = CreateG2Group(chartAry, true)

class Performance extends React.Component {
  state = {
    data: [],
    forceFit: true,
    width: 530,
    height: 300,
    isTimerShow: true,
    agentData: [],
    exampleData: [],
    timer: [],
    Timers: [],
    serviceName: '',
    chartsData: [],
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
      from: Timers.length > 0 ? Timers[0] : '1504239480000',
      to: Timers.length > 0 ? Timers[1] : '1504241280000',
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
          exampleData: res.response.result[value][0],
          agentData: res.response.result,
          serviceName: value,
        })

      }
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

  /**
   * 加载图形数据
   */

  loadChartData = value => {
    const { Timers } = this.state
    const { clusterID, apmID, fetchJVMGCData } = this.props
    const query = {
      agentId: value,
      from: Timers.length > 0 ? Timers[0] : '1504239480000',
      to: Timers.length > 0 ? Timers[1] : '1504241280000',
    }
    fetchJVMGCData(clusterID, apmID, query).then(res => {
      const chartJVM = {
        heapMax: res.response.result.charts.JVM_MEMORY_HEAP_MAX,
        heapSued: res.response.result.charts.JVM_MEMORY_HEAP_USED,
        permGenMax: res.response.result.charts.JVM_MEMORY_NON_HEAP_MAX,
        permGenSued: res.response.result.charts.JVM_MEMORY_NON_HEAP_USED,
      }
      let obj = null
      const Ary = []
      chartJVM.heapMax.points.map(item => {
        obj = {
          Timer: formatDate(Number(item.xVal), 'HH:mm:ss'),
          Count: item.minYVal === -1 ? 0 : item.minYVal,
        }
        return null
      })
      Ary.push(obj)
      // Ary.push(item.xVal + ',' + item.minYVal)
      let frame = new Frame(Ary)
      frame = Frame.combinColumns(frame, [ 'ACME', 'Compitor' ], 'value')
      this.setState({
        data: frame,
      })
    })
  }

  handleRefresh = () => { }

  render() {
    const { isTimerShow, timer, exampleData, serviceName } = this.state
    const { apps, serverName } = this.props
    const nodeName = []
    const nodeData = serverName === undefined ? '' : serverName[serviceName]
    nodeData === undefined ? null : nodeData !== undefined ? nodeData.isFetching === false ?
      nodeData.applicationMapData.nodeDataArray.map(item => {
        if (item.applicationName === serviceName) {
          if (Object.keys(item.agentHistogram).length !== 0) {
            for (const node in item.agentHistogram) {
              nodeName.push(node)
            }
          }
        }
        return null
      }) : '' : ''

    const [ Chart, Chart1, Chart2 ] = ChartGroup
    return (
      <LayoutContent className="content">
        <div className="capability">
          <div className="layout-content-btns">
            <Select defaultValue="选择微服务" style={{ width: 120 }} onChange={this.handleSelect}>
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
                  <Button className="btn" style={{ visibility: visib }}>重置</Button>
                </div>
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 2</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
              <div className="rigth">
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 3</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart
                  data={this.state.data}
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
})(Performance)
