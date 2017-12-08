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
import {
  Form, Input, Radio, Select, Button, Modal,
} from 'antd'
import ClassNames from 'classnames'
import SecurityHeaderModal from './SecurityHeaderModal'
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

export default class AccessAgreement extends React.Component {
  state = {
    checkWSDLModalVisible: false,
    pingLoading: false,
    securityHeaderModalVisible: false,
  }

  render() {
    const { formItemLayout, form, className } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const protocol = getFieldValue('protocol')
    const classNames = ClassNames({
      'access-agreement': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <div className="second-title">服务接入协议配置</div>
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
        {
          (!protocol || protocol === 'Restful-API') &&
          [
            <FormItem
              {...formItemLayout}
              label="端点"
              key="endpoint"
              className="publish-service-body-endpoint"
            >
              {getFieldDecorator('endpoint', {
                rules: [{
                  required: true, message: 'Please input endpoint!',
                }],
              })(
                <Input placeholder="请提供接入服务的基础 URL" />
              )}
              <Button
                className="right-btn"
                loading={this.state.pingLoading}
                onClick={() => this.setState({ pingLoading: true })}
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
