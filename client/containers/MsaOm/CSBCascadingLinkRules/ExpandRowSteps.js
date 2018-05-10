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
import { Row, Col, Steps, Icon, Tooltip } from 'antd'
import StepIcon from '../../../assets/img/csb/StepIcon.svg'
import './style/ExpandRowSteps.less'
import classNames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

const Step = Steps.Step
const STEP_SIZE = 5
const MESSAGE = '调用链上已删除／停止的实例后的实例中发布的服务将被注销'

class ExpandRowSteps extends React.Component {
  static propTypes = {}

  state = {
    currentStep: 0,
  }

  renderSteps = stepItem => {
    const { currentStep } = this.state
    let isDelete = false
    let deletedIndex
    let mapArry = cloneDeep(stepItem)
    for (let i = 0; i < stepItem.length; i++) {
      if (stepItem[i] === null) {
        isDelete = true
        deletedIndex = i
        break
      }
    }
    isDelete && stepItem.forEach((item, index) => {
      if (item !== null && index > deletedIndex) {
        item.isDeleted = true
      }
      if (item !== null && index < deletedIndex) {
        item.isDeleted = false
      }
    })
    if (stepItem.length > STEP_SIZE) {
      mapArry = stepItem.slice(currentStep, currentStep + STEP_SIZE)
    }
    let shortStepLength = 0
    if (stepItem.length > 0 && stepItem.length < STEP_SIZE) {
      shortStepLength = STEP_SIZE - stepItem.length
    }
    // const shortStepArray = Array.from(new Array(shortStepLength), n => n || 3)
    return <Steps className="steps-row-style">
      {mapArry.map((step, index) => {
        const svgClass = classNames({
          running: true,
          stopped: false,
          deleted: step === null,
          StepIcon: true,
        })
        const StepClass = classNames({
          'short-step-style': index === mapArry.length - 1 && shortStepLength,
          'deleted-instance': step === null,
        })
        if (step === null) {
          return <Step
            key={`delete-${index}`}
            status="finish"
            className={StepClass}
            description={<div>
              <div>实例 未知</div>
              <div>
                已删除
                <Tooltip title={MESSAGE} placement="top">
                  <Icon type="question-circle-o" style={{ marginLeft: 8 }}/>
                </Tooltip>
              </div>
            </div>}
            icon={<svg className={svgClass}>
              <use xlinkHref={`#${StepIcon.id}`}/>
            </svg>}
          />
        }
        return <Step
          key={`${step.id}-${index}`}
          className={StepClass}
          status="finish"
          // title={<span className="step-item-title-content">已授权</span>}
          description={this.renderStepDescription(step)}
          icon={<svg className={svgClass}>
            <use xlinkHref={`#${StepIcon.id}`}/>
          </svg>}
        />
      })}
      {/* {*/}
      {/* shortStepArray.map((item, index) => {*/}
      {/* return <Step*/}
      {/* title={<div className="short-title"></div>}*/}
      {/* icon={<span></span>}*/}
      {/* key={`short-${index}`}*/}
      {/* className="short-step-style"*/}
      {/* />*/}
      {/* })*/}
      {/* }*/}
    </Steps>
  }

  renderStepDescription = step => {
    // const message = '调用链上已删除／停止的实例后的实例中发布的服务将被注销'
    return (
      <div>
        <div>
          <Tooltip title={`实例  ${step.name}`} placement="topLeft">
            <div className="txt-of-ellipsis">{`实例  ${step.name}`}</div>
          </Tooltip>
        </div>
        {/* <div>
          运行中
          <Tooltip title={message} placement="top">
            <Icon type="question-circle-o" style={{ marginLeft: 8 }}/>
          </Tooltip>
        </div> */}
      </div>
    )
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
    const maxStep = stepItem.length - STEP_SIZE
    if (currentStep >= maxStep) return
    this.setState(preState => {
      return { currentStep: preState.currentStep + 1 }
    })
  }

  render() {
    const { stepItem } = this.props
    const { currentStep } = this.state
    if (!stepItem || !stepItem.length) {
      return <div>暂无实例授信</div>
    }
    const stepSize = stepItem.length
    const arrowIconClass = classNames({
      'direction-icon': true,
      'hide-Arrow-icon': stepSize <= STEP_SIZE,
    })
    return (
      <Row id="expand-row-steps-style">
        <Col span={3} className="title-style">链路方向</Col>
        <Col span={21} className="steps-style">
          <Row>
            <Col span={1}>
              { currentStep > 0 && <Icon type="left" className={arrowIconClass} onClick={() => this.subtractStep()}/>}
            </Col>
            <Col span={22}>{this.renderSteps(stepItem)}</Col>
            <Col span={1}>
              { currentStep < stepSize - STEP_SIZE && <Icon type="right" className={arrowIconClass} onClick={() => this.addStep()}/>}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default ExpandRowSteps
