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
import { postApm, loadApms, getApmState, removeApmRow, getApms, getApmService } from '../../actions/apm'
import { getGlobalConfigByType } from '../../actions/globalConfig'
import projectsClustersWrapper from '../../components/projectsClustersWrapper'

const Option = Select.Option

class ApmSetting extends React.Component {
  state = {
    apms: [],
    percent: 0,
    version: '',
    apmsId: '',
    apmState: false,
    uninstall: false,
    isLoading: true,
    projectNames: [],
    serviceData: [],
    installSate: false,
    isHealthy: false,
    componentState: false,
  }

  componentDidMount() {
    const { clusterID, getGlobalConfigByType } = this.props
    getGlobalConfigByType(clusterID, 'msa')
    this.fetchapmsId()
    this.apmService()
  }
  // componentWillMount() {
  //   this.load()
  // }

  // load = () => {
  //   this.fetchapmsId()

  // }

  fetchapmsId = () => {
    const { loadApms, clusterID, projectNamespace } = this.props
    this.setState({
      isLoading: true,
    })
    loadApms(clusterID, projectNamespace).then(res => {
      if (res.error) return
      this.assemblyState(res.response.result.data.apms[0])
    })
  }

  assemblyState = apmId => {
    const { getApmState, apmList, clusterID, projectNamespace } = this.props
    const { configDetail } = apmList || {}
    if (apmId) {
      const query = {
        id: apmId,
        cluster: clusterID,
      }
      getApmState(query, projectNamespace).then(res => {
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
    const { clusterID, getApmService, projectNamespace } = this.props
    const body = {
      id: clusterID,
      pinpoint: 'pinpoint',
    }
    getApmService(body, projectNamespace).then(res => {
      if (res.error) { return }
      this.setState({
        serviceData: res.response.result.data,
      })
      this.fetchState(res.response.result.data)
      this.filters()
    })
  }

  fetchState = data => {
    const { projectNamespace } = this.props
    const serviceAry = []
    data.forEach(item => {
      if (item.namespace === projectNamespace) {
        const configDetail = JSON.parse(item.configDetail) || {}
        const nameAry = {
          space: projectNamespace,
          version: configDetail.version,
        }
        serviceAry.push(nameAry)
      }
    })
    if (serviceAry.length > 0) {
      if (serviceAry[0].space === projectNamespace) {
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
    const projectID = JSON.parse(JSON.stringify(this.props.projectID))
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
    const { clusterID, postApm, projectNamespace } = this.props
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
    postApm(body, clusterID, projectNamespace).then(res => {
      if (res.error) return
      // this.apmService()
      this.fetchapmsId()
    })
  }

  handleUnload = () => {
    this.setState({
      uninstall: true,
    })
  }
  handleDel = () => {
    const { removeApmRow, apmList, clusterID, projectNamespace } = this.props
    const body = {
      id: apmList.id,
      cluster: clusterID,
    }
    removeApmRow(body, projectNamespace).then(res => {
      if (res.error) return
      // this.apmService()
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
    const { projectNamespace, currentCluster } = this.props
    const { isHealthy, componentState, isLoading } = this.state
    let healthy = null
    if (componentState) {
      healthy = isHealthy ? <span className="desc"><font color="#5cb85c">健康</font></span> :
        <span className="descs">不健康</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }
    // let clusterText = ''
    // const { clusters } = current
    // clusters && Object.keys(clusters).forEach(item => {
    //   if (item === namespace) {
    //     clusterText = clusters[namespace].ids ? clusterName : ''
    //   }
    // })

    const title_extra =
      <span className="apm-project">
        ( 项目：{projectNamespace} 集群：{currentCluster.clusterName})
      </span>
    return (
      <QueueAnim>
        <Spin spinning={isLoading}>
          <div key="layout-content-btns">
            <Card
              title="APM配置"
              className="apm_config_style"
            >
              {title_extra}
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
                  <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确定继续卸载 ?</span>
                </div>
              </Modal>
            </Card>
          </div>
        </Spin>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { clusterID, projectNamespace } = props
  const aryApmID = []
  const { current, entities, queryApms, springCloudAndApm } = state
  const { clusters } = current
  const { apms } = entities
  // const userProjectsList = current.projectsList && current.projectsList.ids || []
  const projectID = current.projects.ids
  const apmIds = queryApms[projectNamespace] ? queryApms[projectNamespace][clusterID] : ''
  const c_isFetching = apmIds ? apmIds.isFetching : true
  const apmID = c_isFetching === false ? queryApms[projectNamespace][clusterID].ids[0] : ''
  aryApmID.push(apmID)
  const apmList = apms && apms[apmID]
  return {
    apmID,
    apmList,
    clusters,
    projectID,
    aryApmID,
    springCloudAndApm,
  }
}

export default projectsClustersWrapper(connect(mapStateToProps, {
  postApm,
  getApms,
  loadApms,
  getApmState,
  removeApmRow,
  getApmService,
  getUserProjects: getProjectList,
  getProjectClusters,
  getGlobalConfigByType,
})(ApmSetting))
