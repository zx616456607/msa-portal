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
import { loadPPApps, fetchAgentData, loadPinpointMap } from '../../../actions/pinpoint'
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
  chart.on('plotmove', function(ev) {
    const point = {
      x: ev.x,
      y: ev.y,
    }
    charts.showTooltip(point)
  })
  chart.render()
})
const Chart = createG2(chart => {
  charts = chart
  chart.line().position('month*temperature').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.on('plotmove', function(ev) {
    const point = {
      x: ev.x,
      y: ev.y,
    }
    charts.showTooltip(point)
  })
  chart.render()
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
    isTimerShow: false,
    agentData: [],
    exampleData: [],
    timer: null,
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
  }

  handleSelect = value => {
    const { clusterID, apmID, fetchAgentData } = this.props
    const { timer } = this.state
    const query = {
      application: value,
      from: timer ? timer[0].valueOf() : '1503972480000',
      to: timer ? timer[1].valueOf() : '1504091580000',
    }

    fetchAgentData(clusterID, apmID, query).then(res => {
      if (res.error) {
        return
      }
      this.handleAgent(value)
      loadPinpointMap(clusterID, apmID, query)
      this.setState({
        agentData: res.requery.response.result,
      })
    })
  }

  handleAgent = () => {
    const { sercerMap } = this.props
    const curAgent = []
    if (sercerMap) {
      const serverName = sercerMap.name.applicationMapData.nodeDataArray
      if (serverName) {
        const RowData = serverName.map(item => {
          if (item.applicationName === '' || item.category === 'STAND_ALONE') {
            curAgent.push(item.agentHistogram)
          }
          return RowData
        })
      }
    }
  }

  render() {
    const { isTimerShow, timer, agentData } = this.state
    const { apps } = this.props
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
            <Button className=""><Icon type="reload" />刷新</Button>
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
                        value={ timer }
                        onChange={ timer => this.setState({ timer })}
                      />
                      <Button icon="search" onClick={() => this.handleCustomTimer()}/>
                    </Row>
                }
              </ButtonGroup>
            </div>
            <Select className="example" defaultValue="选择具体实例" style={{ width: 120 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </div>
          <Row className="layout-content-body">
            <div className="section">
              {/* <img src=""/> */}
              <div className="left">
                <span style={{ fontSize: 16 }}>微服务名称{ agentData.applicationName }</span><br />
                <span>Agent Id {agentData.agentId}</span><br />
                <span>hostname apmservice-{agentData.hostName}</span><br />
                <span>IP　{agentData.ip}</span><br />
                <span>Service Type {agentData.serviceType}</span><br />
                <span>End Status Runing (last checked: 2017-08-07)</span>
              </div>
              <div className="rigth">
                <span>Agent Version {agentData.jvmInfo}</span><br />
                <span>PID {agentData.pid}</span><br />
                <span>JSM(GC Type)1.7.0_111</span><br />
                <span>Start Time 2017-08-07</span>
              </div>
            </div>
          </Row>
          <Row>
            <div className="footer">
              <div className="left">
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 1</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 2</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
              <div className="rigth">
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 3</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 4</span>
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
  const { current, queryApms, pinpoint, entities, serviceMap } = state
  const { cluster } = current
  const clusterID = cluster.id
  const apmID = queryApms[clusterID].ids[0]
  let { apps } = pinpoint
  const { ppApps } = entities
  const appIDs = apps[apmID] && apps[apmID].ids || []
  const sercerMap = serviceMap[apmID]
  apps = appIDs.map(id => ppApps[id])
  return {
    sercerMap,
    clusterID,
    apmID,
    apps,
  }
}

export default connect(mapStateToProps, {
  loadPPApps,
  fetchAgentData,
  loadPinpointMap,
})(Performance)
