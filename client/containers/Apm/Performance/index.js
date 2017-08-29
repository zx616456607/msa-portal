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
import { setCurrent } from '../../../actions'
import { Row, Icon, Button, Layout, Select, DatePicker } from 'antd'

const LayoutContent = Layout.Content
const Option = Select.Option
const { RangePicker } = DatePicker

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
  }
  componentWillMount() {

  }
  /**
   * 自定义日期
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

  render() {
    const { isTimerShow } = this.state
    return (
      <LayoutContent className="content">
        <div className="capability">
          <div className="header">
            <Select className="server" defaultValue="选择微服务" style={{ width: 120 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
            <Button className="ref"><Icon type="reload" />刷新</Button>
            <div className="timer">
              <Button className="btn" onClick={() => this.handleTimer()} ><Icon type="calendar" />自定义日期</Button>
              {
                isTimerShow ?
                  <div>
                    <Button className="btn" >最近5分钟</Button>
                    <Button className="btn" >3小时</Button>
                    <Button className="btn" >2小时</Button>
                  </div> :
                  <RangePicker className="picker" />
              }
            </div>
            <Select className="example" defaultValue="选择具体实例" style={{ width: 120 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </div>
          <Row>
            <div className="section">
              {/* <img src=""/> */}
              <div className="left">
                <span style={{ fontSize: 16 }}>微服务名称 apmserice</span><br />
                <span>Agent Id 172.18.45.82</span><br />
                <span>hostname apmservice-2601823123</span><br />
                <span>IP　172.18.45.82</span><br />
                <span>Service Type TOMCAT (Apache Tomcat)</span><br />
                <span>End Status Runing (last checked: 2017-08-07)</span>
              </div>
              <div className="rigth">
                <span>Agent Version 1.60</span><br />
                <span>PID 1</span><br />
                <span>JSM(GC Type)1.7.0_111</span><br />
                <span>Start Time 2017-08-07</span>
              </div>
            </div>
          </Row>
          <Row>
            <div className="footer">
              <div className="left">
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 18 }}>Heap Usage 1</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 18 }}>Heap Usage 2</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
              <div className="rigth">
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 18 }}>Heap Usage 3</span>
                  <Button className="btn">重置</Button>
                </div>
                <Chart1
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 18 }}>Heap Usage 4</span>
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

const mapStateToProps = state => ({
  errorMessage: state.errorMessage,
  auth: state.entities.auth,
  current: state.current || {},
})

export default connect(mapStateToProps, {
  setCurrent,
})(Performance)
