/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * MSDTCOV.tsx page
 *
 * @author zhangtao
 * @date Monday December 24th 2018
 */
import * as React from 'react'
import { Card, Row, Col } from 'antd'
import './styles/MSDTCOV.less'
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
} from 'bizcharts'

interface MSDTCOVPros {

}

interface MSDTCOVState {

}

export default class MSDTCOV extends React.Component<MSDTCOVPros, MSDTCOVState> {
  render() {
    const data = [
      {
        type: '成功事务',
        value: 1,
      },
      {
        type: '分类二',
        value: 0,
      },
      {
        type: '两者都有',
        value: 0,
      },
      {
        type: '仅提供者',
        value: 0,
      },
      {
        type: '回滚事务',
        value: 1,
      },
    ]
    class SliderChart extends React.Component {
      render() {
        return (
          <Chart height={160} data={data} forceFit padding={'auto'} >
            <Coord type="theta" innerRadius={0.75} />
            <Tooltip showTitle={false} />
            <Geom
              type="intervalStack"
              position="value"
              color="type"
              shape="sliceShape"
            />
          </Chart>
        );
      }
    }
    return (
      <Card
        className="MSDTCOV"
        title={<div className="title"><span>分布式事务</span><span>{`父事务统计 ${0}`}</span></div>}
      >
        <div className="info">当前事务执行记录</div>
        <Row>
          <Col span={11}>
          <div className="SliderChart">
          <SliderChart />
          <div className="centerText">{`共${0}个`}</div>
          </div>
          </Col>
          <Col span={2}/>
          <Col span={11}>
          <div className="messageBox">
              <div><div className="color4">成功事务</div><div>{`${0}个`}</div></div>
              <div><div className="color1">回滚事务</div><div>{`${0}个`}</div></div>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }
}
