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
import { Row, Button } from 'antd'
import './style/index.less'
import createG2 from 'g2-react'

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
    const { chartsData } = this.props
    let charts
    const Chart = createG2(chart => {
      charts = chart
      chart.line().position('Timer*Count').size(2)
      chart.setMode('select')
      chart.select('rangeX')
      chart.on('plotmove', ev => {
        const point = {
          x: ev.x,
          y: ev.y,
        }
        charts.showTooltip(point)
      })
      chart.source(chartsData, {
        Count: {
          alias: '数量（M）',
        },
        Timer: {
          alias: '时间节点',
        },
      })
      chart.render()
      chart.on('plotdblclick', () => {
        chart.get('options').filters = {} // 清空 filters
        chart.repaint()
      })
    })

    return (
      <Row>
        {
          chartsData.map((item, index) => (
            <div className="charts">
              <div className="titleInfo"><span style={{ color: '#2db7f5', fontSize: 16 }}></span>
                <Button className="btn">重置</Button>
              </div>
              <Chart
                key={index}
                data={chartsData}
                width={this.state.width}
                height={this.state.height}
                forceFit={this.state.forceFit} />
            </div>
          ))
        }
      </Row>
    )
  }
}

