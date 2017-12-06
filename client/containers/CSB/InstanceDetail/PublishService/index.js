/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service
 *
 * 2017-12-04
 * @author zhangpc
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import {
  Form, Steps, Row, Col, Button,
} from 'antd'
import ClassNames from 'classnames'
import AccessAgreement from './AccessAgreement'
import OpenAgreement from './OpenAgreement'
import ParameterSetting from './ParameterSetting'
import ServiceControl from './ServiceControl'
import './style/index.less'

const Step = Steps.Step

class PublishService extends React.Component {
  state = {
    currentStep: 2,
  }

  validateFieldsAndGoNext = currentStep => {
    const { form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll(errors => {
      if (errors) {
        return
      }
      this.setState({ currentStep })
    })
  }

  renderSteps = () => {
    const { history } = this.props
    const { currentStep } = this.state
    if (currentStep === 0) {
      return [
        <Button key="cancel" onClick={() => history.goBack(-1)}>取 消</Button>,
        <Button
          type="primary"
          key="next"
          onClick={this.validateFieldsAndGoNext.bind(this, 1)}
        >
        下一步
        </Button>,
      ]
    }
    if (currentStep === 1) {
      return [
        <Button
          key="previous"
          onClick={() => this.setState({ currentStep: 0 })}
        >
        上一步
        </Button>,
        <Button
          type="primary"
          key="next"
          onClick={this.validateFieldsAndGoNext.bind(this, 2)}
        >
        下一步
        </Button>,
      ]
    }
    if (currentStep === 2) {
      return [
        <Button
          key="previous"
          onClick={() => this.setState({ currentStep: 1 })}
        >
        上一步
        </Button>,
        <Button
          type="primary"
          key="submit"
          onClick={this.submitService}
        >
        发 布
        </Button>,
      ]
    }
  }

  submitService = () => {
    const { form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      console.log(values)
    })
  }

  render() {
    const { form } = this.props
    const { currentStep } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const stepOneClassNames = ClassNames({
      hide: currentStep !== 0,
    })
    const stepTwoClassNames = ClassNames({
      hide: currentStep !== 1,
    })
    const stepThreeClassNames = ClassNames({
      hide: currentStep !== 2,
    })
    return (
      <QueueAnim className="publish-service">
        <Row key="publish-service">
          <Col span={18}>
            <div className="publish-service-steps">
              <Steps size="small" current={currentStep}>
                <Step title="选择协议" />
                <Step title="参数设定" />
                <Step title="服务控制" />
              </Steps>
            </div>
            <Form className="publish-service-body">
              <div className="fields">
                <AccessAgreement
                  className={stepOneClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                />
                <OpenAgreement
                  className={stepOneClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                />
                <ParameterSetting
                  className={stepTwoClassNames}
                  form={form}
                />
                <ServiceControl
                  className={stepThreeClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                />
              </div>
              <div className="btns">
                {this.renderSteps()}
              </div>
            </Form>
          </Col>
          <Col span={6}>
            <div className="publish-service-detail">
              <div className="publish-service-detail-header">
              发布详情
              </div>
              <div className="publish-service-detail-body">
              hhh
              </div>
            </div>
          </Col>
        </Row>
      </QueueAnim>
    )
  }
}

export default Form.create()(PublishService)
