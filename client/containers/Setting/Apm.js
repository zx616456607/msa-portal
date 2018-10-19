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
import { Row, Col, Select, Button, Modal, Icon, Card, Spin } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { getProjectList, getProjectClusters } from '../../actions/current'
import ProjectCluster from '../../components/ProjectCluster'
import { postApm, loadApms, getApmState, removeApmRow, getApms, getApmService } from '../../actions/apm'
import { getGlobalConfigByType } from '../../actions/globalConfig'
const Option = Select.Option

class ApmSetting extends React.Component {
  state = {
    apms: [],
    percent: 0,
    version: '',
    apmsId: '',
    apmState: false,
    uninstall: false,
    project: '',
    isLoading: true,
    projectNames: [],
    projectsData: [],
    serviceData: [],
    installSate: false,
    isHealthy: false,
    componentState: false,
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
  // componentWillMount() {
  //   this.load()
  // }

  // load = () => {
  //   this.fetchapmsId()

  // }

  fetchapmsId = () => {
    const { loadApms, clusterID } = this.props
    this.setState({
      isLoading: true,
    })
    loadApms(clusterID).then(res => {
      if (res.error) return
      this.assemblyState(res.response.result.data.apms[0])
    })
  }

  assemblyState = apmId => {
    const { getApmState, apmList, clusterID } = this.props
    const { configDetail } = apmList || {}
    if (apmId) {
      const query = {
        id: apmId,
        cluster: clusterID,
      }
      getApmState(query).then(res => {
        if (res.error) return
        // TODO: use the status code to show the actual status
        if (res.response.result.data.status === 1) {
          this.setState({
            isHealthy: true,
            isLoading: false,
            componentState: true,
            version: configDetail && JSON.parse(configDetail).version,
          })
        } else {
          this.setState({
            version: '',
            isLoading: false,
            isHealthy: false,
            componentState: false,
          })
        }
      })
    } else {
      this.setState({
        version: '',
        isLoading: false,
        isHealthy: false,
        componentState: false,
      })
    }
  }

  apmService = () => {
    const { clusterID, getApmService, projectConfig } = this.props
    const body = {
      id: clusterID,
      pinpoint: 'pinpoint',
    }
    const { namespace } = projectConfig.project
    getApmService(body, namespace).then(res => {
      if (res.error) { return }
      this.setState({
        serviceData: res.response.result.data,
      })
      this.fetchState(res.response.result.data)
      this.filters()
    })
  }
  projectList = () => {
    const { getUserProjects } = this.props
    getUserProjects().then(res => {
      // console.log('res', res)
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
        const configDetail = JSON.parse(item.configDetail) || {}
        const nameAry = {
          space: nameSpace,
          version: configDetail.version,
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
    postApm(body, clusterID).then(res => {
      if (res.error) return
      // this.apmService()
      // this.projectList()
      this.fetchapmsId()
    })
  }

  handleUnload = () => {
    this.setState({
      uninstall: true,
    })
  }
  handleDel = () => {
    const { removeApmRow, apmList, clusterID } = this.props
    const body = {
      id: apmList.id,
      cluster: clusterID,
    }
    removeApmRow(body).then(res => {
      if (res.error) return
      // this.apmService()
      // this.projectList()
      this.setState({
        installSate: false,
        // apmState: false,
        uninstall: false,
        isHealthy: false,
        componentState: false,
        version: '',
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
    // const { springCloudAndApm } = this.props
    // let pinpoint = false
    // if (springCloudAndApm.configDetail) {
    //   const data = JSON.parse(springCloudAndApm.configDetail)
    //   if (data.canDeployPersonalServer) {
    //     pinpoint = data.canDeployPersonalServer.pinpoint
    //   }
    // }
    const { clusterName, projectConfig } = this.props
    const { isHealthy, componentState, isLoading } = this.state
    const { namespace } = projectConfig.project
    let healthy = null
    if (componentState) {
      healthy = isHealthy ? <span className="desc"><font color="#5cb85c">健康</font></span> :
        <span className="descs">不健康</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }
    const clutser_name = clusterName && clusterName.replace(/[\u4e00-\u9fa5]/g, '')
    const title_extra =
      <span className="apm-project">
        ( 项目：{namespace} 集群：{clutser_name})
      </span>
    return (
      <QueueAnim>
        <Spin spinning={isLoading}>
          <div key="layout-content-btns">
            <ProjectCluster callback={this.fetchapmsId} />
            <Card
              title="APM配置"
              extra={title_extra}
              className="apm_config_style"
            >
              <Row className="contents">
                <Col className="left">
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
                        isHealthy ?
                          <Row className="install">
                            <Icon className="ico" type="check-circle-o" />&nbsp;
                            <span className="existence" >已安装</span>
                            <span className="unload" onClick={this.handleUnload}>卸载</span>
                          </Row> :
                          <Button type="primary" onClick={this.handleInstall}>安装</Button>
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
                      <span className="version">{this.state.version}</span>
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
        </Spin>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const projects = []
  const aryApmID = []
  const { current, entities, queryApms, springCloudAndApm } = state
  const { cluster, project } = current.config
  const { projects: projectsList, clusters, apms } = entities
  const { projects: { ids: userProjectsList = [] } = {} } = current
  // const userProjectsList = current.projectsList && current.projectsList.ids || []
  const projectID = current.projects.ids
  const clusterID = cluster.id
  // const clusters = entities.clusters ? entities.clusters[clusterID] : ''
  const apmIds = queryApms[project.namespace] ? queryApms[project.namespace][clusterID] : ''
  const c_isFetching = apmIds ? apmIds.isFetching : true
  const apmID = c_isFetching === false ? queryApms[project.namespace][clusterID].ids[0] : ''
  const pinpointName = current ? current.config.project.namespace : ''
  const defaultName = current ? current.user.info.namespace : ''
  aryApmID.push(apmID)
  projects.push(entities.projects)
  const { info } = current.user
  const userId = info.userID
  const { projectConfig } = current
  const apmList = apms && apms[apmID]
  const clusterName = clusters && clusters[clusterID].clusterName
  return {
    apmID,
    userId,
    current,
    apmList,
    project,
    projects,
    // clusters,
    clusterID,
    projectID,
    aryApmID,
    clusterName,
    defaultName,
    pinpointName,
    springCloudAndApm,
    projectConfig,
    projectsList: userProjectsList.map(namespace => projectsList[namespace]),
  }
}

export default connect(mapStateToProps, {
  postApm,
  getApms,
  loadApms,
  getApmState,
  removeApmRow,
  getApmService,
  getUserProjects: getProjectList,
  getProjectClusters,
  getGlobalConfigByType,
})(ApmSetting)
