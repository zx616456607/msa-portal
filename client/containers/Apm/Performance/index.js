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
import { Row, Icon, Dropdown, Menu, Button, Layout } from 'antd'

const LayoutContent = Layout.Content
const Chart = createG2(chart => {
  chart.line().position('month*temperature').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.render()
})

export default class Performance extends React.Component {
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
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1">第一个菜单项</Menu.Item>
        <Menu.Item key="2">第二个菜单项</Menu.Item>
        <Menu.Item key="3">第三个菜单项</Menu.Item>
      </Menu>
    )
    return (
      <LayoutContent className="Layout-content">
        <div className="capability">
          <div className="header">
            <Dropdown.Button className="server" overlay={menu}>选择微服务</Dropdown.Button>
            <Dropdown.Button className="Example" overlay={menu}>选择具体实例</Dropdown.Button>
            <Button className="ref"><Icon type="reload" /> 刷新</Button>
            <div className="timer">
              <Button className="btn" ><Icon type="calendar" />自定义日期</Button>
              <Button className="btn" >最近5分钟</Button>
              <Button className="btn" >3小时</Button>
              <Button className="btn" >2小时</Button>
            </div>
          </div>
          <Row>
            <div className="section">
              {/* <img src=""/> */}
              <div className="left">
                <span style={{ fontSize: 20 }}>微服务名称 apmserice</span><br />
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
                <div className="titleInfo"><span style={{ color: 'blur', fontSize: 18 }}>Heap Usage</span></div>
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
              </div>
              <div className="rigth">
                <div className="titleInfo"><span style={{ color: 'blur', fontSize: 18 }}>Heap Usage</span></div>
                <Chart
                  data={this.state.data}
                  width={this.state.width}
                  height={this.state.height}
                  forceFit={this.state.forceFit} />
                <Chart
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
