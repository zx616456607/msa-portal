/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * DubboOV.tsx page
 *
 * @author zhangtao
 * @date Friday December 21st 2018
 */
import * as React from 'react'
import { Card, Row, Col } from 'antd'
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
} from 'bizcharts';
import './styles/DubboOV.less'

export default class DubboOV extends React.Component<{}, {}> {
  render() {
    const data = [
      {
        type: '正常',
        value: 1,
      },
      {
        type: '分类二',
        value: 0,
      },
      {
        type: '轻微',
        value: 0,
      },
      {
        type: '重要',
        value: 0,
      },
      {
        type: '严重',
        value: 0,
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
    return(
      <Card title="治理-Dubbo" className="DubboOV">
        <div>
          <div>服务数量</div>
        </div>
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
              <div><div className="color1">仅消费者</div><div>{`${0}个`}</div></div>
              <div><div className="color2">仅提供者</div><div>{`${0}个`}</div></div>
              <div><div className="color3">两者均有</div><div>{`${0}个`}</div></div>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }
}
