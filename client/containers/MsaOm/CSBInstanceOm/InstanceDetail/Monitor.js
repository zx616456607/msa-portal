/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * instance detail monitor component
 *
 * 2018-2-01
 * @author zhangcz
 */

import React from 'react'
// import propTypes from 'prop-types'
import { Radio } from 'antd'
import './style/Monitor.less'
import CreateG2 from '../../../../components/CreateG2'

const Chart = CreateG2(chart => {
  chart.col('dateTime', {
    alias: '时间',
    type: 'time',
    mask: 'hh:MM:ss',
    tickCount: 20,
    // nice: false,
  })
  chart.tooltip('x*y')
  chart.col('count', {
    alias: '次数',
  })
  // chart.col('monitorType', {
  //   type: 'cat',
  // })
  chart.line()
    .position('dateTime*count')
    // .color('monitorType', [ '#5cb85c', '#f85a5a' ])
    .shape('smooth')
    .size(2)
  chart.legend({
    title: '调用监控趋势',
    position: 'right', // 设置图例的显示位置
  })
  chart.render()
})

class Monitor extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div id="instance-detail-monitor">
        <div className="select-time-radio">
          <Radio.Group>
            <Radio.Button value="large">最近1小时</Radio.Button>
            <Radio.Button value="default">最近6小时</Radio.Button>
            <Radio.Button value="small">最近24小时</Radio.Button>
            <Radio.Button value="7">最近7天</Radio.Button>
            <Radio.Button value="30">最近30天</Radio.Button>
          </Radio.Group>
        </div>
        <div className="monitor-item">
          <Chart
            data={[]}
            width={300}
            height={300}
            forceFit={true}
          />
        </div>
      </div>
    )
  }
}

export default Monitor
