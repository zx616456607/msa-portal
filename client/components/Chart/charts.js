/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * charts
 *
 * 2017-08-28
 * @author zhaoyb
 */

import React from 'react'
import './style/index.less'
import createG2 from 'g2-react'

let t_chart
const Chart = createG2(chart => {
  t_chart = chart
  chart.line().position('month*temperature').size(2)
  chart.setMode('select')
  chart.select('rangeX')
  chart.on('plotmove', function(ev) {
    const point = {
      x: ev.x,
      y: ev.y,
    }
    t_chart.showTooltip(point)
  })
  chart.render()
})

export default class Charts extends React.Component {
  state = {
    forceFit: true,
    width: 530,
    height: 300,
  }
  compoentWillMount() {
    this.handleData()
  }

  handleData() {
    const { data } = this.props
    if (data) {
      console.log(data)
    }
  }

  render() {
    const { data } = this.props
    return (
      <div className="layout_chart">
        {
          data.map((item, index) => (
            <div className="charts">
              <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}>Heap Usage 1</span>
                <Button className="btn">重置</Button>
              </div>
              <Chart
                key={index}
                data={data}
                width={this.state.width}
                height={this.state.height}
                forceFit={this.state.forceFit} />
            </div>
          ))
        }
      </div>
    )
  }
}
