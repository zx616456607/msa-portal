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
  Form, Steps, Row, Col, Tag, Tooltip
} from 'antd'
import ClassNames from 'classnames'
import { API_GATEWAY_LIMIT_TYPES } from '../../../../constants'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { renderOAuth2Type } from '../../../../components/utils'
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
  serviceGroupsSlt,
} from '../../../../selectors/CSB/instanceService/group'
import './style/index.less'

const Step = Steps.Step

class PublishService extends React.Component {
  state = {
    isEdit: '',
    serviceId: '',
    dataList: {},
    currentStep: 0,
    confirmLoading: false,
  }

  componentWillMount() {
    this.fetchEditData()
  }

  fetchEditData() {
    const queryAry = this.props.location.search.split('&')
    if (queryAry[0] !== '') {
      if (queryAry[1].split('=')[1] === 'true') {
        const { publishData } = this.props
        const publishAry = publishData[queryAry[0].split('=')[1]]
        this.setState({
          dataList: publishAry,
          isEdit: queryAry[1].split('=')[1],
          serviceId: queryAry[0].split('=')[1],
        })
      }
    }
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

  changeStep = currentStep => {
    this.setState({ currentStep })
  }

  render() {
    const {
      serviceGroups, form, instanceID, csbInstanceServiceGroups,
      servicesInbounds, history, currentInstance,
    } = this.props
    const { content } = serviceGroups
    const { currentStep, dataList, isEdit, serviceId } = this.state
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
    const openProtocol = fields.openProtocol
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
              <Step1
                className={stepOneClassNames}
                currentStep={currentStep}
                history={history}
                form={form}
                formItemLayout={formItemLayout}
                instanceID={instanceID}
                currentInstance={currentInstance}
                servicesInbounds={servicesInbounds}
                serviceGroups={content || []}
                changeStep={this.changeStep}
                data={dataList}
                isEdit={isEdit}
              />
              <Step2
                className={stepTwoClassNames}
                currentStep={currentStep}
                form={form}
                formItemLayout={formItemLayout}
                instanceID={instanceID}
                changeStep={this.changeStep}
                data={dataList}
              />
              <Step3
                className={stepThreeClassNames}
                currentStep={currentStep}
                history={history}
                form={form}
                formItemLayout={formItemLayout}
                instanceID={instanceID}
                changeStep={this.changeStep}
                data={dataList}
                isEdit={isEdit}
                serviceId={serviceId}
              />
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
                      <Row key="bindingName" className={ClassNames({ hide: openProtocol === 'soap' })}>
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
                      <Row key="methodName" className={ClassNames({ hide: openProtocol === 'soap' })}>
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
                      <Tag key={openProtocol} color="blue">
                        {transformCSBProtocols(openProtocol)}
                      </Tag>
                    </div>
                  </Col>
                </Row>
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
                      开放地址
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.openUrl}
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
                        && csbInstanceServiceGroups[fields.groupId].name ||
                        fields.groupId
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
                    <Tooltip title={'是否 SSL 加密'}>
                      <div className="field-label txt-of-ellipsis">
                        是否 SSL 加密
                      </div>
                    </Tooltip>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.ssl ? '是' : '否'}
                    </div>
                  </Col>
                </Row>
                {
                  /* openProtocol.indexOf('rest') > -1 &&
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
                      {fields.errCodeKeys && fields.errCodeKeys.length || 0} 个
                    </div>
                  </Col>
                </Row>
                <Row className="step-header txt-of-ellipsis">服务控制信息</Row>
                <Row>
                  <Col span={8}>
                    <Tooltip title={`每${apiGatewayLimitTypeText}最大调用量`}>
                      <div className="field-label txt-of-ellipsis">
                        每{apiGatewayLimitTypeText}最大调用量
                      </div>
                    </Tooltip>
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
                    <Tooltip title={'XML 元素名称长度'}>
                      <div className="field-label txt-of-ellipsis">
                        XML 元素名称长度
                      </div>
                    </Tooltip>
                  </Col>
                  <Col span={16}>
                    <Tooltip title={`最长 ${fields.maxElementNameLength} 位`}>
                      <div className="field-value txt-of-ellipsis">
                        最长 {fields.maxElementNameLength} 位
                      </div>
                    </Tooltip>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Tooltip title={'XML 各元素属性数量'}>
                      <div className="field-label txt-of-ellipsis">
                        XML 各元素属性数量
                      </div>
                    </Tooltip>
                  </Col>
                  <Col span={16}>
                    <Tooltip title={`最多 ${fields.maxAttibuteCount} 个`}>
                      <div className="field-value txt-of-ellipsis">
                        最多 {fields.maxAttibuteCount} 个
                      </div>
                    </Tooltip>
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
                    <Tooltip title={'允许不授权访问'}>
                      <div className="field-label txt-of-ellipsis">
                        允许不授权访问
                      </div>
                    </Tooltip>
                  </Col>
                  <Col span={16}>
                    <div className="field-value txt-of-ellipsis">
                      {fields.accessible ? '允许' : '不允许'}
                    </div>
                  </Col>
                </Row>
                {
                  fields.openOAuth &&
                  <Row>
                    <Col span={8}>
                      <div className="field-label txt-of-ellipsis">
                        OAuth 授权
                      </div>
                    </Col>
                    <Col span={16}>
                      <div className="field-value txt-of-ellipsis">
                        {renderOAuth2Type(fields.oauth2Type)}
                      </div>
                    </Col>
                  </Row>
                }
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
  const { entities, CSB } = state
  const { csbAvaInstances, csbInstanceServiceGroups } = entities
  const { match } = ownProps
  const { instanceID } = match.params
  const { servicesInbounds } = CSB
  const publishData = entities.cbsPublished
  return {
    publishData,
    csbInstanceServiceGroups,
    servicesInbounds: servicesInbounds && servicesInbounds[instanceID] || {},
    instanceID,
    serviceGroups: serviceGroupsSlt(state),
    currentInstance: csbAvaInstances && csbAvaInstances[instanceID],
  }
}

export default connect(mapStateToProps, {
  getGroups,
  getInstanceServiceInbounds,
})(Form.create()(PublishService))
