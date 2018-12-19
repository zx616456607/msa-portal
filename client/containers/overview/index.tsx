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
import './styles/index.less'

interface OverviewProps{

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
           placeholder
          </Col>
        </Row>
      </div>
    )
  }
}