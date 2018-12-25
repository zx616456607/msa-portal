/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * PerformanceOV.tsx page
 *
 * @author zhangtao
 * @date Monday December 24th 2018
 */
import * as React from 'react'
import { Card, Row, Col, Spin } from 'antd'
import './styles/PerformanceOV.less'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';
import { connect } from 'react-redux'
import { getDeepValue } from '../../common/utils'
import * as IPActions from '../../actions/indexPage'
import * as ApmAction from '../../actions/apm'
import APMunInstalled from '../../../client/assets/img/overview/APMunInstalled.svg'
interface PerformanceOVProps {
  clusterID: string
  apms: any
  getServiceCall: (clusterId: string, query: any) => any
  loadApms: (clusterID: string, namespace: string  ) => any,
  current: any
}
interface PerformanceOVState {
  gSCDataS: NodeData[]
  gSCDataF: NodeData[]
  loading: boolean
}

function MapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  const { current, queryApms } = state
  const { project, cluster } = current.config
  let apms = queryApms[project.namespace] || {}
  apms = apms[cluster.id] || { isFetching: true }
  return { clusterID, apms, current }
}

const defineData = [ { data: 0, time: '' } ]
class PerformanceOV extends React.Component<PerformanceOVProps, PerformanceOVState> {
  state = {
    gSCDataS: defineData,
    gSCDataF: defineData,
    loading: true,
  }
  async componentDidMount() {
    await this.props.loadApms(this.props.clusterID, this.props.current.config.project.namespace)
    if (!this.props.apms.ids || this.props.apms.ids.length === 0) { return }
    const startTime = new Date().getTime() - 2 * 86400000
    const endTime = new Date().getTime()
    const gSCRes =
    await this.props.getServiceCall(this.props.clusterID, { startTime, endTime, scaleSize: 1  })
    const gSCDataS: NodeData[] = (getDeepValue(gSCRes, ['response', 'result', 'data', 'sortedCallService']) || [])
    .map(({ count: data, name: time  }) => ({ data, time }) ).slice(0, 10)
    const gSCDataF: NodeData[] = (getDeepValue(gSCRes, ['response', 'result', 'data', 'sortedErrorService']) || [])
    .map(({ count: data, name: time  }) => ({ data, time }) ).slice(0, 10)
    this.setState({
      gSCDataS: gSCDataS.length === 0 ? defineData : gSCDataS,
      gSCDataF: gSCDataF.length === 0 ? defineData : gSCDataF,
      loading: false })
  }
  render() {
    if ((!this.props.apms.ids || this.props.apms.ids.length === 0) && this.state.loading === false ) {
      return <div className="PerformanceOVInstall">
        <div className="infoWrap">
            <img src={APMunInstalled} alt="当前项目&集群未安装 APM"/>
            <div className="info">当前项目&集群未安装 APM</div>
        </div>
      </div>
    }
    return (
      <Spin spinning={this.state.loading}>
      <Card
        className="PerformanceOV"
        title={<div className="title">
        <span>性能管理</span>
        <span className="grey">{`监控服务${0}`}</span>
        </div>}
      >
        <Row gutter={32}>
          <Col span={12}>
            <div className="info">近两天服务调用成功数 Top10</div>
            <Basiccolumn color="#43b3fb" data={this.state.gSCDataS}/>
          </Col>
          <Col span={12}>
            <div className="info">近两天服务调用失败数 Top10</div>
            <Basiccolumn color="#f7565c" data={this.state.gSCDataF}/>
          </Col>
        </Row>
      </Card>
      </Spin>
    )
  }
}

export default connect(MapStateToProps, {
  getServiceCall: IPActions.getServiceCall,
  loadApms: ApmAction.loadApms,
})(PerformanceOV)

interface BasiccolumnProps {
  color: string
  data: NodeData[]
}

interface NodeData {
  time: string
  data: number
}
class Basiccolumn extends React.Component<BasiccolumnProps, {}> {
  render() {
    const cols = {
      sales: {
        tickInterval: 20,
      },
    };
    return (
      <div>
        <Chart height={161} data={this.props.data} scale={cols} forceFit padding={'auto'}>
          <Axis name="year" />
          <Axis name="sales" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="interval" position="time*data" color={this.props.color}/>
        </Chart>
      </div>
    );
  }
}
