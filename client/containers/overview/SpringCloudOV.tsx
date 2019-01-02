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
import { Card, Row, Col, Spin } from 'antd'
import { Circle as CircleIcon  } from '@tenx-ui/icon'
import '@tenx-ui/icon/assets/index.css'
import './styles/SpringCloudOV.less'
import SplashesChar from './splashes'
import AnnularChar from './annularChar'
import * as MsaAction from '../../actions/msa'
import * as GateAction  from '../../actions/gateway'
import * as CCAction from '../../actions/configCenter'
import * as LTKAction from '../../actions/callLinkTrack'
import * as IPAction from '../../actions/indexPage'
import * as msaCAction from '../../actions/msaConfig'
// import * as ELLAction from '../../actions/eventManage'
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'
import isEmpty from 'lodash/isEmpty'
import SCuninstaled from '../../../client/assets/img/overview/SpringCloudunInstaled.svg'

interface SpringCloudOVProps {
  clusterID: string;
  namespace: string
  getMsaList: (clusterID: string, options: any) => any;
  getGatewayRoutes: (clusterID: string, options: any) => any;
  gatewayPagePoliciesList: (clusterID: string, options: any) => any;
  getService: (clusterID: string, query: any, options: any) => any;
  getZipkinTracesList: (clusterID: string, query: any, options: any) => any;
  getMicroservice: (clusterID: string, query: any, options: any) => any;
  getBranchList: (clusterID: string, query: any, options: any) => any;
  fetchSpingCloud: (clusterID: string, project?: string, options?: any) => any;
}

interface SpringCloudOVState {
  automaticNum: number
  manualNum: number
  geteWayOpen: number
  geteWayClose: number
  PoliciesOpen: number
  PoliciesClose: number
  BlLength: number
  ZTLDataTime: ZTLDataTimeIF[]
  MSResData: any
  loading: boolean
  install: boolean
}

interface ZTLDataTimeIF {
  duration: number
  startTime: number
}

function mapStateToPros(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  const namespace = getDeepValue(state, ['current', 'config', 'project', 'namespace'])
  return { clusterID, namespace }
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
    MSResData: {},
    loading: true,
    install: true,
  }
  async componentDidMount() {
    const SCRes = await this.props.fetchSpingCloud(this.props.clusterID)
    const SCResData: any[] = (getDeepValue(SCRes, ['response', 'result', 'data']) || [])
    .find(({ namespace: inamespace }) => { return inamespace === this.props.namespace })
    this.setState({ install: !isEmpty(SCResData) })
    if (isEmpty(SCResData)) { return }
    const query = {
      endTs: new Date().getTime(),
      lookback: 300 * 100,
    }
    const MSstartTime = new Date().getTime() - 7 * 86400000
    const MSendTime = new Date().getTime()
    const [etMsaListRes, GateWayRes, PPLRes, SvcRes, ZTLRes, MSRes ] = await Promise.all([
    this.props.getMsaList(this.props.clusterID, { isHandleError: true }),
    this.props.getGatewayRoutes(this.props.clusterID, { isHandleError: true }),
    this.props.gatewayPagePoliciesList(this.props.clusterID, { isHandleError: true }),
    this.props.getService(this.props.clusterID, {}, { isHandleError: true }),
    this.props.getZipkinTracesList(this.props.clusterID, query, { isHandleError: true }),
    this.props.getMicroservice(this.props.clusterID, { startTime: MSstartTime, endTime: MSendTime },
       { isHandleError: true }),
    ])
    const msaList = getDeepValue(etMsaListRes, ['response', 'entities', 'msaList']) || {}
    const automaticNum = Object.values(msaList)
    .filter(({ type }) => type === 'automatic')
    .length
    const manualNum = Object.values(msaList)
    .filter(({ type }) => type === 'manual')
    .length
    const gateway = getDeepValue(GateWayRes, [ 'response', 'entities', 'gatewayRoutes' ]) || {}
    const geteWayOpen = Object.values(gateway)
    .filter(({ status }) => status)
    .length
    const geteWayClose = Object.values(gateway)
    .filter(({ status }) => !status)
    .length
    const gatewayPolicies = getDeepValue(PPLRes, [ 'response', 'entities', 'gatewayPolicies' ]) || {}
    const PoliciesOpen = Object.values(gatewayPolicies)
    .filter(({ status }) => status)
    .length
    const PoliciesClose = Object.values(gatewayPolicies)
    .filter(({ status }) => !status)
    .length
    const projectUrl = getDeepValue(SvcRes, ['response', 'result', 'data', 'configGitUrl'])
    const BLRes = await this.props.getBranchList(this.props.clusterID,
      { project_url: projectUrl }, { isHandleError: true })
    const BlLength = (getDeepValue(BLRes, ['response', 'result', 'data']) || []).length

    const ZTLData = getDeepValue(ZTLRes, ['response', 'result', 'data']) || []
    const ZTLDataTime = ZTLData.map(({ duration, startTime }) => ({ duration, startTime }))

    const MSResData = getDeepValue(MSRes, ['response', 'result', 'data'])
    this.setState({ automaticNum, manualNum, geteWayOpen, geteWayClose, PoliciesOpen,
      PoliciesClose, BlLength, ZTLDataTime, MSResData, loading: false})
  }
  render() {
    if (!this.state.install) {
      return(
        <div className="SpringCloudOVunInstanled">
          <div className="infoWrap">
            <img src={SCuninstaled} alt="该项目集群下未安装SpringCloud"/>
            <div className="info">该项目&集群未安装SpringCloud</div>
          </div>
        </div>
      )
    }
    return(
      <Spin spinning={this.state.loading}>
      <div className="SpringCloudOV">
      <Card title={'治理-SpringCloud'}>
        <div className="content-one">
          <Row>
            <Col span={6}>
              <div className="dataTip">
                <div className="title"><span>服务数量</span>
                <span>{`${this.state.automaticNum + this.state.manualNum} 个`}</span>
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
                <span>{`${this.state.PoliciesOpen} 个`}</span>
                </div>
                <div><span><CircleIcon className="color3"/>关闭状态</span>
                <span>{`${this.state.PoliciesClose} 个`}</span>
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
              <SplashesChar ZTLDataTime={this.state.ZTLDataTime}/>
            </Col>
            <Col span={12}>
              <AnnularChar  MSResData={this.state.MSResData || {}}/>
            </Col>
          </Row>
        </div>
      </Card>
      </div>
      </Spin>
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
  // eventLogList: ELLAction.eventLogList,
  getMicroservice: IPAction.getMicroservice,
  fetchSpingCloud: msaCAction.fetchSpingCloud,
})(SpringCloudOV)
