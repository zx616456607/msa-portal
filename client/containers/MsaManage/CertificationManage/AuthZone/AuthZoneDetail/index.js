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
import { withNamespaces } from 'react-i18next'
import './style/index.less'

const TabPane = Tabs.TabPane
@withNamespaces('authZoneDetail')
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
    const { identityZoneDetail, t } = this.props
    return (
      <QueueAnim className="auth-zone-detail">
        <Card key={'auth-zone-detail-header'} className="auth-zone-detail-header">
          <div className="header-detail-box">
            <img src={AUTH_ZONE_ICON} className="auth-zone-icon" alt="auth-zone-icon"/>
            <div className="auth-zone-info">
              <div className="auth-zone-name">{ t('header.authZone') }：{identityZoneDetail.name}</div>
              <Row>
                <Col span={12}>{ t('header.authZoneID') }：{identityZoneDetail.id}</Col>
                <Col span={12}>{ t('header.description') }：{identityZoneDetail.description || '-'}</Col>
              </Row>
              <div>SubDomain：{identityZoneDetail.subdomain || '-'}</div>
            </div>
          </div>
        </Card>
        <Card key={'auth-zone-detail-body'}>
          <Tabs activeKey={activeKey} onChange={this.handleTabs}>
            <TabPane tab={ t('public.user') } key="user"><Users/></TabPane>
            <TabPane tab={ t('public.group') } key="group"><Groups/></TabPane>
            <TabPane tab={ t('public.OAuthApp') } key="client"><Clients/></TabPane>
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
