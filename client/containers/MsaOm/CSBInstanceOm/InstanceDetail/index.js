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
import { Button, Row, Col, Tabs } from 'antd'
import Monitor from './Monitor'
import Log from './Log'
import { renderCSBInstanceStatus, HANDlE_INSTANCE_MESSAGE } from '../../../../components/utils'
import {
  stopInstance,
  restartInstance,
} from '../../../../actions/CSB/instance'

const TabPane = Tabs.TabPane

class InstanceDetail extends React.Component {
  static propTypes = {
    detail: propTypes.object.isRequired,
  }

  render() {
    const { detail, callback, stopInstance, restartInstance } = this.props
    const { name, clusterId, status } = detail
    return (
      <div className="service-detail">
        <div className="service-detail-header ant-row">
          <div className="service-detail-header-icon">
            <img width="80" height="80" src={serviceIcon} alt="service" />
          </div>
          <div className="service-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">
                实例名称：{name}
              </h2>
            </div>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  运行状态：{renderCSBInstanceStatus(status)}
                </div>
              </Col>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  共发布服务：-
                </div>
              </Col>
              <Col span={12} className="service-detail-header-btns">
                <Button
                  type="primary"
                  style={{ marginRight: 12 }}
                  onClick={() => callback(HANDlE_INSTANCE_MESSAGE.stop, stopInstance)}
                >
                  停止 CSB 实例
                </Button>
                <Button onClick={() => callback(HANDlE_INSTANCE_MESSAGE.restart, restartInstance)}>
                  重新部署
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  副本数量：-
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                  累计调用量：-
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="service-detail-body">
          <Tabs tabPosition="left">
            <TabPane tab="监控" key="monitor">
              <Monitor clusterID={clusterId} instance={detail}/>
            </TabPane>
            <TabPane tab="日志" key="log">
              <Log clusterID={clusterId} instance={detail}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default connect(null, {
  stopInstance,
  restartInstance,
})(InstanceDetail)
