/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Performance
 *
 * 2017-09-06
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/apm.less'
import { Row, Select, Button, Progress } from 'antd'
import { getUserProjects } from '../../actions/current'
import { loadApms, fetchApmData, delApmRow, fetcheApms } from '../../actions/apm'
// Icon, Button  Progress, Modal
class ApmSetting extends React.Component {
  state = {
    percent: 0,
    apmData: [],
    states: '',
    version: '',
    projectsData: [],
    installSate: false,
  }

  componentWillMount() {
    const { loadApms, clusterID, userId, getUserProjects } = this.props
    loadApms(clusterID)
    getUserProjects(userId).then(res => {
      if (res.error) {
        return
      }
      this.setState({
        projectsData: res,
      })
    })
  }

  /**
   * 安装
   */
  handleInstall = () => {
    this.setState({
      installSate: true,
    })
  }

  render() {
    const { percent, installSate } = this.state
    return (
      <Row className="layout-content-btns">
        <div className="header">
          <p className="" style={{ fontSize: 16, padding: 15 }}>APM配置</p>
        </div>
        <div className="content">
          <div className="left">
            <ul>
              <li>
                <span>项目</span>
                <Select style={{ width: 57 + '%', marginLeft: 11 + '%' }}></Select>
              </li>
              <li>
                <span>基础服务</span>
                <Select style={{ width: 57 + '%', marginLeft: 5 + '%' }}></Select>
              </li>
              <li>
                <span>安装情况</span>
                {
                  installSate ?
                    <Row>
                      <span style={{ color: blur }}>安装中</span>
                      <Progress percent={percent}></Progress>
                    </Row> :
                    <Button type='primary' style={{ marginLeft: 5 + '%' }} onClick={() => this.handleInstall()}>安装</Button>
                }
              </li>
              <li>
                <span>组件状态</span>
                <span style={{ marginLeft: 5 + '%' }}>健康</span>
              </li>
              <li>
                <span>组件版本</span>
                <span style={{ marginLeft: 5 + '%' }}>V2.0.1</span>
              </li>
            </ul>
          </div>
          <div className="rigth">
            <div className="header">
              <Select style={{ width: 60 + '%', marginLeft: 20 + '%' }}></Select>
            </div>
            <div className="connent">
              <span>未安装项目</span>
            </div>
            <div className="bottom">
              <span>已安装项目</span>
            </div>
          </div>
        </div>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const { info } = current.user
  const userId = info.userID
  const clusterID = cluster.id
  return {
    userId,
    clusterID,
  }
}

export default connect(mapStateToProps, {
  loadApms,
  delApmRow,
  fetcheApms,
  fetchApmData,
  getUserProjects,
})(ApmSetting)
