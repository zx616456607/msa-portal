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
import { formatDate } from '../../common/utils'
import { TIMES_DAY } from '../../constants/index'

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
    // const data = [
    //   { weight: 10, height: 0, size: 1 },
    //   { weight: 40, height: 500, size: 3},
    //   { weight: 30, height: 1000, size: 5},
    // ]
    const data = this.props.ZTLDataTime.map((item) => {
      return {
        weight: formatDate(item.startTime, TIMES_DAY),
        height: item.duration / 1000,
        size: Math.ceil(Math.random()*6 - 3),
      }
    })
    console.log('data', data)
    const cols = {
      height: {
        alias: "Daily fat intake",
        tickCount: 3,
        // 定义别名
        // tickInterval: 500,
        // // 自定义刻度间距
        // nice: false,
        // // 不对最大最小值优化
        // max: 96,
        // // 自定义最大值
        // min: 62 // 自定义最小是
      },
      weight: {
        alias: '开始时间',
        // type: 'timeCat',
        mask: TIMES_DAY,
        tickCount: 5,
      },
    }
    return (
      <div className="SplashesCharWrap">
      <div className="head">近五分钟调用</div>
      <div className="weightInfo">耗时</div>
      <div className="heightInfo" >产生时间</div>
      <div className="SplashesChar">
        <Chart height={160} data={data} scale={cols}
        padding={[ 20, 30, 50, 50]}
        // plotBackground={{
        //   stroke: "#ccc",
        //   // 边颜色
        //   // lineWidth: 1 // 边框粗细
        // }}
        // padding={"auto"}
        // padding={{ bottom: '10px', left: '10px' }}
        forceFit
        >
          <Axis name='weight' line={{
            stroke: "#ccc"
          }}/>
          <Axis name='height'
            label={{
              formatter: val => {
                return `${val} ms`
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
            size={[ 'size', [3, 6] ]}
          />
        </Chart>
      </div>
    </div>
    )
  }
}