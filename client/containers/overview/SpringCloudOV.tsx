/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * SpringCloudOV.tsx page
 *
 * @author zhangtao
 * @date Monday December 17th 2018
 */
import * as React from 'react'
import { Card, Row, Col } from 'antd'
import { Circle as CircleIcon  } from '@tenx-ui/icon'
import '@tenx-ui/icon/assets/index.css'
import './styles/SpringCloudOV.less'
import SplashesChar from './splashes'
import AnnularChar from './annularChar'
import * as MsaAction from '../../actions/msa'
import * as GateAction  from '../../actions/gateway'
import * as CCAction from '../../actions/configCenter'
import * as LTKAction from '../../actions/callLinkTrack'
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'

interface SpringCloudOVProps {
  clusterID: string;
}

interface SpringCloudOVState {
  automaticNum: number
  manualNum: number
  geteWayOpen: number
  geteWayClose: number
  PoliciesOpen: number
  PoliciesClose: number
  BlLength: number
  ZTLDataTime:ZTLDataTimeIF[]
}

interface ZTLDataTimeIF {
  duration: number
  startTime: number
}

function mapStateToPros(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  return { clusterID }
}

class SpringCloudOV extends React.Component<SpringCloudOVProps, SpringCloudOVState> {
  state = {
    automaticNum: 0,
    manualNum: 0,
    geteWayOpen: 0,
    geteWayClose: 0,
    PoliciesOpen: 0,
    PoliciesClose: 0,
    BlLength: 0,
    ZTLDataTime: [] as ZTLDataTimeIF[],
  }
  async componentDidMount() {
    const query = {
      endTs: new Date().getTime(),
      lookback: 300 * 100000 // TODO:
    }
    const [etMsaListRes, GateWayRes, PPLRes, SvcRes, ZTLRes ] = await Promise.all([
    this.props.getMsaList(this.props.clusterID),
    this.props.getGatewayRoutes(this.props.clusterID),
    this.props.gatewayPagePoliciesList(this.props.clusterID),
    this.props.getService(this.props.clusterID, {}),
    this.props.getZipkinTracesList(this.props.clusterID, query),
    ])
    const msaList = getDeepValue(etMsaListRes, ['response', 'entities', 'msaList'])
    const automaticNum = Object.values(msaList)
    .filter(({ type }) => type === 'automatic')
    .length
    const manualNum = Object.values(msaList)
    .filter(({ type }) => type === 'manual')
    .length
    const gateway = getDeepValue(GateWayRes, [ 'response', 'entities', 'gatewayRoutes' ])
    const geteWayOpen = Object.values(gateway)
    .filter(({ status }) => status)
    .length
    const geteWayClose = Object.values(gateway)
    .filter(({ status }) => !status)
    .length
    const gatewayPolicies = getDeepValue(PPLRes, [ 'response', 'entities', 'gatewayPolicies' ])
    const PoliciesOpen = Object.values(gatewayPolicies)
    .filter(({ status }) => status)
    .length
    const PoliciesClose = Object.values(gatewayPolicies)
    .filter(({ status }) => !status)
    .length
    const projectUrl = getDeepValue(SvcRes, ['response', 'result', 'data', 'configGitUrl'])
    const BLRes = await this.props.getBranchList(this.props.clusterID, { project_url:projectUrl })
    const BlLength = (getDeepValue(BLRes, ['response', 'result', 'data']) || []).length

    const ZTLData = getDeepValue(ZTLRes, ['response', 'result', 'data'])
    const ZTLDataTime = ZTLData.map(({ duration, startTime }) => ({ duration, startTime }))
    this.setState({ automaticNum, manualNum, geteWayOpen, geteWayClose, PoliciesOpen,
      PoliciesClose, BlLength, ZTLDataTime })
  }
  render() {
    return(
      <div className="SpringCloudOV">
      <Card title={'治理-SpringCloud'}>
        <div className="content-one">
          <Row>
            <Col span={6}>
              <div className="dataTip">
                <div className="title"><span>服务数量</span>
                <span>{ `${this.state.automaticNum + this.state.manualNum} 个`}</span>
                </div>
                <div><span><CircleIcon className="color1" />手动注册</span>
                <span>{`${this.state.manualNum} 个`}</span>
                </div>
                <div><span><CircleIcon className="color2"/>自动注册</span>
                <span>{`${this.state.automaticNum} 个`}</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="dataTip">
                <div className="title" ><span>路由规则</span>
                <span>{`${this.state.geteWayClose + this.state.geteWayOpen} 个`}</span>
                </div>
                <div><span><CircleIcon className="color2"/>开启状态</span>
                <span>{`${this.state.geteWayOpen} 个`}</span>
                </div>
                <div><span><CircleIcon className="color3"/>关闭状态</span>
                <span>{`${this.state.geteWayClose} 个`}</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="dataTip">
                <div className="title" ><span>限流规则</span>
                  <span>{`${this.state.PoliciesClose + this.state.PoliciesOpen } 个`}</span>
                </div>
                <div><span><CircleIcon className="color2"/>开启状态</span>
                <span>{ `${this.state.PoliciesOpen} 个` }</span>
                </div>
                <div><span><CircleIcon className="color3"/>关闭状态</span>
                <span>{ `${this.state.PoliciesClose} 个` }</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="dataTip noBorder">
                <div className="title" ><span>配置中心</span></div>
                <div><span><CircleIcon className="color4"/>分支数量</span>
                <span>{`${this.state.BlLength} 个`}</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="content-two">
        <Row>
            <Col span={12}>
              <SplashesChar ZTLDataTime={this.state.ZTLDataTime} />
            </Col>
            <Col span={12}>
              <AnnularChar/>
            </Col>
          </Row>
        </div>
      </Card>
      </div>
    )
  }
}

export default connect(mapStateToPros, {
  getMsaList: MsaAction.getMsaList,
  getGatewayRoutes: GateAction.getGatewayRoutes,
  gatewayPagePoliciesList: GateAction.gatewayPagePoliciesList,
  getBranchList: CCAction.getBranchList,
  getService: CCAction.getService,
  getZipkinTracesList: LTKAction.getZipkinTracesList,
})(SpringCloudOV)