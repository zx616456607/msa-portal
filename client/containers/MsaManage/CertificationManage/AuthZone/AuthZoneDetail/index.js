/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Auth zone detail
 *
 * @author zhangxuan
 * @date 2018-05-30
 */
import React from 'react'
import { connect } from 'react-redux'
import { Card, Row, Col, Tabs } from 'antd'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import { getIdentityZoneDetail } from '../../../../../actions/certification'
import AUTH_ZONE_ICON from '../../../../../assets/img/msa-manage/auth-zone.png'
import Clients from './Clients'
import Users from './Users'
import Groups from './Groups'
import './style/index.less'

const TabPane = Tabs.TabPane

class AuthZoneDetail extends React.Component {

  componentDidMount() {
    const { uaaAuth, history, getIdentityZoneDetail, match } = this.props
    const { zoneId } = match.params
    if (isEmpty(uaaAuth)) {
      history.push('/msa-manage/certification-manage')
      return
    }
    getIdentityZoneDetail(zoneId)
  }

  state = {
    activeKey: 'user',
  }

  handleTabs = activeKey => {
    this.setState({
      activeKey,
    })
  }

  render() {
    const { activeKey } = this.state
    const { identityZoneDetail } = this.props
    return (
      <QueueAnim className="auth-zone-detail">
        <Card key={'auth-zone-detail-header'} className="auth-zone-detail-header">
          <div className="header-detail-box">
            <img src={AUTH_ZONE_ICON} className="auth-zone-icon" alt="auth-zone-icon"/>
            <div className="auth-zone-info">
              <div className="auth-zone-name">认证域：{identityZoneDetail.name}</div>
              <Row>
                <Col span={12}>认证域 ID：{identityZoneDetail.id}</Col>
                <Col span={12}>描述：{identityZoneDetail.description || '-'}</Col>
              </Row>
              <div>SubDomain：{identityZoneDetail.subdomain || '-'}</div>
            </div>
          </div>
        </Card>
        <Card key={'auth-zone-detail-body'}>
          <Tabs activeKey={activeKey} onChange={this.handleTabs}>
            <TabPane tab="用户" key="user"><Users/></TabPane>
            <TabPane tab="组" key="group"><Groups/></TabPane>
            <TabPane tab="客户端" key="client"><Clients/></TabPane>
          </Tabs>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { entities, certification } = state
  const { uaaAuth } = entities
  const { identityZoneDetail } = certification
  return {
    uaaAuth,
    identityZoneDetail,
  }
}

export default connect(mapStateToProps, {
  getIdentityZoneDetail,
})(AuthZoneDetail)
