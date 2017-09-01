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
import createG2 from 'g2-react'
import { connect } from 'react-redux'
import { loadPPApps, fetchAgentData, loadPinpointMap, fetchJVMGCData, fetchJVMCPUData } from '../../../actions/pinpoint'
import { Row, Icon, Button, Layout, Select, DatePicker } from 'antd'

const LayoutContent = Layout.Content
const Option = Select.Option
const { RangePicker } = DatePicker
const ButtonGroup = Button.Group

let charts
const Chart1 = createG2(chart => {
  charts = chart
  chart.line().position('month*temperature').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.on('plotmove', ev => {
    const point = {
      x: ev.x,
      y: ev.y,
    }
    charts.showTooltip(point)
  })
  chart.render()
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {} // 清空 filters
    chart.repaint()
  })
})
const Chart = createG2(chart => {
  charts = chart
  chart.line().position('month*temperature').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.on('plotmove', ev => {
    const point = {
      x: ev.x,
      y: ev.y,
    }
    charts.showTooltip(point)
  })
  chart.render()
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {} // 清空 filters
    chart.repaint()
  })
})
class Performance extends React.Component {
  state = {
    data: [
      { month: 'Jan', temperature: 7.0 },
      { month: 'Feb', temperature: 6.9 },
      { month: 'Mar', temperature: 9.5 },
      { month: 'Dec', temperature: 9.6 },
    ],
    forceFit: true,
    width: 530,
    height: 300,
    isTimerShow: true,
    agentData: [],
    exampleData: [],
    timer: null,
    serviceName: '',
    exampleName: '',
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
    const { timer } = this.state
    console.log(Date.parse(timer[0]) + ',' + Date.parse(timer[1]))
  }

  handleSelect = value => {
    const { clusterID, apmID, fetchAgentData, loadPinpointMap } = this.props
    const { timer } = this.state
    const query = {
      applicationName: value,
      from: timer ? timer[0].valueOf() : '1504228315797',
      to: timer ? timer[1].valueOf() : '1504232580000',
      calleeRange: 4,
      callerRange: 4,
      serviceTypeName: 'STAND_ALONE',
    }
    fetchAgentData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      loadPinpointMap(clusterID, apmID, query)
      if (res.response.result) {
        this.setState({
          agentData: res.response.result,
          serviceName: value,
        })
        this.setState({
          exampleData: res.response.result[value][0],
          exampleName: res.response.result[value][0].agentId,
        })
      }
    })
  }

  handleOnExample = value => {
    const { agentData, serviceName, timer } = this.state
    const { fetchJVMGCData, clusterID, apmID } = this.props
    agentData[serviceName].map(values => {
      if (values.agentId === value) {
        this.setState({
          exampleData: values,
        })
      }
      return null
    })
    const query = {
      agentId: value,
      from: timer ? timer[0].valueOf() : '1504142280000',
      to: timer ? timer[1].valueOf() : '1504160580000',
    }
    fetchJVMGCData(clusterID, apmID, query).then(res => {
      console.log(res)
    })
  }

  handleExample = () => { }

  render() {
    const { isTimerShow, timer, exampleData, serviceName, exampleName } = this.state
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
            <Button className="" onClick={this.handleOnExample}><Icon type="reload" />刷新</Button>
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
            <Select className="example" defaultValue={`${exampleName}`} style={{ width: 120 }} onChange={this.handleOnExample}>
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
                <span>Agent Id {exampleData.agentId}</span><br />
                <span>hostname apmservice- </span><br />
                <span>IP {exampleData.ip}</span><br />
                <span>Service Type {exampleData.serviceType}</span><br />
                <span>End Status Runing (last checked: 2017-08-07)</span>
              </div>
              <div className="rigth">
                <span>Agent Version </span><br />
                <span>PID {exampleData.pid}</span><br />
                <span>JSM(GC Type)1.7.0_111</span><br />
                <span>Start Time {exampleData.startTimestamp}</span>
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
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleinfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 4</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
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
  const { cluster } = current
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
