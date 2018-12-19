/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * annularChar.jsx page
 *
 * @author zhangtao
 * @date Tuesday December 18th 2018
 */

import * as React from 'react'
import './styles/AnnularChar.less'
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
} from 'bizcharts';
import { Row, Col } from 'antd'


interface AnnularCharProp {

}

interface AnnularCharState {

}
class AnnularCharInner extends React.Component<AnnularCharProp, AnnularCharState> {
  render() {
    const data = [
      {
        type: "分类一",
        value: 20
      },
      {
        type: "分类二",
        value: 18
      },
      {
        type: "分类三",
        value: 32
      },
      {
        type: "分类四",
        value: 15
      },
      {
        type: "Other",
        value: 15
      }
    ]; // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值

    /*const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

    G2.Shape.registerShape("interval", "sliceShape", {
      draw(cfg, container) {
        const points = cfg.points;
        let path = [];
        path.push(["M", points[0].x, points[0].y]);
        path.push(["L", points[1].x, points[1].y - sliceNumber]);
        path.push(["L", points[2].x, points[2].y - sliceNumber]);
        path.push(["L", points[3].x, points[3].y]);
        path.push("Z");
        path = this.parsePath(path);
        return container.addShape("path", {
          attrs: {
            fill: cfg.color,
            path: path
          }
        });
      }
    }); */

    class SliderChart extends React.Component {
      render() {
        return (
          <Chart height={160} data={data} forceFit padding={"auto"} >
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
      <div className="AnnularCharInner">
        <SliderChart />
        <div className="centerText">共0个</div>
      </div>
    );
  }
}

export default class AnnularChar extends React.Component<any, any> {
  render() {
    return(
      <div className="AnnularChar">
        <div className="head">
          事件数量
        </div>
        <Row>
          <Col span={10}>
            <AnnularCharInner/>
          </Col>
          <Col span={2}></Col>
          <Col span={12}>
            <div className="messageBox">
              <div><div className="color1">严重</div><div>0个</div></div>
              <div><div className="color2">重要</div><div>0个</div></div>
              <div><div className="color3">轻微</div><div>0个</div></div>
              <div><div className="color4">正常</div><div>0个</div></div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}