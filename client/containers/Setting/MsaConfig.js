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
import { Row, Col, Select, Button, Icon, Modal, Input, notification, Card, Form, Tooltip } from 'antd'
import QueueAnim from 'rc-queue-anim'
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
    springcloudID: [],
    springclouds: [],
    springcloudState: '',
  }

  componentWillMount() {
    this.load()
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
    let filterSpring = springcloudID.filter(item => item.namespace === project.namespace)
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
    const projects = project.namespace === 'default' ? namespace : project.namespace
    uninstallMsaConfig(cluster.id, projects, query).then(res => {
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
      }
    })
  }
  /**
   * 安装 Spring Cloud
   */
  handleInstall = () => {
    const { installMsaConfig, cluster, project, form } = this.props
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
      const namespace = project.namespace === 'default' ? '' : project.namespace
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

  gitUrlCheck = (rules, value, callback) => {
    if (!value) {
      return callback('Config Server Gitlab信息不可以空')
    }
    if (!/^https?/.test(value)) {
      return callback('请输入 http 协议地址')
    }
    callback()
  }

  gitUserCheck = (rules, value, callback) => {
    if (!value) {
      return callback('Gitlab 用户名不能为空')
    }
    callback()
  }

  gitPasswordCheck = (rules, value, callback) => {
    if (!value) {
      return callback('Gitlab 密码不能为空')
    }
    callback()
  }

  gitTokenCheck = (rules, value, callback) => {
    if (!value) {
      return callback('token 不能为空')
    }
    callback()
  }

  render() {
    const {
      msaState, springcloudState, installLoading, gitLab,
    } = this.state
    const { configDetail, version } = gitLab
    let parseGit = {}
    if (!isEmpty(configDetail)) {
      parseGit = JSON.parse(configDetail)
    }
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
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
                      rules: [
                        {
                          validator: this.gitUrlCheck,
                        },
                      ],
                      initialValue: !isEmpty(parseGit) ? parseGit.gitUrl : '',
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
                      rules: [
                        {
                          validator: this.gitUserCheck,
                        },
                      ],
                      initialValue: !isEmpty(parseGit) ? parseGit.gitUser : '',
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
                      rules: [
                        {
                          validator: this.gitPasswordCheck,
                        },
                      ],
                      initialValue: !isEmpty(parseGit) ? parseGit.gitPassword : '',
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
                      rules: [
                        {
                          validator: this.gitTokenCheck,
                        },
                      ],
                      initialValue: !isEmpty(parseGit) ? parseGit.gitToken : '',
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
                          <Button className="save" type="primary" onClick={this.handleClose}>保存</Button>
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
                          disabled={this.state.isEdit}
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
})(Form.create()(MsaConfig))
