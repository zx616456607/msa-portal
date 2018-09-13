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
import './style/Apm.less'
import { Row, Col, Select, Button, Tooltip, Modal, Icon, Card } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { getUserProjects, getProjectClusters } from '../../actions/current'
import { postApm, loadApms, getApmState, removeApmRow, getApms, getApmService } from '../../actions/apm'
import { getGlobalConfigByType } from '../../actions/globalConfig'
const Option = Select.Option

class ApmSetting extends React.Component {
  state = {
    apms: [],
    percent: 0,
    state: '',
    version: '',
    apmsId: '',
    apmState: false,
    uninstall: false,
    colony: '',
    project: '',
    projectNames: [],
    isProject: false,
    colonyData: [],
    projectsData: [],
    serviceData: [],
    installSate: false,
  }
  componentDidMount() {
    const { pinpointName, clusterID, getGlobalConfigByType } = this.props
    getGlobalConfigByType(clusterID, 'msa')
    if (pinpointName !== '') {
      this.fetchapmsId()
      this.apmService()
    }
    // this.projectList()
  }

  fetchapmsId = () => {
    const { loadApms, clusterID } = this.props
    loadApms(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          apmsId: res.response.result.data.apms[0],
        })
        this.assemblyState(res.response.result.data.apms[0])
      }
    })
  }

  assemblyState = ids => {
    const { getApmState, apmID, clusterID } = this.props
    if (ids) {
      const query = {
        id: ids !== '' ? ids : apmID,
        cluster: clusterID,
      }
      getApmState(query).then(res => {
        if (res.error) return
        let isHealthy = ''
        // TODO: use the status code to show the actual status
        if (res.response.result.data.status === 1) {
          isHealthy = 'true'
        }
        this.setState({
          state: isHealthy,
        })
      })
    }
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
      this.fetchState(res.response.result.data)
      this.filters()
    })
  }
  projectList = () => {
    const { userId, getUserProjects } = this.props
    getUserProjects(userId).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const projects = []
        if (res.response.result.data !== undefined) {
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
      }
    })
  }

  fetchState = data => {
    const { pinpointName, defaultName } = this.props
    const nameSpace = pinpointName === 'default' ? defaultName : pinpointName
    const serviceAry = []
    data.forEach(item => {
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
      }
    } else {
      this.setState({
        apmState: false,
      })
    }
  }
  filters = () => {
    const { projectID } = this.props
    const { serviceData } = this.state
    const DataAry = []
    if (Object.keys(serviceData).length === 0) return
    serviceData.forEach(item => {
      if (projectID !== undefined) {
        if (projectID.indexOf(item.namespace) > -1) {
          projectID.splice(projectID.indexOf(item.namespace), 1)
        }
      }
    })
    DataAry.push(projectID)
    this.setState({
      projectNames: DataAry,
    })
  }
  /**
   * 安装
   */
  handleInstall = () => {
    const { clusterID, postApm } = this.props
    const { project } = this.state
    // if (isProject === false) return
    this.setState({
      installSate: true,
    })
    this.play()
    const body = {
      type: 'pinpoint',
      scope: 'namespace',
      displayName: '',
    }
    postApm(body, clusterID, project).then(res => {
      if (res.error) return
      this.apmService()
      this.projectList()
      this.fetchapmsId()
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
      }
    } else {
      this.setState({
        apmState: false,
      })
    }

    this.setState({
      project: nameSpace,
      isProject: true,
    })
    getProjectClusters(projectName).then(res => {
      if (res.error) return
      this.setState({
        colonyData: res.response.result.data.clusters,
      })
    })
  }

  handleUnload = () => {
    this.setState({
      uninstall: true,
    })
  }
  handleDel = () => {
    const { removeApmRow, clusterID, defaultName, project } = this.props
    const { serviceData } = this.state
    if (Object.keys(serviceData).length === 0) return
    serviceData.forEach(item => {
      if (item.namespace === defaultName) {
        const body = {
          id: item.id,
          cluster: clusterID,
        }
        const projectName = project.namespace === 'default' ? defaultName : project.namespace
        removeApmRow(body, projectName).then(res => {
          if (res.error) return
          this.apmService()
          this.projectList()
          this.setState({
            installSate: false,
            apmState: false,
            uninstall: false,
            state: '',
            version: '',
          })
        })
      }
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
        this.setState({
          installSate: false,
        })
      }
    }, 100)
  }
  handleCancel = () => {
    this.setState({
      uninstall: false,
    })
  }

  render() {
    const { apmState, state } = this.state
    const { springCloudAndApm } = this.props
    let pinpoint = false
    if (springCloudAndApm.configDetail) {
      const data = JSON.parse(springCloudAndApm.configDetail)
      if (data.canDeployPersonalServer) {
        pinpoint = data.canDeployPersonalServer.pinpoint
      }
    }

    let healthy = null
    if (state !== '') {
      healthy = state ? <span className="desc"><font color="#5cb85c">健康</font></span> :
        <span className="descs">不健康</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }

    return (
      <QueueAnim>
        <div key="layout-content-btns">
          <Card
            title="APM配置"
            className="apm_config_style"
          >
            <Row className="contents">
              <Col className="left">
                {/* <Row className="apms">
                  <Col span={6}>项目</Col>
                  <Col span={18}>
                    <Select style={{ width: 300 }} onChange={this.handleProject} defaultValue={MY_PORJECT}>
                      {
                        projectsData ?
                          projectsData.map((item, index) => (
                            <Option key={index}
                              value={item.projectName + ',' + item.namespace}>{item.projectName}</Option>
                          )): ''
                      }
                    </Select>
                  </Col>
                </Row>
                <Row className="apms">
                  <Col span={6}>集群</Col>
                  <Col span={18}>
                    <Select style={{ width: 300 }} onChange={this.handleColony}>
                      {
                        colonyData ?
                          colonyData.map((item, index) => (
                            <Option key={index} value={item.cluster.clusterID}>{item.cluster.clusterName}</Option>
                          )): ''
                      }
                    </Select>
                  </Col>
                </Row> */}
                <Row className="apms">
                  <Col span={5}>基础服务</Col>
                  <Col span={19}>
                    <Select className="select" defaultValue="Pinpoint">
                      <Option value="pinpoint">Pinpoint</Option>
                    </Select>
                  </Col>
                </Row>
                <Row className="apms">
                  <Col span={5}>安装情况</Col>
                  <Col span={19}>
                    {
                      apmState ?
                        <Row className="install">
                          <Icon className="ico" type="check-circle-o" />&nbsp;
                          <span className="existence" >已安装</span>
                          <span className="unload" onClick={this.handleUnload}>卸载</span>
                        </Row> :
                        <div>
                          {
                            !pinpoint ?
                              <Tooltip title= "个人项目已禁止安装 APM组件，请使用共享项目">
                                <Button type="primary" disabled >安装</Button>
                              </Tooltip>
                              :
                              <Button type="primary" onClick={this.handleInstall}>安装</Button>

                          }
                        </div>
                    }
                  </Col>
                </Row>
                <Row className="apms">
                  <Col span={5}>组件状态</Col>
                  <Col span={19}>
                    {healthy}
                  </Col>
                </Row>
                <Row className="apms">
                  <Col span={5}>组件版本</Col>
                  <Col span={19}>
                    <span className="version">{this.state.version.version}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Modal title="卸载" visible={this.state.uninstall} onCancel={this.handleCancel}
              footer={[
                <Button key="back" type="ghost" onClick={this.handleCancel}>  取 消 </Button>,
                <Button key="submit" type="primary" onClick={this.handleDel}> 继续卸载 </Button>,
              ]}>
              <div className="prompt" style={{ height: 55, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
                <span >即将在当前项目内卸载 Pinpoint 基础服务卸载后该项目内应用将, 无法继续使用 APM 部分功能</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确认继续卸载 ?</span>
              </div>
            </Modal>
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const projects = []
  const aryApmID = []
  const { current, entities, queryApms, springCloudAndApm } = state
  const { cluster, project } = current.config
  const projectID = current.projects.ids
  const clusterID = cluster.id
  const clusters = entities.clusters ? entities.clusters[clusterID] : ''
  const apmIds = queryApms[project.namespace] ? queryApms[project.namespace][clusterID] : ''
  const c_isFetching = apmIds ? apmIds.isFetching : true
  const apmID = c_isFetching === false ? queryApms[project.namespace][clusterID].ids[0] : ''
  const pinpointName = current ? current.config.project.namespace : ''
  const defaultName = current ? current.user.info.namespace : ''
  aryApmID.push(apmID)
  projects.push(entities.projects)
  const { info } = current.user
  const userId = info.userID
  return {
    apmID,
    userId,
    project,
    projects,
    clusters,
    clusterID,
    projectID,
    aryApmID,
    defaultName,
    pinpointName,
    springCloudAndApm,
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
  getGlobalConfigByType,
})(ApmSetting)
