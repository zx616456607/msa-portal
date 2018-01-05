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
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
  Form, Steps, Row, Col, Button, Tag, notification,
} from 'antd'
import ClassNames from 'classnames'
import { API_GATEWAY_LIMIT_TYPES } from '../../../../constants'
import AccessAgreement from './AccessAgreement/'
import OpenAgreement from './OpenAgreement'
import ParameterSetting from './ParameterSetting'
import ServiceControl from './ServiceControl'
import {
  transformCSBProtocols,
} from '../../../../common/utils'
import {
  getInstanceServiceInbounds,
} from '../../../../actions/CSB/instance'
import {
  getGroups,
} from '../../../../actions/CSB/instanceService/group'
import {
  createService,
} from '../../../../actions/CSB/instanceService'
import {
  serviceGroupsSlt,
} from '../../../../selectors/CSB/instanceService/group'
import './style/index.less'

const SECONDS_CONVERSION = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
}
const Step = Steps.Step

class PublishService extends React.Component {
  state = {
    currentStep: 0,
    confirmLoading: false,
  }

  componentDidMount() {
    this.loadServiceGroups()
    this.loadInstanceServiceInbound()
  }

  loadServiceGroups = () => {
    const { getGroups, instanceID } = this.props
    getGroups(instanceID, { size: 2000 })
  }

  loadInstanceServiceInbound = () => {
    const { getInstanceServiceInbounds, instanceID } = this.props
    getInstanceServiceInbounds(instanceID)
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
    const { currentStep, confirmLoading } = this.state
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
          loading={confirmLoading}
        >
        发 布
        </Button>,
      ]
    }
  }

  submitService = () => {
    const { form, createService, instanceID, history } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true,
      })
      const {
        protocol,
        apiGatewayLimit,
        apiGatewayLimitType,
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
      } = values
      // 流量控制
      let limitationType = 'no_limitation'
      let limitationDetail = {}
      if (apiGatewayLimit > 0) {
        limitationType = 'rate_limitation'
        limitationDetail = {
          limit: apiGatewayLimit,
          duration: `PT${SECONDS_CONVERSION[apiGatewayLimitType]}S`,
        }
      }
      // 防止XML攻击
      const xmlProtectionType = 'definition'
      const xmlProtectionDetail = {
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
      }
      const body = [
        {
          name: values.name,
          version: values.version,
          description: values.description,
          type: values.type,
          inboundId: values.inboundId,
          accessible: values.accessible,
          targetType: protocol === 'rest' ? 'url' : 'wsdl',
          targetDetail: values.targetDetail,
          transformationType: 'direct',
          transformationDetail: '{}',
          authenticationType: 'bypass',
          authenticationDetail: '{}',
          limitationType,
          limitationDetail: JSON.stringify(limitationDetail),
          xmlProtectionType,
          xmlProtectionDetail: JSON.stringify(xmlProtectionDetail),
          groupId: parseInt(values.groupId),
        },
      ]
      createService(instanceID, body).then(res => {
        this.setState({
          confirmLoading: false,
        })
        if (res.error) {
          return
        }
        notification.success({
          message: '创建服务成功',
        })
        history.push(`/csb-instances-available/${instanceID}/my-published-services`)
      })
    })
  }

  render() {
    const {
      serviceGroups, form, instanceID, csbInstanceServiceGroups,
      servicesInbounds,
    } = this.props
    const { content } = serviceGroups
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
    const serviceProtocol = fields.serviceProtocol || []
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
                  instanceID={instanceID}
                  servicesInbounds={servicesInbounds}
                />
                <OpenAgreement
                  className={stepOneClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                  serviceGroups={content || []}
                  instanceID={instanceID}
                />
                <ParameterSetting
                  className={stepTwoClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                  instanceID={instanceID}
                />
                <ServiceControl
                  className={stepThreeClassNames}
                  form={form}
                  formItemLayout={formItemLayout}
                  instanceID={instanceID}
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
                      {fields.name}
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
                      {fields.version}
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
                      {
                        csbInstanceServiceGroups
                        && csbInstanceServiceGroups[fields.groupId]
                        && csbInstanceServiceGroups[fields.groupId].name
                      }
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
                      {fields.description}
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
                      {transformCSBProtocols(protocol)}
                    </div>
                  </Col>
                </Row>
                {
                  (!protocol || protocol === 'rest')
                    ? [
                      <Row key="endpoint">
                        <Col span={8}>
                          <div className="field-label txt-of-ellipsis">
                          端点
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="field-value txt-of-ellipsis">
                            {fields.targetDetail}
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
                      <Tag key={serviceProtocol} color="blue">
                        {transformCSBProtocols(serviceProtocol)}
                      </Tag>
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
                  /* serviceProtocol.indexOf('rest') > -1 &&
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
                  </Row> */
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
                      {
                        fields.apiGatewayLimit === 0
                          ? '无限制'
                          : fields.apiGatewayLimit
                      }
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    XML 元素名称长度
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                    最长 {fields.maxElementNameLength} 位
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    XML 各元素属性数量
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                    最多 {fields.maxAttibuteCount} 个
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div className="field-label txt-of-ellipsis">
                    移除 DTDs
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.removeDTD ? '开启' : '关闭'}
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
                      {fields.accessible ? '允许' : '不允许'}
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

const mapStateToProps = (state, ownProps) => {
  const { csbInstanceServiceGroups } = state.entities
  const { servicesInbounds } = state.CSB
  const { match } = ownProps
  const { instanceID } = match.params
  return {
    csbInstanceServiceGroups,
    servicesInbounds: servicesInbounds && servicesInbounds[instanceID] || {},
    instanceID,
    serviceGroups: serviceGroupsSlt(state),
  }
}

export default connect(mapStateToProps, {
  getGroups,
  createService,
  getInstanceServiceInbounds,
})(Form.create()(PublishService))
