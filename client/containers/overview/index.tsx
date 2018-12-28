/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * index.tsx page
 *
 * @author zhangtao
 * @date Monday December 17th 2018
 */
import * as React from 'react'
import { Row, Col } from 'antd'
import SpringCloudOV from './SpringCloudOV'
import ServiceMeshOV from './serviceMeshOV'
import DubboOV from './DubboOV'
import MSDTCOV from './MSDTCOV'
import ServiceBus from './ServiceBus'
import './styles/index.less'

interface OverviewProps {

}
interface OverviewState {

}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
  render() {
    return(
      <div className="overviewWrap" >
        <Row gutter={16}>
          <Col span={16}>
            <SpringCloudOV/>
          </Col>
          <Col span={8}>
            <ServiceMeshOV/>
            <DubboOV/>
          </Col>
        </Row>
        <Row gutter={16} className="secondSection">
          <Col span={16}>
            <ServiceBus/>
          </Col>
          <Col span={8}>
            <MSDTCOV/>
          </Col>
        </Row>
        {/* <ServiceBus/> */}
      </div>
    )
  }
}
