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
import ServiceStatistics from './Statistics'
import ServiceProtocols from './Protocols'
import ServiceParameters from './Parameters'
import ServiceControl from './Control'
import './style/index.less'

const TabPane = Tabs.TabPane

class ServiceDetail extends React.Component {

  state = {
    serviceId: '',
    statusState: 0,
  }

  componentWillReceiveProps(nextProps) {
    const { serviceId } = this.state
    const serviceList = nextProps.detailData[`${serviceId}`]
    this.setState({
      statusState: serviceList.status,
    })
  }

  renderDropdown = () => {
    const menu = (
      <Menu onClick={this.handleMenu} style={{ width: 109 }}>
        <Menu.Item key="list">黑／白名单</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    )
    return (
      <Dropdown.Button overlay={menu} onClick={this.handleDown}>
        停止服务
      </Dropdown.Button>
    )
  }

  handleDown = () => {
    const item = {
      key: 'stop',
    }
    this.handleMenu(item)
  }

  handleMenu = item => {
    const { key } = item
    const { callback, detail } = this.props
    this.setState({
      serviceId: detail.id,
    })
    callback(detail, key)
  }

  render() {
    const { statusState } = this.state
    const { detail, instanceId, renderServiceStatusUI } = this.props
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
                  {renderServiceStatusUI(statusState > 0 ? statusState : detail.status)}
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
              <ServiceParameters />
            </TabPane>
            <TabPane tab="控制信息" key="control">
              <ServiceControl detail={detail} />
            </TabPane>
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

