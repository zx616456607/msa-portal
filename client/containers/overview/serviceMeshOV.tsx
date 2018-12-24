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
import { Card, Row, Col } from 'antd'
import './styles/ServiceMeshOV.less'
import * as MGWAction from '../../actions/meshGateway'
import * as SMAction from '../../actions/serviceMesh'
import * as MRMAction from '../../actions/meshRouteManagement'
// import * as ELLAction from '../../actions/eventManage'
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'

function mapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  const projectName = getDeepValue(state, ['current', 'config', 'project', 'namespace'])
  return { clusterID, projectName }
}

interface ServiceMeshOVProps {
  clusterID: string,
  projectName: string
  getMeshGateway: (clusterId: string) => any
  loadComponent: (clusteriD: string, projectName: string ) => any,
  loadVirtualServiceList: (query: any) => any,
}

interface ServiceMeshOVState {
  MGWResLenght: number
  CMResLenght: number
  VSLResLenght: number
}

class ServiceMeshOV extends React.Component<ServiceMeshOVProps, ServiceMeshOVState> {
  state = {
    MGWResLenght: 0,
    CMResLenght: 0,
    VSLResLenght: 0,
  }
  async componentDidMount() {
    const [ MGWRes, CMRes, VSLRes ] = await Promise.all([
      this.props.getMeshGateway(this.props.clusterID),
      this.props.loadComponent(this.props.clusterID, this.props.projectName),
      this.props.loadVirtualServiceList({ clusterId: this.props.clusterID }),
    ])
    const MGWResData: string[] = getDeepValue(MGWRes, ['response', 'result' ]) || []
    const MGWResLenght = MGWResData.length
    const CMResData: any[] = getDeepValue(CMRes, ['response', 'result']) || {}
    const CMResLenght: number = Object.keys(CMResData).length
    const VSLResData: any[] = getDeepValue(VSLRes, ['response', 'result']) || {}
    const VSLResLenght: number = Object.keys(VSLResData).length
    this.setState({ MGWResLenght, CMResLenght, VSLResLenght })
  }
  render() {
    return (
      <Card title="治理服务网格" className="ServiceMeshOV">
        <Row>
          <Col span={8}><div className="info">网格数量</div>
          <div className="info">{`${this.state.MGWResLenght}个`}</div></Col>
          <Col span={8}><div className="info">组件数量</div>
          <div className="info">{`${this.state.CMResLenght}个`}</div></Col>
          <Col span={8}><div className="info">路由规则数量</div>
          <div className="info">{`${this.state.VSLResLenght}个`}</div></Col>
        </Row>
      </Card>
    )
  }
}


export default connect(mapStateToProps, {
  getMeshGateway: MGWAction.getMeshGateway,
  loadComponent: SMAction.loadComponent,
  loadVirtualServiceList: MRMAction.loadVirtualServiceList,
})(ServiceMeshOV)
