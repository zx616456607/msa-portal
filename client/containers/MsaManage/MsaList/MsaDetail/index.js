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
import { withNamespaces } from 'react-i18next'

const TabPane = Tabs.TabPane

@withNamespaces('MsaList')
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
    const { name, msaDetail, msaListLoading, clusterID, history, t } = this.props
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
              {t('detail.status')}
              <span className="success-status">{t('detail.online')}</span>/{t('detail.total')}
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
            <TabPane tab={t('detail.detailList')} key="list">
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
            <TabPane tab={t('detail.envDetail')} key="env">
              <MsaDetailEnv
                name={name}
                instances={instances}
                clusterID={clusterID}
                registryType={msaDetail.type}
              />
            </TabPane>
            <TabPane tab={t('detail.log')} key="log">
              <MsaDetailLogs
                msaDetail={msaDetail}
                clusterID={clusterID}
                registryType={msaDetail.type}
              />
            </TabPane>
            <TabPane tab={t('detail.monitor')} key="monitor">
              {
                activeKey === 'monitor' &&
                <Monitor
                  {...{ name, clusterID }}
                />
              }
            </TabPane>
            <TabPane tab={t('detail.config')} key="config">
              <MsaDetailConfig
                name={name}
                instances={instances}
                clusterID={clusterID}
              />
            </TabPane>
            <TabPane tab={t('detail.blownMonitor')} key="blown">
              <BlownMonitor
                {...{ name, clusterID }}
              />
            </TabPane>
            <TabPane tab={t('detail.blown')} key="fusing">
              <MsaDetailBlownStrategy instances={instances} serviceName={name}/>
            </TabPane>
            <TabPane tab={t('detail.demote')} key="demotion">
              <MsaDetailDemote instances={instances} serviceName={name}/>
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
