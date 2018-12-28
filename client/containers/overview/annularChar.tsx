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
import isEmpty from 'lodash/isEmpty'

interface AnnularCharProp {
  MSResData: any
}

interface AnnularCharState {

}
class AnnularCharInner extends React.Component<AnnularCharProp, AnnularCharState> {
  render() {
    const data = [
      {
        type: '正常',
        value: this.props.MSResData.normalCount || 0,
      },
      {
        type: '无数据',
        value: (isEmpty(this.props.MSResData) ? 1 : 0),
      },
      {
        type: '轻微',
        value: this.props.MSResData.minorCount || 0,
      },
      {
        type: '重要',
        value: this.props.MSResData.majorCount || 0,
      },
      {
        type: '严重',
        value: this.props.MSResData.criticalCount || 0,
      },
    ]; // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
    const MSResData = this.props.MSResData
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
          <Chart height={140} data={data} forceFit padding={'auto'} >
            <Coord type="theta" innerRadius={0.75} />
            { !isEmpty(MSResData) &&
              <Tooltip showTitle={false} />
            }
            <Geom
              type="intervalStack"
              position="value"
              color={[ 'type', type => {
                if (type === '正常') { return '#43b3fb' }
                if (type === '轻微') { return '#2abe84' }
                if (type === '重要') { return '#ffbf00' }
                if (type === '严重') { return '#f7565c' }
                return 'rgb(169,224,250)'
              } ]}
              shape="sliceShape"
            />
          </Chart>
        );
      }
    }
    return (
      <div className="AnnularCharInner">
        <SliderChart />
        <div className="centerText">
        <div>共</div>
        <div>{`${this.props.MSResData.eurekaEventLogCount || 0}个`}</div>
        </div>
      </div>
    );
  }
}

interface AnnularCharProps {
  MSResData: any
}

export default class AnnularChar extends React.Component<AnnularCharProps, any> {
  render() {
    return(
      <div className="AnnularChar">
        <div className="head">
          事件数量
        </div>
        <Row>
          <Col span={11}>
            <AnnularCharInner MSResData={this.props.MSResData || {}}/>
          </Col>
          <Col span={2}/>
          <Col span={11}>
            <div className="messageBox">
              <div><div className="color1">严重</div><div>{`${this.props.MSResData.criticalCount || 0}个`}</div></div>
              <div><div className="color2">重要</div><div>{`${this.props.MSResData.majorCount || 0}个`}</div></div>
              <div><div className="color3">轻微</div><div>{`${this.props.MSResData.minorCount || 0}个`}</div></div>
              <div><div className="color4">正常</div><div>{`${this.props.MSResData.normalCount || 0}个`}</div></div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
