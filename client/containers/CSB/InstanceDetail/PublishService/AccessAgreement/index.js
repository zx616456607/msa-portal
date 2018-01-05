/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: access agreement
 *
 * 2017-12-04
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Input, Radio, Select, Button, Modal, Switch,
} from 'antd'
import ClassNames from 'classnames'
import SecurityHeaderModal from './SecurityHeaderModal'
import {
  URL_REG,
} from '../../../../../constants'
import {
  pingService,
} from '../../../../../actions/CSB/instanceService'
import './style/index.less'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

const ENDPOINT_METHODS = [ 'GET', 'POST', 'PUT', 'DELETE' ]
const ENDPOINT_REQUEST_TYPE = [ 'HTTP', 'JSON' ]
const ENDPOINT_RESPONSE_TYPE = [
  {
    key: 'penetrate',
    text: '透传',
  },
]

class AccessAgreement extends React.Component {
  state = {
    checkWSDLModalVisible: false,
    pingLoading: false,
    securityHeaderModalVisible: false,
    pingSuccess: null,
  }

  ping = () => {
    const { instanceID, pingService, form } = this.props
    form.validateFields([ 'targetDetail' ], (err, values) => {
      if (err) {
        return
      }
      this.setState({
        pingLoading: true,
        pingSuccess: null,
      })
      pingService(instanceID, { url: values.targetDetail }).then(res => {
        this.setState({ pingLoading: false })
        if (res.error) {
          this.setState({ pingSuccess: false })
          return
        }
        this.setState({ pingSuccess: true })
      })
    })
  }

  getPingBtnIcon = () => {
    const { pingSuccess } = this.state
    switch (pingSuccess) {
      case true:
        return 'check-circle-o'
      case false:
        return 'exclamation-circle-o'
      default:
        return 'rocket'
    }
  }

  render() {
    const { formItemLayout, form, className } = this.props
    const { pingSuccess } = this.state
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form
    const protocol = getFieldValue('protocol')
    const classNames = ClassNames({
      'access-agreement': true,
      [className]: !!className,
    })
    const pingBtnClassNames = ClassNames({
      'right-btn': true,
      success: pingSuccess === true,
      failed: pingSuccess === false,
    })
    const ssl = getFieldValue('ssl')
    const openUrlBefore = `${ssl ? 'https' : 'http'}://csb-service-host:8086/`
    getFieldDecorator('openUrlBefore', {
      initialValue: openUrlBefore,
    })
    return (
      <div className={classNames}>
        <div className="second-title">选择协议</div>
        <FormItem
          {...formItemLayout}
          label="选择一个接入协议"
        >
          {getFieldDecorator('protocol', {
            initialValue: 'Restful-API',
            rules: [{
              required: true, message: 'Please input protocol!',
            }],
          })(
            <RadioGroup>
              <RadioButton value="Restful-API">Restful-API</RadioButton>
              <RadioButton value="WebService">WebService</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="选择服务开放接口"
          className="service-protocols"
        >
          {getFieldDecorator('serviceProtocol', {
            initialValue: 'Restful-API',
            rules: [{
              required: true,
              message: '选择协议类型!',
            }],
            onChange: e => {
              let openUrl
              if (e.target.value === 'Restful-API') {
                openUrl = openUrlBefore
              }
              setFieldsValue({
                openUrl,
              })
            },
          })(
            <RadioGroup>
              <Radio value="Restful-API">Restful-API</Radio>
              <Radio value="WebService">WebService</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="SSL 加密"
          className="service-ssl"
        >
          {getFieldDecorator('ssl', {
            valuePropName: 'checked',
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">开启后将提高 API 访问的安全性</span>
        </FormItem>
        {
          (!protocol || protocol === 'Restful-API') &&
          [
            <FormItem
              {...formItemLayout}
              label="端点"
              key="endpoint"
              className="publish-service-body-endpoint"
            >
              {getFieldDecorator('targetDetail', {
                rules: [{
                  required: true,
                  whitespace: true,
                  pattern: URL_REG,
                  message: '请填写正确的服务地址',
                }],
              })(
                <Input placeholder="请提供接入服务的基础 URL" />
              )}
              <Button
                className={pingBtnClassNames}
                icon={this.getPingBtnIcon()}
                loading={this.state.pingLoading}
                onClick={this.ping}
              >
              测试连接
              </Button>
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="方法"
              key="method"
            >
              {getFieldDecorator('method', {
                rules: [{
                  required: true, message: 'Please input method!',
                }],
              })(
                <Select placeholder="请选择方法">
                  {
                    ENDPOINT_METHODS.map(method => <Option key={method}>{method}</Option>)
                  }
                </Select>
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="请求格式"
              key="requestType"
            >
              {getFieldDecorator('requestType')(
                <Select placeholder="请选择请求格式">
                  {
                    ENDPOINT_REQUEST_TYPE.map(type => <Option key={type}>{type}</Option>)
                  }
                </Select>
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="响应格式"
              key="responseType"
            >
              {getFieldDecorator('responseType')(
                <Select placeholder="请选择响应格式">
                  {
                    ENDPOINT_RESPONSE_TYPE.map(({ key, text }) =>
                      <Option key={key}>{text}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>,
          ]
        }
        {
          protocol === 'WebService' &&
          [
            <FormItem
              {...formItemLayout}
              label="WSDL 地址"
              key="wsdlAddress"
              className="publish-service-body-wsdl-address"
            >
              {getFieldDecorator('wsdlAddress', {
                rules: [{
                  required: true, message: 'Please input wsdlAddress!',
                }],
              })(
                <Input placeholder="请提供地址" />
              )}
              <Button
                className="right-btn"
                onClick={() => this.setState({ checkWSDLModalVisible: true })}
              >
              本地 WSDL
              </Button>
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="命名空间"
              key="namespace"
            >
              {getFieldDecorator('namespace', {
                rules: [{
                  required: true, message: 'Please input namespace!',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="EndPoint 地址"
              key="endPointAddress"
            >
              {getFieldDecorator('endPointAddress', {
                rules: [{
                  required: true, message: 'Please input endPointAddress!',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="Binding 名称"
              key="bindingName"
            >
              {getFieldDecorator('bindingName', {
                rules: [{
                  required: true, message: 'Please input bindingName!',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="SoapAction"
              key="soapAction"
            >
              {getFieldDecorator('soapAction', {
                rules: [{
                  required: true, message: 'Please input soapAction!',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="方法名称"
              key="methodName"
            >
              {getFieldDecorator('methodName', {
                rules: [{
                  required: true, message: 'Please input methodName!',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="安全头定制"
              key="security-head-customization"
            >
              <Button
                onClick={() => this.setState({ securityHeaderModalVisible: true })}
              >
              点击定制
              </Button>
            </FormItem>,
          ]
        }
        <Modal
          title="检测 WSDL"
          visible={this.state.checkWSDLModalVisible}
          onCancel={() => this.setState({ checkWSDLModalVisible: false })}
        >
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label="内容"
          >
            <Input.TextArea />
          </FormItem>
        </Modal>
        {
          protocol === 'WebService' &&
          <SecurityHeaderModal
            visible={this.state.securityHeaderModalVisible}
            formItemLayout={formItemLayout}
            form={form}
            onCancel={() => this.setState({ securityHeaderModalVisible: false })}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  pingService,
})(Form.create()(AccessAgreement))
