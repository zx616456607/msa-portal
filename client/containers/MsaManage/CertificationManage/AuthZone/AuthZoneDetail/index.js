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
import AUTH_ZONE_ICON from '../../../../../assets/img/msa-manage/auth-zone.png'
import Client from '../Clients/index'
import './style/index.less'

const TabPane = Tabs.TabPane

class AuthZoneDetail extends React.Component {

  componentDidMount() {
    const { uaaAuth, history } = this.props
    if (isEmpty(uaaAuth)) {
      history.push('/msa-manage/certification-manage')
    }
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
    const { match } = this.props
    const { zoneId } = match.params
    return (
      <QueueAnim className="auth-zone-detail">
        <Card key={'auth-zone-detail-header'} className="auth-zone-detail-header">
          <div className="header-detail-box">
            <img src={AUTH_ZONE_ICON} className="auth-zone-icon" alt="auth-zone-icon"/>
            <div className="auth-zone-info">
              <div className="auth-zone-name">认证域：{zoneId}</div>
              <Row>
                <Col span={12}>认证域 ID：{zoneId}</Col>
                <Col span={12}>描述：xxxxx</Col>
              </Row>
              <div>SubDomain：xxx</div>
            </div>
          </div>
        </Card>
        <Card key={'auth-zone-detail-body'}>
          <Tabs activeKey={activeKey} onChange={this.handleTabs}>
            <TabPane tab="用户" key="user">user</TabPane>
            <TabPane tab="组" key="group">group</TabPane>
            <TabPane tab="客户端" key="client"><Client/></TabPane>
          </Tabs>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { uaaAuth } = state.entities
  return {
    uaaAuth,
  }
}

export default connect(mapStateToProps)(AuthZoneDetail)
