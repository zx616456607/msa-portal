/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Instance Detail component
 *
 * 2018-2-1
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import serviceIcon from '../../../../assets/img/csb/service.png'
import './style/InstanceDetail.less'
import { Row, Col, Tabs } from 'antd'
import Ellipsis from '@tenx-ui/ellipsis'
import Monitor from './Monitor'
import Log from './Log'

import {
  stopInstance,
  startInstance,
  restartInstance,
} from '../../../../actions/CSB/instance'

const TabPane = Tabs.TabPane

class InstanceDetail extends React.Component {
  static propTypes = {
    detail: propTypes.object.isRequired,
  }

  render() {
    const { detail, clusterId } = this.props
    return (
      <div className="instance-detail">
        <div className="instance-detail-header ant-row">
          <div className="instance-detail-header-icon">
            <img width="80" height="80" src={serviceIcon} alt="service" />
          </div>
          <div className="instance-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">
                实例名称：{detail.containerName}
              </h2>
            </div>
            <Row>
              <Col span={24}>
                <div className="item-wrapper">
                  <div>容器实例地址：</div>
                  <div className="ellipsis-wrapper">
                    <Ellipsis>{detail.podIp}</Ellipsis>
                  </div>
                </div>
                <div className="item-wrapper">
                  <div>所属服务：</div>
                  <div className="ellipsis-wrapper">
                    <Ellipsis>{detail.serviceName}</Ellipsis>
                  </div>
                </div>
                <div className="item-wrapper">
                  <div>服务地址：</div>
                  <div className="ellipsis-wrapper">
                    <Ellipsis>{detail.serviceAddress}</Ellipsis>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="instance-detail-body">
          <Tabs tabPosition="left">
            <TabPane tab="监控" key="monitor">
              <Monitor clusterID={clusterId} instance={detail}/>
            </TabPane>
            <TabPane tab="日志" key="log">
              <Log clusterID={clusterId} instance={detail} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  const { cluster } = state.current.config
  return {
    clusterId: cluster.id,
  }
}, {
  stopInstance,
  startInstance,
  restartInstance,
})(InstanceDetail)
