/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service detail
 *
 * 2017-12-07
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Menu, Dropdown, Row, Col, Tabs,
} from 'antd'
import serviceIcon from '../../../../assets/img/csb/service.png'
import { renderCSBInstanceServiceStatus } from '../../../../components/utils'
import ServiceStatistics from './Statistics'
import ServiceProtocols from './Protocols'
import ServiceParameters from './Parameters'
import ServiceControl from './Control'
import ServiceLinkRules from './LinkRules'
import './style/index.less'

const TabPane = Tabs.TabPane

class ServiceDetail extends React.Component {

  renderCurrentService() {
    const { detail, detailData } = this.props
    const { id } = detail
    const currentService = detailData[id] || {}
    return currentService
  }

  renderDropdown = () => {
    const currentService = this.renderCurrentService()
    const { status, cascadedType } = currentService
    const disabled = status === 4 || ![ 5, 6 ].includes(cascadedType)
    const menu = (
      <Menu onClick={this.handleMenu} style={{ width: 109 }}>
        {/* <Menu.Item key="list">黑／白名单</Menu.Item>*/}
        <Menu.Item key="logout" disabled={disabled}>注销</Menu.Item>
      </Menu>
    )
    return (
      <Dropdown.Button overlay={menu} onClick={this.handleDown}>
        { status === 1 ? '停止服务' : '启动服务' }
      </Dropdown.Button>
    )
  }

  handleDown = () => {
    const currentService = this.renderCurrentService()
    const { status } = currentService
    const item = {
      key: status === 1 ? 'stop' : 'start',
    }
    this.handleMenu(item)
  }

  handleMenu = item => {
    const { key } = item
    const { callback } = this.props
    const detail = this.renderCurrentService()
    callback(detail, key)
  }

  render() {
    const { instanceId } = this.props
    const detail = this.renderCurrentService()
    const { cascadedType } = detail
    return (
      <div className="service-detail">
        <div className="service-detail-header ant-row">
          <div className="service-detail-header-icon">
            <img width="80" height="80" src={serviceIcon} alt="service" />
          </div>
          <div className="service-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">
                服务名称：{detail.name}
              </h2>
            </div>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  运行状态：
                  {renderCSBInstanceServiceStatus(detail.status)}
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  所属服务组：{detail.groupName}
                </div>
              </Col>
              <Col span={4} className="service-detail-header-btns">
                {this.renderDropdown()}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  服务版本：{detail.version}
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  服务描述：{detail.description || '-'}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="service-detail-body">
          <Tabs
            tabPosition="left"
          // type="card"
          >
            <TabPane tab="统计信息" key="statistics">
              <ServiceStatistics serviceId={detail.id} instanceId={instanceId} />
            </TabPane>
            <TabPane tab="协议信息" key="protocols">
              <ServiceProtocols detail={detail} />
            </TabPane>
            <TabPane tab="参数信息" key="parameters">
              <ServiceParameters detail={detail} />
            </TabPane>
            <TabPane tab="控制信息" key="control">
              <ServiceControl detail={detail} />
            </TabPane>
            { cascadedType && <TabPane tab="级联发布" key="linkRules">
              <ServiceLinkRules detail={detail} instanceId={instanceId} />
            </TabPane> }
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { entities } = state
  const dataList = entities.cbsPublished
  return {
    detailData: dataList || {},
  }
}

export default connect(mapStateToProps, {
})(ServiceDetail)

