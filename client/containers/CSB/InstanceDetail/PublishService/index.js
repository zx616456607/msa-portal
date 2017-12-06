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
  Form, Steps, Row, Col, Button, Tag,
} from 'antd'
import ClassNames from 'classnames'
import { API_GATEWAY_LIMIT_TYPES } from '../../../../constants'
import AccessAgreement from './AccessAgreement/'
import OpenAgreement from './OpenAgreement'
import ParameterSetting from './ParameterSetting'
import ServiceControl from './ServiceControl'
import './style/index.less'

const Step = Steps.Step

class PublishService extends React.Component {
  state = {
    currentStep: 0,
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
    const fields = form.getFieldsValue()
    const protocol = fields.protocol
    const serviceProtocols = fields.serviceProtocols || []
    const apiGatewayLimitType = fields.apiGatewayLimitType || API_GATEWAY_LIMIT_TYPES[0].key
    let apiGatewayLimitTypeText
    API_GATEWAY_LIMIT_TYPES.every(type => {
      if (type.key === apiGatewayLimitType) {
        apiGatewayLimitTypeText = type.text
        return false
      }
      return true
    })
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
        <Row key="publish-service" type="flex">
          <Col span={17} className="publish-service-left">
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
          <Col span={7} className="publish-service-right">
            <div className="publish-service-detail">
              <div className="publish-service-detail-header">
              发布详情
              </div>
              <div className="publish-service-detail-body">
                <Row className="step-header txt-of-ellipsis">服务接入协议信息</Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    服务名称
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.serviceName}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    服务版本
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.serviceVersion}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    所属服务组
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.serviceGroup}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    服务描述
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.seviceDesc}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    接入协议
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {protocol}
                    </div>
                  </Col>
                </Row>
                {
                  protocol === 'Restful-API'
                    ? [
                      <Row key="endpoint">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          端点
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.endpoint}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="method">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          方法
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.method}
                          </div>
                        </Col>
                      </Row>,
                    ]
                    : [
                      <Row key="wsdlAddress">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          WSDL 地址
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.wsdlAddress}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="namespace">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          命名空间
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.namespace}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="endPointAddress">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          EndPoint 地址
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.endPointAddress}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="bindingName">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          Binding 名称
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.bindingName}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="soapAction">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          SoapAction
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.soapAction}
                          </div>
                        </Col>
                      </Row>,
                      <Row key="methodName">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          方法名称
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.methodName}
                          </div>
                        </Col>
                      </Row>,
                    ]
                }
                <Row className="step-header txt-of-ellipsis">服务开放协议信息</Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    开放接口
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {
                        serviceProtocols.map(_protocol =>
                          <Tag key={_protocol} color="blue">{_protocol}</Tag>
                        )
                      }
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    是否 SSL 加密
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.ssl ? '是' : '否'}
                    </div>
                  </Col>
                </Row>
                {
                  serviceProtocols.indexOf('Restful-API') > -1 &&
                  <Row>
                    <Col span={8}>
                      <div className="field-label txt-of-ellipsis">
                      服务开放地址
                      </div>
                    </Col>
                    <Col span={16}>
                      <div className="field-value txt-of-ellipsis">
                        {fields.restfulPath}
                      </div>
                    </Col>
                  </Row>
                }
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    错误码
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.parameterKeys && fields.parameterKeys.length || 0} 个
                    </div>
                  </Col>
                </Row>
                <Row className="step-header txt-of-ellipsis">服务控制信息</Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    每{apiGatewayLimitTypeText}最大调用量
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.apiGatewayLimit}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    允许不授权访问
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.isPublicVisit ? '允许' : '不允许'}
                    </div>
                  </Col>
                </Row>
                {/* <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    可见域限制
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                    </div>
                  </Col>
                </Row> */}
              </div>
              <div className="desc-text">发布详情如上，确认后点击发布即可</div>
            </div>
          </Col>
        </Row>
      </QueueAnim>
    )
  }
}

export default Form.create()(PublishService)