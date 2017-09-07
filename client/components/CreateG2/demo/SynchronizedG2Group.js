/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Demo: Create synchronized g2 chart group
 *
 * 2017-09-04
 * @author zhangpc
 */

import React from 'react'
import CreateG2Group from '../Group'

const chartsOpreations = []
for (let i = 0; i < 4; i++) {
  chartsOpreations.push(chart => {
    chart.col('month', {
      alias: '月份',
      range: [ 0, 1 ],
    })
    chart.col('temperature', {
      alias: '平均温度(°C)',
    })
    chart.line().position('month*temperature').size(2)
    chart.render()
  })
}
const ChartGroup = CreateG2Group(chartsOpreations, true)

export default class SynchronizedG2Group extends React.Component {
  state = {
    data: [
      { month: 'Jan', temperature: 7.0 },
      { month: 'Feb', temperature: 6.9 },
      { month: 'Mar', temperature: 9.5 },
      { month: 'Apr', temperature: 14.5 },
      { month: 'May', temperature: 18.2 },
      { month: 'Jun', temperature: 21.5 },
      { month: 'Jul', temperature: 25.2 },
      { month: 'Aug', temperature: 26.5 },
      { month: 'Sep', temperature: 23.3 },
      { month: 'Oct', temperature: 18.3 },
      { month: 'Nov', temperature: 13.9 },
      { month: 'Dec', temperature: 9.6 },
    ],
    forceFit: true,
    width: 500,
    height: 450,
  }

  render() {
    return (
      <div>
        {
          ChartGroup.map((Chart, index) => (
            <Chart
              key={`chart-${index}`}
              data={this.state.data}
              width={this.state.width}
              height={this.state.height}
              forceFit={this.state.forceFit} />
          ))
        }
      </div>
    )
  }
}
