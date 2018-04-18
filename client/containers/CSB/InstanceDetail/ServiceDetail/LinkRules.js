/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Link Rules Component
 *
 * 2018-1-15
 * @author zhangcz
 */

import React from 'react'
// import propTypes from 'prop-types'
import './style/LinkRules.less'
import {
  Steps, Row, Col, Icon, Timeline,
  Tooltip, Spin,
} from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { getServiceCascadedInfo } from '../../../../actions/CSB/instanceService'
import { formatDate } from '../../../../common/utils'

const Step = Steps.Step
const STEP_SIZE = 4

class LinkRules extends React.Component {
  static propTypes = {}
  state = {
    onlyShowFiveLogs: true,
    currentStep: 0,
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = () => {
    const { getServiceCascadedInfo, detail, currentInstance } = this.props
    const { instance } = currentInstance
    const { clusterId } = instance
    const { name, version } = detail
    getServiceCascadedInfo(clusterId, name, version)
  }

  reloadHandler = () => {}

  rollbackHandler = () => {}

  renderStepIcon = detail => {
    const { instanceId } = this.props
    const { status = 3, id } = detail || {}
    const intStatus = parseInt(status)
    let instanceStatus
    switch (intStatus) {
      case 0: instanceStatus = '已停止'; break
      case 1: instanceStatus = '运行中'; break
      case 2: instanceStatus = '启动中'; break
      case 3: instanceStatus = '已注销'; break
      default: instanceStatus = '未知'; break
    }
    const iconClass = classNames({
      'icon-style': true,
      'current-active': instanceId === id,
      'current-stop': intStatus === 0,
      'current-cancel': intStatus === 3,
    })
    return (
      <div className={iconClass}>
        <div className="top-style">接入/开放端</div>
        <div className="status-style">({instanceStatus})</div>
      </div>
    )
  }

  renderLinkRulesStatusSteps = instances => {
    const { instanceId } = this.props
    const { currentStep } = this.state
    let showInstancesList = instances
    if (instances.length > 4) {
      showInstancesList = instances.splice(currentStep, currentStep + 4)
    }
    return (
      <Steps>
        {showInstancesList.map((item, index) => {
          const { status, id, name } = item || {}
          const iconClass = classNames({
            'active-style': parseInt(status) === 1,
            'stop-style': parseInt(status) === 0,
            'cancel-style': parseInt(status) === 2,
            'common-style': true,
          })
          const descClass = classNames({
            'font-color': instanceId === id,
          })
          const deletedInstance = (
            <span>
              <span>已删除</span>
              <Tooltip title="调用链上已删除／停止的实例后的实例中发布的服务将被注销" placement="top">
                <Icon type="question-circle-o" className="deleted-tips"/>
              </Tooltip>
            </span>
          )
          return <Step
            key={id ? id : `${item}-${index}`}
            icon={this.renderStepIcon(item)}
            title={<span className={descClass}>{name ? name : deletedInstance}</span>}
            description={<span>{ instanceId === id ? '当前实例' : null }</span>}
            className={iconClass}
          />
        })}
      </Steps>
    )
  }

  renderTimeLineItem = events => {
    const { onlyShowFiveLogs } = this.state
    let mapArray = events
    if (events.length > 5 && onlyShowFiveLogs) {
      mapArray = events.slice(0, 5)
    }
    return mapArray.map(item => {
      return (
        <Timeline.Item
          key={item.id}
        >
          <Row>
            <Col span={16}>
              {item.event}
              {item.error && <Tooltip title="由于网络原因，导致注销操作执行到实例b时失效" placement="top">
                <Icon type="question-circle-o" className="margin-style color-style"/>
              </Tooltip>}
            </Col>
            <Col span={3}>
              {item.error && [ <Tooltip title="撤销注销" placement="top" key="cancel">
                <Icon type="rollback" onClick={() => this.rollbackHandler()}/>
              </Tooltip>,
              <Tooltip title="重试注销" placement="top" key="reload">
                <Icon type="reload" className="margin-style" onClick={() => this.reloadHandler()}/>
              </Tooltip> ]}
            </Col>
            <Col span={5}>{formatDate(item.updateTime)}</Col>
          </Row>
        </Timeline.Item>
      )
    })
  }

  renderAllEventLogButton = events => {
    const { onlyShowFiveLogs } = this.state
    if (events.length <= 5) {
      return null
    }
    if (events.length > 5 && !onlyShowFiveLogs) {
      return <div className="show-all"
        onClick={() => this.setState({ onlyShowFiveLogs: true })}
      >收起</div>
    }
    if (events.length > 5 && onlyShowFiveLogs) {
      return <div className="show-all"
        onClick={() => this.setState({ onlyShowFiveLogs: false })}
      >显示全部</div>
    }
    return null
  }

  subtractStep = () => {
    const { currentStep } = this.state
    if (currentStep === 0) return
    this.setState(preState => {
      return { currentStep: preState.currentStep - 1 }
    })
  }

  addStep = instances => {
    const { currentStep } = this.state
    const maxStep = instances.length - STEP_SIZE
    if (currentStep >= maxStep) return
    this.setState(preState => {
      return { currentStep: preState.currentStep + 1 }
    })
  }

  render() {
    const { detail, serviceCascadedInfo } = this.props
    const { currentStep } = this.state
    const { name } = detail
    const currentService = serviceCascadedInfo[name] || { isFetching: true }
    const { isFetching, result } = currentService
    if (isFetching) {
      return <div><Spin /></div>
    }
    const { instances = [], recordCascadedServiceEvents = [] } = result
    return (
      <div id="link-rules-style">
        <div className="status">
          <div className="second-title">级联服务链路状态</div>
          <div>链路名称：xxxxx</div>
          <Row className="status-step-container">
            <Col span={1}>
              {(instances.length > 4 || currentStep !== 0) && <Icon type="left" onClick={this.subtractStep}/>}
            </Col>
            <Col span={22}>{this.renderLinkRulesStatusSteps(instances)}</Col>
            <Col span={1}>
              {(instances.length > 4 && instances.length - currentStep <= 4) && <Icon type="right" onClick={() => this.addStep(instances)}/>}
            </Col>
          </Row>
        </div>
        <div className="event">
          <div className="second-title">
            级联服务事件
            <span className="tips">保留一个月内的操作事件</span>
          </div>
          <div className="log-container">
            <Timeline>
              {this.renderTimeLineItem(recordCascadedServiceEvents)}
            </Timeline>
            {this.renderAllEventLogButton(recordCascadedServiceEvents)}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities, CSB } = state
  const { csbAvaInstances } = entities
  const { instanceId } = ownProps
  const currentInstance = csbAvaInstances[instanceId]
  const { serviceCascadedInfo } = CSB
  return {
    currentInstance,
    serviceCascadedInfo,
  }
}

export default connect(mapStateToProps, {
  getServiceCascadedInfo,
})(LinkRules)
