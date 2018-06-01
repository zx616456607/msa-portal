/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * msaConfig
 *
 * 2017-09-13
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/MsaConfig.less'
import { getMsaState, installMsaConfig, uninstallMsaConfig, loadSpringCloud, fetchSpingCloud } from '../../actions/msaConfig'
import { Row, Col, Select, Button, Icon, Modal, Input, notification, Card } from 'antd'
import QueueAnim from 'rc-queue-anim'
const Option = Select.Option

class MsaConfig extends React.Component {
  state = {
    gitLab: '',
    percent: 0,
    version: '',
    configDetail: '',
    isEdit: false,
    msaState: false,
    uninstall: false,
    installSate: false,
    notCurAry: [],
    serviceData: [],
    springcloudID: [],
    springclouds: [],
    springcloudState: '',
  }

  componentWillMount() {
    this.load()
    this.fetchSpingCloudState()
  }

  load = () => {
    const { loadSpringCloud, cluster, project } = this.props
    const namespace = project.namespace === 'default' ? '' : project.namespace
    loadSpringCloud(cluster.id, namespace).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          springcloudID: res.response.result.data.springclouds,
        })
        this.fetchState(res.response.result.data.springclouds)
      }
    })
  }

  /**
   * 获取Spring Cloud状态
   */

  fetchState = ids => {
    const { getMsaState, cluster, project, namespace } = this.props
    const projectName = project.namespace === 'default' ? namespace : project.namespace
    if (Object.keys(ids).length === 0) return
    ids.forEach(item => {
      if (item.namespace === projectName) {
        this.setState({
          msaState: true,
          gitLab: JSON.parse(item.configDetail),
          version: JSON.parse(item.configDetail).version,
        })
        getMsaState(cluster.id, item.id).then(res => {
          if (res.error) return
          if (res.response.result.code === 200) {
            let isHealthy = ''
            // TODO: use the status code to show the actual status
            if (res.response.result.data.status === 1) {
              isHealthy = 'true'
            }
            this.setState({
              springcloudState: isHealthy,
            })
          }
        })
      }
    })
  }

  fetchSpingCloudState = () => {
    const { fetchSpingCloud, cluster } = this.props
    fetchSpingCloud(cluster.id).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          serviceData: res.response.result.data,
        }, () => {
          // this.filters()
        })
      }
    })
  }

  filters = () => {
    const { projectID } = this.props
    const { serviceData } = this.state
    const DataAry = []
    if (Object.keys(serviceData).length === 0) {
      this.setState({
        notCurAry: projectID,
      })
    } else {
      serviceData.forEach(item => {
        if (projectID.indexOf(item.namespace) > -1) {
          projectID.splice(projectID.indexOf(item.namespace), 1)
        }
      })
      DataAry.push(projectID)
      this.setState({
        notCurAry: DataAry[0],
      })
    }
  }

  /**
   * 卸载 Spring Cloud
   */
  handleUnload = () => {
    this.setState({
      uninstall: true,
    })
  }
  handleDel = () => {
    const { springcloudID } = this.state
    const { uninstallMsaConfig, cluster, project, namespace } = this.props
    springcloudID.forEach(item => {
      if (item.namespace === namespace) {
        const query = {
          id: item.id,
        }
        const projects = project.namespace === 'default' ? namespace : project.namespace
        uninstallMsaConfig(cluster.id, projects, query).then(res => {
          if (res.error) return
          if (res.response.result.code === 200) {
            this.setState({
              msaState: false,
              uninstall: false,
            })
          }
        })
      }
    })
  }
  /**
   * 安装 Spring Cloud
   */
  handleInstall = () => {
    const { configDetail } = this.state
    const { installMsaConfig, cluster, project } = this.props
    const body = {
      type: 'springcloud',
      configDetail,
    }
    if (configDetail === '') {
      notification.error({
        message: 'Config Server Gitlab信息不可以空',
      })
      return
    }
    const namespace = project.namespace === 'default' ? '' : project.namespace
    installMsaConfig(body, cluster.id, namespace).then(res => {
      if (res.error) return
      this.play()
      this.setState({
        msaState: true,
        installSate: true,
      })
      this.fetchSpingCloudState()
    })
  }

  handleCancel = () => {
    this.setState({
      uninstall: false,
    })
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

  handleEdit = () => {
    this.setState({
      isEdit: true,
    })
  }

  handleClose = () => {
    this.setState({
      isEdit: false,
    })
  }

  handlechange = e => {
    this.setState({
      configDetail: e.target.value,
    })
  }

  render() {
    const { msaState, springcloudState, gitLab, version,
      configDetail } = this.state
    const gitUrl = gitLab.gitUrl
    let healthy = null
    if (springcloudState !== '') {
      healthy = springcloudState ? <span className="desc"><font color="#5cb85c">健康</font></span> :
        <span className="descs">不健康</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }
    return (
      <QueueAnim>
        <div key="layout-content-btns">
          <Card
            title="微服务配置"
            className="msa_config_style"
          >
            <Row className="conten">
              <Col className="left">
                <Row className="msa first_row">
                  <Col span={5}>基础服务</Col>
                  <Col span={19}>
                    <Select style={{ width: 300 }} defaultValue="SpringCloud">
                      <Option value="pinpoint">SpringCloud</Option>
                    </Select>
                  </Col>
                </Row>
                <Row className="msa">
                  <Col span={5}>Gitlab 地址</Col>
                  <Col span={19}>
                    <Input style={{ width: 300 }} disabled={!this.state.isEdit} className="gitlab" placeholder="Config Server Gitlab 地址（如 https://git.demo.com）"
                      onChange={this.handlechange} value={configDetail !== '' ? configDetail : gitUrl} />
                    {
                      this.state.isEdit ?
                        <div className="btn_save">
                          <Button className="close" onClick={this.handleClose}>取消</Button>
                          <Button className="save" type="primary" onClick={this.handleClose}>保存</Button>
                        </div> : <Button className="btn_edit" type="primary" onClick={this.handleEdit}>编辑</Button>
                    }
                  </Col>
                </Row>
                <Row className="msa">
                  <Col span={5}>安装情况</Col>
                  <Col span={19}>
                    {
                      msaState ?
                        <Row className="install">
                          <Icon className="ico" type="check-circle-o" />&nbsp;
                          <span className="existence" >已安装</span>
                          <span className="unload" onClick={this.handleUnload}>卸载</span>
                        </Row> :
                        <Button type="primary" onClick={this.handleInstall}>安装</Button>
                    }
                  </Col>
                </Row>
                <Row className="msa">
                  <Col span={5}>组件状态</Col>
                  <Col span={19}>
                    {healthy}
                  </Col>
                </Row>
                <Row className="msa">
                  <Col span={5}>组件版本</Col>
                  <Col span={19}>
                    <span className="desc">{version}</span>
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
                <span>即将在当前项目内卸载 SpringCloud 基础服务卸载后该项目内应用将, 无法继续使用 微服务 部分功能</span>
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
  const { current, entities } = state
  const { projects } = entities
  const { info } = current.user
  const projectID = current.projects.ids || []
  const namespace = info.namespace
  const { project, cluster } = current.config
  return {
    project,
    cluster,
    projects,
    projectID,
    namespace,
  }
}

export default connect(mapStateToProps, {
  getMsaState,
  loadSpringCloud,
  fetchSpingCloud,
  installMsaConfig,
  uninstallMsaConfig,
})(MsaConfig)
