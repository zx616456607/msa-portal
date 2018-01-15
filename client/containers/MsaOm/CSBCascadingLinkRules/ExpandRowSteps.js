/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Expand Row Steps Component
 *
 * 2018-1-11
 * @author zhangcz
 */

import React from 'react'
// import propTypes from 'prop-types'
import { Row, Col, Steps, Icon } from 'antd'
import StepIcon from '../../../assets/img/csb/StepIcon.svg'
import './style/ExpandRowSteps.less'
import classNames from 'classnames'

const Step = Steps.Step

class ExpandRowSteps extends React.Component {
  static propTypes = {}

  state = {
    currentStep: 0,
  }

  renderSteps = stepItem => {
    const { currentStep } = this.state
    let mapArry = stepItem
    if (stepItem.length > 6) {
      mapArry = stepItem.slice(currentStep, currentStep + 6)
    }
    let shortStepLength = 0
    if (stepItem.length > 0 && stepItem.length < 6) {
      shortStepLength = 6 - stepItem.length
    }
    const shortStepArray = Array.from(new Array(shortStepLength), n => n || 3)
    return <Steps className="steps-row-style">
      {mapArry.map((step, index) => {
        const lastStepClass = classNames({
          'short-step-style': index === mapArry.length - 1 && shortStepLength,
        })
        return <Step
          key={step}
          className={lastStepClass}
          status="finish"
          // title={<span className="step-item-title-content">已授权</span>}
          description="实例a"
          icon={<svg className="StepIcon">
            <use xlinkHref={`#${StepIcon.id}`}/>
          </svg>}/>
      })}
      {
        shortStepArray.map((item, index) => {
          return <Step
            title={<div className="short-title"></div>}
            icon={<span></span>}
            key={`short-${index}`}
            className="short-step-style"
          />
        })
      }
    </Steps>
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
    const { stepItem } = this.props
    if (!stepItem) {
      return <div>暂无实例授信</div>
    }
    const stepSize = stepItem.length
    const arrowIconClass = classNames({
      'direction-icon': true,
      'hide-Arrow-icon': stepSize <= 6,
    })
    return (
      <Row id="expand-row-steps-style">
        <Col span={4} className="title-style">实例授信</Col>
        <Col span={20} className="steps-style">
          <Row>
            <Col span={1}>
              <Icon type="left" className={arrowIconClass} onClick={() => this.subtractStep()}/>
            </Col>
            <Col span={22}>{this.renderSteps(stepItem)}</Col>
            <Col span={1}>
              <Icon type="right" className={arrowIconClass} onClick={() => this.addStep()}/>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default ExpandRowSteps
