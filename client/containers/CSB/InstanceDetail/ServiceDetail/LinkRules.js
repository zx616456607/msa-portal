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
  Tooltip,
} from 'antd'
import classNames from 'classnames'

const Step = Steps.Step

class LinkRules extends React.Component {
  static propTypes = {}
  state = {
    onlyShowFiveLogs: true,
    currentStep: 0,
  }

  reloadHandler = () => {}

  rollbackHandler = () => {}

  renderStepIcon = detail => {
    const { status } = detail
    let instanceStatus = '已激活'
    switch (status % 3) {
      case 0: instanceStatus = '已激活'; break
      case 1: instanceStatus = '已停止'; break
      case 2: instanceStatus = '已注销'; break
      default: instanceStatus = '未知'; break
    }
    const iconClass = classNames({
      'icon-style': true,
      'current-active': true,
      'current-stop': false,
      'current-cancel': false,
    })
    return (
      <div className={iconClass}>
        <div className="top-style">接入/开放端</div>
        <div className="status-style">({instanceStatus})</div>
      </div>
    )
  }

  renderLinkRulesStatusSteps = () => {
    const array = []
    for (let i = 0; i < 4; i++) {
      const item = {
        key: i,
        instance: '实例a',
        status: i,
      }
      array.push(item)
    }
    return (
      <Steps>
        {array.map(item => {
          const { status } = item
          const iconClass = classNames({
            'active-style': status % 3 === 0,
            'stop-style': status % 3 === 1,
            'cancel-style': status % 3 === 2,
            'common-style': true,
          })
          return <Step
            key={item.key}
            icon={this.renderStepIcon(item)}
            title={item.instance}
            description={<span>当前实例</span>}
            className={iconClass}
          />
        })}
      </Steps>
    )
  }

  renderTimeLineItem = () => {
    const { onlyShowFiveLogs } = this.state
    const array = []
    for (let i = 0; i < 20; i++) {
      const item = {
        key: i,
        message: 'hello',
      }
      array.push(item)
    }
    let mapArray = array
    if (array.length > 5 && onlyShowFiveLogs) {
      mapArray = array.slice(0, 5)
    }
    return mapArray.map(item => {
      return (
        <Timeline.Item
          key={item.key}
        >
          <Row>
            <Col span={19}>
              {item.message}
              <Tooltip title="由于网络原因，导致注销操作执行到实例b时失效" placement="top">
                <Icon type="question-circle-o" className="margin-style color-style"/>
              </Tooltip>
            </Col>
            <Col span={3}>
              <Tooltip title="撤销注销" placement="top">
                <Icon type="rollback" onClick={() => this.rollbackHandler()} />
              </Tooltip>
              <Tooltip title="重试注销" placement="top">
                <Icon type="reload" className="margin-style" onClick={() => this.reloadHandler()}/>
              </Tooltip>
            </Col>
            <Col span={2}>11-08</Col>
          </Row>
        </Timeline.Item>
      )
    })
  }

  renderAllEventLogButton = () => {
    const { onlyShowFiveLogs } = this.state
    const length = 7
    if (length <= 5 || !onlyShowFiveLogs) {
      return null
    }
    return <div className="show-all"
      onClick={() => this.setState({ onlyShowFiveLogs: false })}
    >显示全部</div>
  }

  subtractStep = () => {
    const { currentStep } = this.state
    if (currentStep === 0) return
    this.setState(preState => {
      return { currentStep: preState.currentStep - 1 }
    })
  }

  addStep = () => {
    const { currentStep } = this.state
    const { stepItem } = this.props
    const maxStep = stepItem.length - 6
    if (currentStep >= maxStep) return
    this.setState(preState => {
      return { currentStep: preState.currentStep + 1 }
    })
  }

  render() {
    return (
      <div id="link-rules-style">
        <div className="status">
          <div className="second-title">级联服务链路状态</div>
          <div>链路名称：xxxxx</div>
          <Row className="status-step-container">
            <Col span={1}>
              <Icon type="left" />
            </Col>
            <Col span={22}>{this.renderLinkRulesStatusSteps()}</Col>
            <Col span={1}>
              <Icon type="right" />
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
              {this.renderTimeLineItem()}
            </Timeline>
            {this.renderAllEventLogButton()}
          </div>
        </div>
      </div>
    )
  }
}

export default LinkRules
