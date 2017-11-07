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
import './style/msaConfig.less'
import { getMsaState, installMsaConfig, uninstallMsaConfig } from '../../actions/msaConfig'
import { Row, Col, Select, Button, Icon, Modal, Input, notification } from 'antd'
const Option = Select.Option

class MsaConfig extends React.Component {
  state = {
    gitLab: '',
    percent: 0,
    version: '',
    isEdit: false,
    msaState: false,
    uninstall: false,
    installSate: false,
  }

  componentWillMount() {
    // this.fetchState()
  }
  /**
   * 获取Spring Cloud状态
   */
  fetchState = () => {
    const { getMsaState, cluster } = this.props
    const query = {
      id: cluster.id,
      clusterID: cluster.id,
    }
    getMsaState(query).then(res => {
      if (res.error) return
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
    const { uninstallMsaConfig, cluster, project } = this.props
    uninstallMsaConfig(cluster.id, project.namespace).then(res => {
      if (res.error) return
    })
  }
  /**
   * 安装 Spring Cloud
   */
  handleInstall = () => {
    const { gitLab } = this.state
    const { installMsaConfig, cluster, project } = this.props
    const body = {
      type: 'springcloud',
      configDetail: gitLab,
    }
    if (gitLab === '') {
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
      gitLab: e.target.value,
    })
  }

  render() {
    const { msaState } = this.state
    return (
      <div className="layout-content-btns">
        <div className="title" style={{ marginRight: 0 }}>
          <span>微服务配置</span>
        </div>
        <div className="conten">
          <div className="info">
            <Row className="msa">
              <Col span={6}>基础服务</Col>
              <Col span={8}>
                <Select style={{ width: 300 }} >
                  <Option value="pinpoint">SpringCloud</Option>
                </Select>
              </Col>
            </Row>
            <Row className="msa">
              <Col span={6}>Config Server Gitlab 地址</Col>
              <Col span={18}>
                <Input style={{ width: 300 }} disabled={!this.state.isEdit} className="gitlab" placeholder="请输入 Gitlab 地址（如 https://git.demo.com）" onChange={this.handlechange} />
                {
                  this.state.isEdit ?
                    <Row className="btn_save">
                      <Button className="close" onClick={this.handleClose}>取消</Button>
                      <Button className="save" type="primary" onClick={this.handleClose}>保存</Button>
                    </Row> :
                    <Button className="edit" type="primary" onClick={this.handleEdit}>编辑</Button>
                }
              </Col>
            </Row>
            <Row className="msa">
              <Col span={6}>安装情况</Col>
              <Col span={18}>
                {
                  msaState ?
                    <Row className="install">
                      <Icon className="ico" type="check-circle-o" />&nbsp;
                      <span className="existence" >已安装</span>
                      <sapn className="unload" onClick={this.handleUnload}>卸载</sapn>
                    </Row> :
                    <Button type="primary" onClick={this.handleInstall}>安装</Button>
                }
              </Col>
            </Row>
            <Row className="msa">
              <Col span={6}>组件状态</Col>
              <Col span={18}>
                <span className="desc">健康</span>
              </Col>
            </Row>
            <Row className="msa">
              <Col span={6}>组件版本</Col>
              <Col span={18}>
                <span className="desc">{this.state.version.version}</span>
              </Col>
            </Row>
          </div>
        </div>
        <Modal title="卸载" visible={this.state.uninstall} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>  取 消 </Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}> 继续卸载 </Button>,
          ]}>
          <div className="prompt" style={{ height: 55, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
            <span >即将在当前项目内卸载 SpringCloud 基础服务卸载后改项目内应用，将无法继续使用 微服务 部分功能</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确认继续卸载 ?</span>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { project, cluster } = current.config
  return {
    project,
    cluster,
  }
}

export default connect(mapStateToProps, {
  getMsaState,
  installMsaConfig,
  uninstallMsaConfig,
})(MsaConfig)
