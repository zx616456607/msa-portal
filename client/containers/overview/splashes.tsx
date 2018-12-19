/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * splashes.tsx page
 *
 * @author zhangtao
 * @date Tuesday December 18th 2018
 */

import * as React from 'react'
import './styles/SplashesChar.less'
import {
  Chart,
  Geom,
  Axis,
} from "bizcharts";


interface SplashesCharProps {
  ZTLDataTime:ZTLDataTimeIF[]
}

interface ZTLDataTimeIF {
  duration: number
  startTime: number
}

interface SplashesCharState {

}

export default class SplashesChar extends React.Component<SplashesCharProps, SplashesCharState> {
  render() {
    const data = [
      { weight: 10, height: 0, size: 1 },
      { weight: 40, height: 500, size: 3},
      { weight: 30, height: 1000, size: 5},
    ]
    const cols = {
      height: {
        alias: "Daily fat intake",
        // 定义别名
        tickInterval: 500,
        // 自定义刻度间距
        nice: false,
        // // 不对最大最小值优化
        // max: 96,
        // // 自定义最大值
        // min: 62 // 自定义最小是
      }
    }
    return (
      <div className="SplashesCharWrap">
      <div className="head">近五分钟调用</div>
      <div className="weightInfo">耗时</div>
      <div className="heightInfo" >产生时间</div>
      <div className="SplashesChar">
        <Chart height={120} data={data} scale={cols}

        // plotBackground={{
        //   stroke: "#ccc",
        //   // 边颜色
        //   // lineWidth: 1 // 边框粗细
        // }}
        padding={"auto"}
        forceFit
        >
          <Axis name='weight' line={{
            stroke: "#ccc"
          }}/>
          <Axis name='height'
            label={{
              formatter: val => {
                if (parseInt(val) === 0) return  val
                if ( (parseFloat(val) / 500) % 2 === 1 ) return `${val} ms`
                else return `${ parseFloat(val) / 1000} s`
              }
            }}
            line={{
              stroke: "#666"
            }}
          />
          <Geom
            type="point"
            position="weight*height"
            opacity={0.65}
            shape="circle"
            size={[ 'size', [1, 5] ]}
          />
        </Chart>
      </div>
    </div>
    )
  }
}