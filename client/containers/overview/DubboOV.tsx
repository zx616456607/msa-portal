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
import { Card, Row, Col, Spin } from 'antd'
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
import * as OVAction from '../../actions/overview'
import { Dubbo as DubboIcon  } from '@tenx-ui/icon'
import '@tenx-ui/icon/assets/index.css'

function mapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  return { clusterID }
}

interface DubboOVProps {
  clusterID: string
  getDubboList: ( clusterID: string, options?: any ) => any
  getDubboInstall: (clusterID: string, options?: any) => any
}
interface DubboOVState {
  tatalService: number
  ConsumersService: number
  ProvidersService: number
  CPService: number
  loading: boolean
  install: boolean
}
class DubboOV extends React.Component<DubboOVProps, DubboOVState> {
  state = {
    tatalService: 0,
    ConsumersService: 0,
    ProvidersService: 0,
    CPService: 0,
    loading: true,
    install: true,
  }
  async componentDidMount() {
    const DubInRes = await  this.props.getDubboInstall(this.props.clusterID)
    const install = getDeepValue(DubInRes, ['response', 'result', 'data', 'dubbo-operator']) || false
    this.setState({ install })
    if (!install) { return }
    const [dubRes] = await Promise.all([
      this.props.getDubboList(this.props.clusterID, { isHandleError: true }),
    ])
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
      tatalService, ConsumersService, ProvidersService, CPService, loading: false,
    })
  }
  render() {
    const noData = this.state.ConsumersService || this.state.CPService || this.state.ProvidersService
    const data = [
      {
        type: '仅消费者',
        value: this.state.ConsumersService,
      },
      {
        type: '无数据',
        value: (noData ? 0 : 1),
      },
      {
        type: '两者均有',
        value: this.state.CPService,
      },
      {
        type: '仅提供者',
        value: this.state.ProvidersService,
      },
      {
        type: '',
        value: 0,
      },
    ]
    class SliderChart extends React.Component {
      render() {
        return (
          <Chart height={140} data={data} forceFit padding={'auto'} >
            <Coord type="theta" innerRadius={0.75} />
            { noData ?
            <Tooltip showTitle={false} /> : null
            }
            <Geom
              type="intervalStack"
              position="value"
              color={[ 'type', type => {
                if (type === '仅消费者') { return '#43b3fb' }
                if (type === '两者均有') { return '#2abe84' }
                if (type === '仅提供者') { return '#ffbf00' }
                return 'rgb(169,224,250)'
              } ]}
              shape="sliceShape"
            />
          </Chart>
        );
      }
    }
    if (!this.state.install) {
      return (
        <div className="DubboOVunInstall">
          <div className="infoWrap">
            <DubboIcon size={35} style={{ color: '#ccc' }}/>
            <div className="info">该项目&集群未开启 Dubbo</div>
          </div>
        </div>
      )
    }
    return(
      <Spin spinning={this.state.loading}>
      <Card title="治理-Dubbo" className="DubboOV">
        <div>
          <div className="title">服务数量</div>
        </div>
        <Row>
          <Col span={11}>
          <div className="SliderChart">
          <SliderChart />
          <div className="centerText">
            <div>共</div>
            <div>{`${this.state.tatalService}个`}</div>
          </div>
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
    </Spin>
    )
  }
}

export default connect(mapStateToProps, {
  getDubboList : DubAction.getDubboList,
  getDubboInstall: OVAction.getDubboInstall,
})(DubboOV)
