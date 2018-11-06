/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetail
 *
 * 2017-09-13
 * @author zhangxuan
 */
import React from 'react'
import { Row, Col, Tabs } from 'antd'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { getMsaList } from '../../../../actions/msa'
import {
  msaListSlt,
} from '../../../../selectors/msa'
import MsaDetailList from './MsaDetailList'
import MsaDetailEnv from './MsaDetailEnv'
import MsaDetailConfig from './MsadetailConfig'
import MsaDetailLogs from './MsaDetailLogs'
import MsaDetailBlownStrategy from './MsaDetailBlownStrategy'
import MsaDetailDemote from './MsaDetailDemote'
import './style/index.less'
import Monitor from './MsaMonitor'
import BlownMonitor from './MsaBlownMonitor'

const TabPane = Tabs.TabPane

class MsaDetail extends React.Component {
  state = {
    activeKey: 'list',
  }

  callback = activeKey => {
    this.setState({
      activeKey,
    })
  }

  loadMsaDetail = () => {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  componentDidMount() {
    this.loadMsaDetail()
  }

  render() {
    const { activeKey } = this.state
    const { name, msaDetail, msaListLoading, clusterID, history } = this.props
    const instances = msaDetail.instances || []
    return (
      <QueueAnim className="msa-detail">
        <Row className="msa-detail-header" key="header">
          <Col span={3}>
            <img alt="java" className="msa-detail-header-icon" src="/img/service/java.png"/>
          </Col>
          <Col span={21} className="msa-detail-header-right">
            <div className="msa-detail-header-name">
              {msaDetail.appName}
            </div>
            <div className="msa-detail-header-status">
              实例状态：
              <span className="success-status">在线</span>/总数
              （{<span className="success-status">{msaDetail.upSum}</span>}/
              {instances.length}）
            </div>
          </Col>
        </Row>
        <div className="msa-detail-tabs">
          <Tabs
            activeKey={activeKey}
            onChange={this.callback}
          >
            <TabPane tab="实例列表" key="list">
              <MsaDetailList
                name={name}
                msaDetail={msaDetail}
                instances={instances}
                loadMsaDetail={this.loadMsaDetail}
                loading={msaListLoading}
                clusterID={clusterID}
                history={history}
              />
            </TabPane>
            <TabPane tab="环境信息" key="env">
              <MsaDetailEnv
                name={name}
                instances={instances}
                clusterID={clusterID}
                registryType={msaDetail.type}
              />
            </TabPane>
            <TabPane tab="日志信息" key="log">
              <MsaDetailLogs
                msaDetail={msaDetail}
                clusterID={clusterID}
                registryType={msaDetail.type}
              />
            </TabPane>
            <TabPane tab="监控" key="monitor">
              {
                activeKey === 'monitor' &&
                <Monitor
                  {...{ name, clusterID }}
                />
              }
            </TabPane>
            <TabPane tab="配置" key="config">
              <MsaDetailConfig
                name={name}
                instances={instances}
                clusterID={clusterID}
              />
            </TabPane>
            <TabPane tab="熔断监控" key="blown">
              <BlownMonitor
                {...{ name, clusterID }}
              />
            </TabPane>
            <TabPane tab="熔断" key="fusing">
              <MsaDetailBlownStrategy serviceName={name}/>
            </TabPane>
            <TabPane tab="降级" key="demotion">
              <MsaDetailDemote/>
            </TabPane>
          </Tabs>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current } = state
  const { id } = current.config.cluster
  const { match } = ownProps
  const { name } = match.params
  const { msaList, msaListLoading } = msaListSlt(state)
  let msaDetail = {}
  msaList.every(msa => {
    if (msa.appName === name) {
      msaDetail = msa
      return false
    }
    return true
  })
  return {
    clusterID: id,
    name,
    msaDetail,
    msaListLoading,
  }
}

export default connect(mapStateToProps, {
  getMsaList,
})(MsaDetail)
