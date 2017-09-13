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
import { Row, Select, Button, Progress, Modal, Icon } from 'antd'
import { getUserProjects, getProjectClusters } from '../../actions/current'
import { postApm, loadApms, getApmState, removeApmRow, getApms, getApmService } from '../../actions/apm'
const Option = Select.Option

class ApmSetting extends React.Component {
  state = {
    apms: [],
    percent: 0,
    states: '',
    version: '',
    apmState: false,
    uninstall: false,
    colony: '',
    project: '',
    colonyData: [],
    projectsData: [],
    serviceData: [],
    installSate: false,
  }

  componentWillMount() {
    const { loadApms, clusterID } = this.props
    loadApms(clusterID)
    this.apmService()
    this.projectList()
  }
  apmService = () => {
    const { clusterID, getApmService } = this.props
    const body = {
      id: clusterID,
      pinpoint: 'pinpoint',
    }
    getApmService(body).then(res => {
      if (res.error) { return }
      this.setState({
        serviceData: res.response.result.data,
      })

    })
  }
  projectList = () => {
    const { userId, getUserProjects } = this.props
    getUserProjects(userId).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const projects = []
        res.response.result.data.forEach(item => {
          const curProjects = {
            namespace: this.props.projects[0][item].namespace,
            projectName: res.response.entities.projects[item].namespace,
          }
          projects.push(curProjects)
        })
        this.setState({
          projectsData: projects,
        })
      }
    })
  }
  filters = () => {
    const { projectID } = this.props
    const { serviceData } = this.state
    projectID.forEach((item, index) => {
      const value = serviceData[index].namespace
      if (item === value) {
        // projectID.splice(0, index)
      }
    })
    this.setState({
      projectID,
    })
  }
  /**
   * 安装
   */
  handleInstall = () => {
    const { clusterID, postApm } = this.props
    const { project } = this.state
    // const apmId = this.fetchApmID()
    // if (apmId !== '') {
    //   const body = {
    //     id: apmId,
    //     cluster: clusterID,
    //   }
    //   getApmState(body).then(res => {
    //     if (res.error) return
    //     this.setState({
    //       apmState: res,
    //     })
    //   })
    // }
    this.play()
    const body = {
      type: 'pinpoint',
      scope: 'team',
      displayName: '',
    }
    postApm(body, clusterID, project).then(res => {
      if (res.error) return
      this.apmService()
      this.projectList()
      this.setState({
        installSate: true,
        apmState: true,
      })
    })
  }

  handleProject = value => {
    const { serviceData } = this.state
    const { getProjectClusters } = this.props
    const values = value.split(',')
    const projectName = values[0]
    const nameSpace = values[1]
    const serviceAry = []
    serviceData.forEach(item => {
      if (item.namespace === nameSpace) {
        const nameAry = {
          space: nameSpace,
          version: JSON.parse(item.configDetail),
        }
        serviceAry.push(nameAry)
      }
    })
    if (serviceAry.length > 0) {
      if (serviceAry[0].space === nameSpace) {
        this.setState({
          apmState: true,
          version: serviceAry[0].version,
        })
      } else {
        this.setState({
          apmState: false,
        })
      }
    }

    this.setState({
      project: nameSpace,
    })
    getProjectClusters(projectName).then(res => {
      if (res.error) return
      this.setState({
        colonyData: res.response.result.data.clusters,
      })
    })
  }

  handleColony = value => {
    const { colony } = this.props
    colony.forEach(item => {
      if (item === value) {
        this.setState({
          colony: item,
        })
      }
    })
  }

  handleUnload = () => {
    this.setState({
      uninstall: true,
    })
  }
  handleDel = () => {
    const { removeApmRow } = this.props
    const { serviceData, project } = this.state
    if (serviceData[0] === null) return
    const body = {
      id: serviceData[0].id,
      cluster: serviceData[0].clusterID,
    }
    removeApmRow(body, project).then(res => {
      if (res.error) return
      this.apmService()
      this.projectList()
      this.setState({
        installSate: false,
        apmState: false,
        uninstall: false,
      })
    })
  }

  fetchApmID = value => {
    const { aryApmID } = this.props
    let id = ''
    if (aryApmID) {
      aryApmID.forEach(item => {
        if (item === value) {
          id = item.id
        }
      })
    }
    return id
  }

  play() {
    let i = 0
    const timer = setInterval(() => {
      this.setState({
        percent: i += 10,
      })
      if (i === 90) {
        clearInterval(timer)
      }
    })
  }
  handleCancel = () => {
    this.setState({
      uninstall: false,
    })
  }

  render() {
    const { percent, installSate, apmState, projectsData, colonyData, serviceData } = this.state
    const { projectID } = this.props
    return (
      <Row className="layout-content-btns">
        <div className="header" style={{ marginRight: 0 }}>
          <p className="" style={{ fontSize: 16, padding: 10 }}>APM配置</p>
        </div>
        <div className="contents">
          <div className="left">
            <ul>
              <li>
                <span>项目</span>
                <Select style={{ width: 57 + '%', marginLeft: 11 + '%' }} onChange={this.handleProject}>
                  {
                    projectsData.map((item, index) => (
                      <Option key={index} value={item.projectName + ',' + item.namespace}>{item.projectName}</Option>
                    ))
                  }
                </Select>
              </li>
              <li>
                <span>集群</span>
                <Select style={{ width: 57 + '%', marginLeft: 11 + '%' }} onChange={this.handleColony}>
                  {
                    colonyData ?
                      colonyData.map((item, index) => (
                        <Option key={index} value={item.cluster.clusterID}>{item.cluster.clusterName}</Option>
                      )) : ''
                  }
                </Select>
              </li>
              <li>
                <span>基础服务</span>
                <Select style={{ width: 57 + '%', marginLeft: 7 + '%' }} >
                  <Option value="pinpoint">Pinpoint</Option>
                  {/* {
                    serviceData.map((item, index) => (
                      <Option key={index} value={item}>{item}</Option>
                    ))
                  } */}
                </Select>
              </li>
              <li>
                <span>安装情况</span>
                {
                  apmState ?
                    <Row className="install">
                      <Icon className="ico" type="check-circle-o" style={{ color: '#5cb85c', fontSize: 14 }} />&nbsp;
                      <span style={{ color: '#5cb85c' }}>已安装</span>
                      <span className="again" onClick={this.handleInstall}>重新安装</span>
                      <sapn className="unload" onClick={this.handleUnload}>卸载</sapn>
                    </Row> :
                    installSate ?
                      <Row className="loding">
                        <span>安装中</span>
                        <Progress percent={percent} showInfo={false} status="active"></Progress>
                      </Row> :
                      <Button type='primary' style={{ marginLeft: 5 + '%' }} onClick={this.handleInstall}>安装</Button>
                }
              </li>
              <li>
                <span>组件状态</span>
                <span style={{ marginLeft: 5 + '%' }}>健康</span>
              </li>
              <li>
                <span>组件版本</span>
                <span style={{ marginLeft: 5 + '%' }}>{this.state.version.version}</span>
              </li>
            </ul>
          </div>
          <div className="rigth">
            <div className="header">
              <Select style={{ width: 70 + '%', marginLeft: 16 + '%' }}>
                <Option value="pinpoint">Pinpoint</Option>
              </Select>
            </div>
            <div className="projet">
              <div className="not">
                <span style={{ fontSize: 14 }}>未安装项目</span>
                <div className="notInstalled" style={{ marginTop: 5, height: 80 }}>
                  {
                    projectID.map((item, index) => (
                      <div key={index} style={{ width: 90, display: 'inline-block' }}>
                        <span style={{ color: '#2db7f5', fontSize: 14 }}>{item}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="already">
                <div className="yes">
                  <span style={{ fontSize: 14 }}>已安装项目</span>
                  <div className="yesInstalled" style={{ marginTop: 5 }}>
                    {
                      serviceData.map((item, index) => (
                        <div key={index} style={{ width: 90, display: 'inline-block' }}>
                          <span style={{ color: '#2db7f5', fontSize: 14 }}>{item.namespace}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal title="卸载" visible={this.state.uninstall} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleClose}>  取 消 </Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}> 继续卸载 </Button>,
          ]}>
        </Modal>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  const projects = []
  const aryApmID = []
  const { current, entities, queryApms } = state
  const { cluster, project } = current.config
  const colony = current.clusters[project.namespace] ? current.clusters[project.namespace].isFetching === false ?
    current.clusters[project.namespace].ids : [] : []
  const projectID = current.projects.ids
  const clusterID = cluster.id
  const clusters = entities.clusters ? entities.clusters[clusterID] : ''
  const apmID = queryApms[project.namespace] ? queryApms[project.namespace][clusterID] ? queryApms[project.namespace][clusterID].isFetching === false ?
    queryApms[project.namespace][clusterID].ids[0] : '' : '' : ''
  const pinpointName = entities.apms[apmID] ? entities.apms[apmID].namespace : ''
  aryApmID.push(apmID)
  projects.push(entities.projects)
  const { info } = current.user
  const userId = info.userID
  return {
    apmID,
    userId,
    colony,
    projects,
    clusters,
    clusterID,
    projectID,
    aryApmID,
    pinpointName,
  }
}

export default connect(mapStateToProps, {
  postApm,
  getApms,
  loadApms,
  getApmState,
  removeApmRow,
  getApmService,
  getUserProjects,
  getProjectClusters,
})(ApmSetting)
