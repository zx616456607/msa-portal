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
import './style/index.less'
import MsaDetailList from './MsaDetailList'
import MsaDetailEnv from './MsaDetailEnv'
import MsaDetailConfig from './MsadetailConfig'
import MsaDetailLogs from './MsaDetailLogs'

const TabPane = Tabs.TabPane

export default class MsaDetail extends React.Component {
  callback = key => {
    console.log(key)
  }
  render() {
    return (
      <div className="msa-detail">
        <Row className="msa-detail-header">
          <Col span={3}>
            <img className="msa-detail-header-icon" src="/img/service/java.svg"/>
          </Col>
          <Col span={21} className="msa-detail-header-right">
            <div className="msa-detail-header-name">
              APPinCPKuService
            </div>
            <div className="msa-detail-header-address">
              服务地址：https://10.123.12.133:9003/
            </div>
            <div className="msa-detail-header-time">
              注册时间：2017.07.08
            </div>
            <div className="msa-detail-header-status">
              实例状态：
              <span className="success-status">在线/</span>
              失败（12/13）
            </div>
          </Col>
        </Row>
        <Tabs className="msa-detail-tabs" defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="实例列表" key="1"><MsaDetailList/></TabPane>
          <TabPane tab="环境信息" key="2"><MsaDetailEnv/></TabPane>
          <TabPane tab="日志信息" key="3" disabled><MsaDetailLogs/></TabPane>
          <TabPane tab="监控" key="4" disabled>
            <img width="720px" src={require('../../../../assets/img/msa-manage/service_monitor.png')}/>
          </TabPane>
          <TabPane tab="配置" key="5"><MsaDetailConfig/></TabPane>
        </Tabs>
      </div>
    )
  }
}
