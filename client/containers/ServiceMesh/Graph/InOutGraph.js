/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * inOutGraph.js page
 *
 * @author zhangtao
 * @date Monday August 6th 2018
 */
import React from 'react'
import { Chart, Axis, Geom, Tooltip, Coord, Legend } from 'bizcharts'
import { DataSet } from '@antv/data-set'
import './styles/InOutGraph.less'
export default class InOutGraph extends React.Component {
  render() {
    const data = [
      { State: 'In', OK: 100, '3xx': 0, '4xx': 0, '5xx': 0 },
      { State: 'Out', OK: 90, '3xx': 0, '4xx': 0, '5xx': 10 },
    ]
    const ds = new DataSet()
    const dv = ds.createView().source(data)
    dv.transform({
      type: 'fold',
      fields: [ 'OK', '3xx', '4xx', '5xx' ], // 展开字段集
      key: '状态', // key字段
      value: '状态数', // value字段
      retains: [ 'State' ], // 保留字段集，默认为除fields以外的所有字段
    })
    return (
      <div className="InOutGraph">
        <div>状态码</div>
        <Chart height={150} data={dv} forceFit padding={[ 10, 30, 70, 40 ]}>
          <Legend />
          <Coord transpose />
          <Axis name="State" label={{ offset: 12 }} />
          <Tooltip />
          <Geom type="intervalStack" position="State*状态数" color={[ '状态', [ '#4ca12d', '#65abf6', '#f1b335', '#ee5754' ]]} />
        </Chart>
        <span className="tip">%</span>
      </div>
    )
  }
}
