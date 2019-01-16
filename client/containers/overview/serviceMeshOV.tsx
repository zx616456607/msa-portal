/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * serviceOV.jsx page
 *
 * @author zhangtao
 * @date Friday December 21st 2018
 */
import * as React from 'react'
import { Card, Row, Col, Spin } from 'antd'
import './styles/ServiceMeshOV.less'
import * as MGWAction from '../../actions/meshGateway'
import * as SMAction from '../../actions/serviceMesh'
import * as MRMAction from '../../actions/meshRouteManagement'
import * as MeshAction from '../../actions/serviceMesh'
// import * as ELLAction from '../../actions/eventManage'
import { connect } from 'react-redux'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'
import isEmpty from 'lodash/isEmpty'
import { Mesh as MeshIcon  } from '@tenx-ui/icon'
import '@tenx-ui/icon/assets/index.css'

function mapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  const projectName = getDeepValue(state, ['current', 'config', 'project', 'namespace'])
  return { clusterID, projectName }
}

interface ServiceMeshOVProps {
  clusterID: string,
  projectName: string
  getMeshGateway: (clusterId: string, options: any) => any
  loadComponent: (clusteriD: string, projectName: string, options: any) => any,
  loadVirtualServiceList: (query: any, options: any) => any,
  loadIstioEnabledProjects: (options: any) => any,
}

interface ServiceMeshOVState {
  MGWResLenght: number
  CMResLenght: number
  VSLResLenght: number
  loading: boolean
  install: boolean
}

class ServiceMeshOV extends React.Component<ServiceMeshOVProps, ServiceMeshOVState> {
  state = {
    MGWResLenght: 0,
    CMResLenght: 0,
    VSLResLenght: 0,
    loading: true,
    install: true,
  }
  async componentDidMount() {
    const IEPRes = await this.props.loadIstioEnabledProjects({ isHandleError: true })
    const IEPResData: any[] = getDeepValue(IEPRes, ['response', 'result', 'projects']) || []
    const install = IEPResData
    .find(({ namespace, istioEnabledClusterIds }: { namespace: string, istioEnabledClusterIds: string[] }) =>
    (namespace === this.props.projectName) && istioEnabledClusterIds.includes(this.props.clusterID) )
    this.setState({ install: !isEmpty(install) })
    if (isEmpty(install)) { return }
    const [ MGWRes, CMRes, VSLRes ] = await Promise.all([
      this.props.getMeshGateway(this.props.clusterID, { isHandleError: true }),
      this.props.loadComponent(this.props.clusterID, this.props.projectName, { isHandleError: true }),
      this.props.loadVirtualServiceList({ clusterId: this.props.clusterID }, { isHandleError: true }),
    ])
    const MGWResData: string[] = getDeepValue(MGWRes, ['response', 'result' ]) || []
    const MGWResLenght = MGWResData.length
    const CMResData: any[] = getDeepValue(CMRes, ['response', 'result']) || {}
    const CMResLenght: number = Object.keys(CMResData).length
    const VSLResData: any[] = getDeepValue(VSLRes, ['response', 'result']) || {}
    const VSLResLenght: number = Object.keys(VSLResData).length
    this.setState({ MGWResLenght, CMResLenght, VSLResLenght, loading: false })
  }
  render() {
    if (!this.state.install) {
      return (
        <div className="ServiceMeshOVunInstall">
          <div className="infoWrap">
            <MeshIcon size={30} style={{ color: '#ccc' }}/>
            <div className="info">该项目&集群未开启服务网格</div>
          </div>
        </div>
      )
    }

    return (
      <Spin spinning={this.state.loading}>
      <Card title="治理服务网格" className="ServiceMeshOV">
        <Row>
          <Col span={8} className="split"><div className="info">网格数量</div>
          <div className="info big">{`${this.state.MGWResLenght}个`}</div></Col>
          <Col span={8} className="split"><div className="info">组件数量</div>
          <div className="info big">{`${this.state.CMResLenght}个`}</div></Col>
          <Col span={8}><div className="info">路由规则数量</div>
          <div className="info big">{`${this.state.VSLResLenght}个`}</div></Col>
        </Row>
      </Card>
      </Spin>
    )
  }
}

export default connect(mapStateToProps, {
  getMeshGateway: MGWAction.getMeshGateway,
  loadComponent: SMAction.loadComponent,
  loadVirtualServiceList: MRMAction.loadVirtualServiceList,
  loadIstioEnabledProjects: MeshAction.loadIstioEnabledProjects,
})(ServiceMeshOV)
