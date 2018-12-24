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
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'
import * as DubAction from '../../actions/dubbo'

function mapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  return { clusterID }
}

interface DubboOVProps {
  clusterID: string
  getDubboList: ( clusterID: string, options?: any ) => any
}
interface DubboOVState {
  tatalService: number
  ConsumersService: number
  ProvidersService: number
  CPService: number
}
class DubboOV extends React.Component<DubboOVProps, DubboOVState> {
  state = {
    tatalService: 0,
    ConsumersService: 0,
    ProvidersService: 0,
    CPService: 0,
  }
  async componentDidMount() {
    const dubRes = await this.props.getDubboList(this.props.clusterID)
    const dubboData: any[] = getDeepValue(dubRes, ['response', 'result', 'data', 'items']) || []
    const tatalService = dubboData.length || 0
    const ConsumersService = dubboData.filter((node) => {
      const consumers = getDeepValue(node, ['status', 'consumers'])
      const providers = getDeepValue(node, ['status', 'providers'])
      return consumers && !providers
    }).length
    const ProvidersService = dubboData.filter((node) => {
      const consumers = getDeepValue(node, ['status', 'consumers'])
      const providers = getDeepValue(node, ['status', 'providers'])
      return !consumers && providers
    }).length
    const CPService = dubboData.filter((node) => {
      const consumers = getDeepValue(node, ['status', 'consumers'])
      const providers = getDeepValue(node, ['status', 'providers'])
      return consumers && providers
    }).length
    this.setState({
      tatalService, ConsumersService, ProvidersService, CPService,
    })
  }
  render() {
    const data = [
      {
        type: '仅消费者',
        value: this.state.ConsumersService,
      },
      {
        type: '分类二',
        value: 0,
      },
      {
        type: '两者都有',
        value: this.state.CPService,
      },
      {
        type: '仅提供者',
        value: this.state.ProvidersService,
      },
      {
        type: '仅消费者',
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
          <div className="centerText">{`共${this.state.tatalService}个`}</div>
          </div>
          </Col>
          <Col span={2}/>
          <Col span={11}>
          <div className="messageBox">
              <div><div className="color4">仅消费者</div><div>{`${this.state.ConsumersService}个`}</div></div>
              <div><div className="color2">仅提供者</div><div>{`${this.state.ProvidersService}个`}</div></div>
              <div><div className="color3">两者均有</div><div>{`${this.state.CPService}个`}</div></div>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default connect(mapStateToProps, {
  getDubboList : DubAction.getDubboList,
})(DubboOV)
