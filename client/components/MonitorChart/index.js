/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Monitor chart
 *
 * @author zhangxuan
 * @date 2018-06-21
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts'
import { DataSet } from '@antv/data-set'

export default class MonitorChart extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    formatterValue: PropTypes.func,
    formatterTooltip: PropTypes.func,
    loading: PropTypes.bool,
  }

  defaultTooltip = (x, y, z) => {
    return {
      title: x,
      name: z,
      value: y,
    }
  }

  render() {
    const { data, formatterValue, formatterTooltip, loading } = this.props
    const ds = new DataSet()
    const dv = ds.createView().source(data)
    const cols = {
      timestamp: {
        range: [ 0, 0.96 ], // 时间轴最后一个时间显示不全
        tickCount: 5, // 时间轴显示个数
      },
      value: {
        min: 0,
      },
    }

    return (
      <Spin spinning={loading}>
        <Chart height={300} data={dv} scale={cols} forceFit>
          <Legend position="top" offsetY={10}/>
          <Axis name="timestamp"/>
          <Axis name="value" label={{ formatter: formatterValue || (val => val) }}/>
          <Tooltip crosshairs={{ type: 'y' }}/>
          <Geom type="line" position="timestamp*value" size={2} color={'container_name'}
            tooltip={[ 'timestamp*value*container_name', formatterTooltip || this.defaultTooltip ]}
          />
          <Geom
            type="point"
            position="timestamp*value"
            size={4} shape={'circle'}
            color={'container_name'}
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      </Spin>
    )
  }
}
