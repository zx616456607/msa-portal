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
import isEmpty from 'lodash/isEmpty'
import { getMsaState, installMsaConfig, uninstallMsaConfig, loadSpringCloud, fetchSpingCloud } from '../../actions/msaConfig'
import { Row, Col, Button, Icon, Modal, notification, Card, Form, Spin } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { getGlobalConfigByType } from '../../actions/globalConfig'
import projectsClustersWrapper from '../../components/projectsClustersWrapper'
import InstallModal from './MsaConfigInstallModal'

class MsaConfig extends React.Component {
  state = {
    gitLab: {},
    percent: 0,
    msaState: false,
    uninstall: false,
    installSate: false,
    notCurAry: [],
    isLoading: true,
    springcloudID: [],
    springclouds: [],
    springcloudState: '',
    apmEnabled: false,
    installVisible: false,
  }

  componentDidMount() {
    this.load()
    const { getGlobalConfigByType, clusterID } = this.props
    getGlobalConfigByType(clusterID, 'msa')
  }

  load = () => {
    const { loadSpringCloud, clusterID, projectNamespace } = this.props
    this.setState({
      isLoading: true,
    })
    loadSpringCloud(clusterID, projectNamespace).then(res => {
      if (res.error) {
        this.setState({
          isLoading: false,
        })
        return
      }
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

  fetchState = list => {
    const { getMsaState, clusterID, projectNamespace } = this.props
    if (list.length === 0) {
      return this.setState({
        gitLab: {},
        msaState: false,
        isLoading: false,
        springcloudState: '',
      })
    }
    getMsaState(clusterID, list[0].id, projectNamespace).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const { status } = res.response.result.data
        this.setState({
          msaState: true,
          isLoading: false,
          springcloudState: status,
          gitLab: list[0].configDetail,
        })
      }
    })
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
    const { uninstallMsaConfig, clusterID, projectNamespace } = this.props
    let filterSpring = springcloudID.filter(item => item.namespace === projectNamespace)
    if (isEmpty(filterSpring)) {
      return
    }
    this.setState({
      delLoading: true,
    })
    filterSpring = filterSpring[0]
    const query = {
      id: filterSpring.id,
    }
    uninstallMsaConfig(clusterID, projectNamespace, query).then(res => {
      if (res.error) {
        this.setState({
          delLoading: false,
        })
        return
      }
      if (res.response.result.code === 200) {
        this.setState({
          msaState: false,
          uninstall: false,
          delLoading: false,
        })
        this.load()
      }
    })
  }
  /**
   * 安装 Spring Cloud
   */
  handleInstall = () => {
    const { installMsaConfig, clusterID, projectNamespace, form } = this.props
    const { validateFields } = form
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { gitUrl, gitUser, gitPassword, gitToken } = values
      let configDetail = {
        gitUrl,
        gitUser,
        gitPassword,
        gitToken,
      }
      this.setState({
        installLoading: true,
      })
      configDetail = JSON.stringify(configDetail)
      const body = {
        type: 'springcloud',
        configDetail,
      }
      installMsaConfig(body, clusterID, projectNamespace).then(res => {
        if (res.error) {
          this.setState({
            installLoading: false,
          })
          notification.warn({
            message: '安装失败',
          })
          return
        }
        notification.success({
          message: '安装成功',
        })
        this.load()
        this.play()
        this.setState({
          msaState: true,
          installSate: true,
          installLoading: false,
          installVisible: false,
        })
      })
    })
  }

  onInstallClick = () => {
    this.setState({
      installVisible: true,
    })
  }
  onCancelInstall = () => {
    this.setState({
      installVisible: false,
    })
  }
  handleCancel = () => {
    this.setState({
      uninstall: false,
    })
    this.props.form.resetFields()
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
  render() {
    const {
      msaState, springcloudState, installLoading, gitLab, installVisible,
    } = this.state

    const { version } = gitLab && Object.keys(gitLab).length > 0 && JSON.parse(gitLab)
    const { form, projectNamespace, currentCluster } = this.props

    let healthy = null
    if (springcloudState !== '') {
      if (springcloudState === 0) healthy = <span className="descs">不健康</span>
      if (springcloudState === 1) healthy = <span className="desc"><font color="#5cb85c">健康</font></span>
      if (springcloudState === 2) healthy = <span className="descs">启动中</span>
      if (springcloudState === 3) healthy = <span className="descs">停止中</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }
    const title_extra =
      <span className="msa-project">
        ( 项目：{projectNamespace} 集群：{currentCluster.clusterName})
      </span>
    return (
      <QueueAnim>
        <Spin spinning={this.state.isLoading}>
          <div key="layout-content-btns">
            {/* <ProjectCluster callback={() => this.load()} /> */}
            <Card
              title="微服务配置"
              className="msa_config_style"
            >
              {title_extra}
              <Row className="conten">
                <Col className="right" span={12}>
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
                          <Button
                            type="primary"
                            onClick={this.onInstallClick}
                            loading={installLoading}
                          >
                            安装
                          </Button>
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
                      <span className="desc">{version || '-'}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Modal title="卸载" visible={this.state.uninstall} onCancel={this.handleCancel}
                footer={[
                  <Button key="back" type="ghost" onClick={this.handleCancel}>  取 消 </Button>,
                  <Button key="submit" type="primary" loading={this.state.delLoading} onClick={this.handleDel}> 继续卸载 </Button>,
                ]}>
                <div className="prompt" style={{ height: 55, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
                  <span>即将在当前项目内卸载 SpringCloud 基础服务, 卸载后该项目内应用将无法继续使用微服务部分功能</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确定继续卸载 ?</span>
                </div>
              </Modal>
              {
                installVisible &&
                <InstallModal
                  onCancel={this.onCancelInstall}
                  onOk={this.handleInstall}
                  loading={installLoading}
                  visible={installVisible}
                  gitLab={gitLab}
                  form={form}
                />
              }
            </Card>
          </div>
        </Spin>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, springCloudAndApm } = state
  return {
    current,
    springCloudAndApm,
  }
}

export default projectsClustersWrapper(connect(mapStateToProps, {
  getMsaState,
  loadSpringCloud,
  fetchSpingCloud,
  installMsaConfig,
  uninstallMsaConfig,
  getGlobalConfigByType,
})(Form.create()(MsaConfig)))
