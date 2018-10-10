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
import { Row, Col, Select, Button, Icon, Modal, Input, notification, Card, Form, Tooltip, Spin } from 'antd'
import QueueAnim from 'rc-queue-anim'
import ProjectCluster from '../../components/ProjectCluster'
import { getGlobalConfigByType } from '../../actions/globalConfig'
const Option = Select.Option
const FormItem = Form.Item

class MsaConfig extends React.Component {
  state = {
    gitLab: {},
    percent: 0,
    isEdit: false,
    msaState: false,
    uninstall: false,
    installSate: false,
    notCurAry: [],
    isLoading: true,
    springcloudID: [],
    springclouds: [],
    springcloudState: '',
    apmEnabled: false,
  }

  componentDidMount() {
    this.load()
    const { getGlobalConfigByType, cluster } = this.props
    getGlobalConfigByType(cluster.id, 'msa')
  }

  load = () => {
    const { loadSpringCloud, cluster, projectConfig } = this.props
    const { namespace } = projectConfig.project
    this.setState({
      isLoading: true,
    })
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

  fetchState = list => {
    const { getMsaState, cluster, projectConfig } = this.props
    // const projectName = project.namespace === 'default' ? namespace : project.namespace
    const { namespace } = projectConfig.project
    if (list.length === 0) {
      return this.setState({
        gitLab: {},
        msaState: false,
        isLoading: false,
        springcloudState: '',
      })
    }
    getMsaState(cluster.id, list[0].id, namespace).then(res => {
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
    const { uninstallMsaConfig, cluster, projectConfig } = this.props
    const { namespace } = projectConfig.project
    // const projects = project.namespace === 'default' ? namespace : project.namespace
    let filterSpring = springcloudID.filter(item => item.namespace === namespace)
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
    uninstallMsaConfig(cluster.id, namespace, query).then(res => {
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
    const { installMsaConfig, cluster, projectConfig, form } = this.props
    const { namespace } = projectConfig.project
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
      installMsaConfig(body, cluster.id, namespace).then(res => {
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
        })
      })
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

  handleEdit = () => {
    this.setState({
      isEdit: true,
    })
  }

  handleClose = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      isEdit: false,
    })
  }

  handleSave = () => {
    const { form } = this.props
    const { validateFields } = form
    validateFields(errors => {
      if (errors) return
      if (!this.state.msaState) {
        return this.setState({
          isEdit: false,
        })
      }
      // 等待后端编辑接口
    })
  }
  disabledInstall = () => {
    const values = this.props.form.getFieldsValue()
    let disabledInstall = false
    Object.keys(values).map(key => !values[key] && (disabledInstall = true))
    return disabledInstall
  }
  render() {
    const {
      msaState, springcloudState, installLoading, gitLab,
    } = this.state

    const { configDetail, version } = gitLab && Object.keys(gitLab).length > 0 && JSON.parse(gitLab)
    const { gitUrl, gitUser, gitPassword, gitToken } = configDetail || {}
    const { form, clusterName, projectConfig } = this.props
    // let springcloud = false
    // if (springCloudAndApm.configDetail) {
    //   const data = JSON.parse(springCloudAndApm.configDetail)
    //   if (data.canDeployPersonalServer) {
    //     springcloud = data.canDeployPersonalServer.springcloud
    //   }
    // }

    const { getFieldDecorator } = form
    const { namespace } = projectConfig.project
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    let healthy = null
    if (springcloudState !== '') {
      if (springcloudState === 0) healthy = <span className="descs">不健康</span>
      if (springcloudState === 1) healthy = <span className="desc"><font color="#5cb85c">健康</font></span>
      if (springcloudState === 2) healthy = <span className="descs">启动中</span>
      if (springcloudState === 3) healthy = <span className="descs">停止中</span>
    } else {
      healthy = <span className="descs">未安装</span>
    }
    const clutser_name = clusterName && clusterName.replace(/[\u4e00-\u9fa5]/g, '')
    const title_extra =
      <span className="msa-project">
        ( 项目：{namespace} 集群：{clutser_name})
      </span>
    return (
      <QueueAnim>
        <Spin spinning={this.state.isLoading}>
          <div key="layout-content-btns">
            <ProjectCluster callback={() => this.load()} />
            <Card
              title="微服务配置"
              extra={title_extra}
              className="msa_config_style"
            >
              <Row className="conten">
                <Col className="left" span={12}>
                  <FormItem
                    label={'基础服务'}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('service', {
                        initialValue: 'SpringCloud',
                      })(
                        <Select style={{ width: 300 }}>
                          <Option value="SpringCloud">SpringCloud</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                  <FormItem
                    label={'Gitlab 地址'}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('gitUrl', {
                        rules: [{
                          required: true,
                          message: 'Gitlab 地址不能为空',
                        }, {
                          type: 'url',
                          message: '请输入 http 协议地址',
                        }],
                        initialValue: gitUrl || '',
                      })(
                        <Input
                          style={{ width: 300 }}
                          disabled={!this.state.isEdit}
                          placeholder="Config Server Gitlab 地址（如 https://git.demo.com）"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem
                    label={'用户名'}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('gitUser', {
                        rules: [{
                          required: true,
                          message: 'Gitlab 用户名不能为空',
                        }],
                        initialValue: gitUser || '',
                      })(
                        <Input
                          style={{ width: 300 }}
                          disabled={!this.state.isEdit}
                          placeholder="请输入 Gitlab 用户名"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem
                    label={'密码'}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('gitPassword', {
                        rules: [{
                          required: true,
                          message: 'Gitlab 密码不能为空',
                        }],
                        initialValue: gitPassword || '',
                      })(
                        <Input
                          style={{ width: 300 }}
                          type={'password'}
                          disabled={!this.state.isEdit}
                          placeholder="请输入 Gitlab 密码"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem
                    label={'Token'}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('gitToken', {
                        rules: [{
                          required: true,
                          message: 'token 不能为空',
                        }],
                        initialValue: gitToken || '',
                      })(
                        <Input
                          style={{ width: 300 }}
                          type={'password'}
                          disabled={!this.state.isEdit}
                          placeholder="Private Token:（位于 Profile Settings → Account）"
                        />
                      )
                    }
                  </FormItem>
                  <Row>
                    <Col offset={5}>
                      {
                        this.state.isEdit ?
                          <div className="btn_save">
                            <Button className="close" onClick={this.handleClose}>取消</Button>
                            <Button className="save" type="primary" onClick={this.handleSave}>保存</Button>
                          </div> :
                          <Tooltip
                            title={'编辑配置即可安装'} placement={'right'} defaultVisible={true}
                            getTooltipContainer={() => document.getElementsByClassName('btn_edit')[0]}
                          >
                            <Button className="btn_edit" type="primary" onClick={this.handleEdit}>编辑</Button>
                          </Tooltip>
                      }
                    </Col>
                  </Row>
                </Col>
                <Col className="rigth" span={12}>
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
                            disabled={this.state.isEdit || this.disabledInstall()}
                            onClick={this.handleInstall}
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
                      <span className="desc">{version}</span>
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
  const { current, entities, springCloudAndApm } = state
  const { projects, clusters } = entities
  const { info } = current.user
  const projectID = current.projects.ids || []
  const namespace = info.namespace
  const { project, cluster } = current.config
  const { projectConfig } = current
  const clusterName = clusters && clusters[cluster.id].clusterName
  return {
    project,
    cluster,
    projects,
    projectID,
    namespace,
    springCloudAndApm,
    clusterName,
    projectConfig,
  }
}

export default connect(mapStateToProps, {
  getMsaState,
  loadSpringCloud,
  fetchSpingCloud,
  installMsaConfig,
  uninstallMsaConfig,
  getGlobalConfigByType,
})(Form.create()(MsaConfig))
