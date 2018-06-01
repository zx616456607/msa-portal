/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: service control
 *
 * 2017-12-05
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import {
  Form, InputNumber, Select, Switch, Icon, Tooltip, Row, Col, Radio, Input,
} from 'antd'
import isEmpty from 'lodash/isEmpty'
import { API_GATEWAY_LIMIT_TYPES, URL_REG } from '../../../../../constants'
import './style/Control.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class Control extends React.Component {
  renderOAuthServerDesc = () => {
    const { form } = this.props
    const { getFieldValue } = form
    const oauth2Type = getFieldValue('oauth2Type')
    switch (oauth2Type) {
      case 'github':
        return <div className="desc-text">
          选择 GitHub 作为第三方授权服务中心，需提供在 GitHub 注册生成的 Client ID
          和 Client Secret ，点击
          <a href="https://github.com/settings/applications/new" rel="noopener noreferrer" target="_blank">
            去注册
          </a>。
        </div>
      case 'google':
        return <div className="desc-text">
          选择 Google 作为第三方授权服务中心，需提供在 Google 注册生成的 Client ID
          和 Client Secret ，点击
          <a href="https://console.developers.google.com/start" rel="noopener noreferrer" target="_blank">
            去注册
          </a>。
        </div>
      case 'customer':
        return <div className="desc-text">
          选择自定义的授权服务中心，需提供以下参数：
        </div>
      default:
        break
    }
  }

  renderText = () => {
    const { getFieldValue } = this.props.form
    const authenticationType = getFieldValue('authenticationType')
    switch (authenticationType) {
      case 'aksk':
        return '需使用消费凭证订阅后，方可调用'
      case 'bypass':
        return '此服务无任何访问控制，可直接访问'
      case 'oauth2':
        return '服务受到授权中心保护，需提供收取方可调用'
      default:
        return ''
    }
  }

  renderLimit = limitDetail => {
    if (isEmpty(limitDetail)) {
      return 0
    }
    if (!Array.isArray(limitDetail)) {
      return limitDetail.limit
    }
    let result = ''
    limitDetail.some(item => {
      if (item.limit) {
        result = item.limit
        return true
      }
      return false
    })
    return result
  }

  render() {
    const { className, formItemLayout, form, data } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const classNames = ClassNames({
      'service-control': true,
      [className]: !!className,
    })
    const { authenticationType, limitationDetail, xmlProtectionDetail } = data

    const limitDetail = limitationDetail && JSON.parse(limitationDetail)
    const xml = xmlProtectionDetail && JSON.parse(xmlProtectionDetail)
    const oauthObj = Object.keys(data).length > 0 ? JSON.parse(data.authenticationDetail) : ''
    const protocol = getFieldValue('protocol')
    return [
      <div className={classNames} key="limit">
        <div className="second-title">流量控制</div>
        <FormItem
          {...formItemLayout}
          label="API 流量限制"
          className="api-gateway-limit"
        >
          <Row gutter={16}>
            <Col span={18}>
              每
              {getFieldDecorator('apiGatewayLimitType', {
                initialValue: API_GATEWAY_LIMIT_TYPES[ 0 ].key,
              })(
                <Select className="select-time">
                  {
                    API_GATEWAY_LIMIT_TYPES.map(type =>
                      <Option key={type.key}>{type.text}</Option>
                    )
                  }
                </Select>
              )}
              秒最大调用
              {getFieldDecorator('apiGatewayLimit', {
                initialValue: this.renderLimit(limitDetail),
              })(
                <InputNumber min={0} step={1} precision={0} placeholder="请填写整数" className="input-qps"/>
              )}
              次
              <Tooltip title="设置为 0 或者为空时代表不限制访问频度">
                <Icon type="question-circle-o" className="qps-tips"/>
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
      </div>,
      protocol === 'soap' &&
      <div className={classNames} key="xml">
        <div className="second-title">防止 XML 攻击</div>
        <FormItem
          {...formItemLayout}
          label="元素名称长度"
        >
          最长
          {getFieldDecorator('maxElementNameLength', {
            initialValue: xml !== undefined ? xml.maxElementNameLength : 1000,
          })(
            <InputNumber
              style={{ width: 150 }}
              min={1}
              step={1}
              precision={0}
              placeholder="请填写整数"
            />
          )}
          字符
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="元素属性数量"
        >
          最多
          {getFieldDecorator('maxAttibuteCount', {
            initialValue: xml !== undefined ? xml.maxAttibuteCount : 1000,
          })(
            <InputNumber
              style={{ width: 150 }}
              min={1}
              step={1}
              precision={0}
              placeholder="请填写整数"
            />
          )}
          个
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="移除 DTDs"
        >
          {getFieldDecorator('removeDTD', {
            valuePropName: 'checked',
            initialValue: xml !== undefined ? xml.removeDTD : true,
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">从传入的 XML 请求中移除 DTDs（文档类型定义）</span>
        </FormItem>
      </div>,
      <div className={classNames} key="access">
        <div className="second-title">访问控制</div>
        <FormItem
          {...formItemLayout}
          label="访问控制方式"
        >
          {getFieldDecorator('authenticationType', {
            initialValue: authenticationType || 'aksk',
          })(
            <RadioGroup>
              <Radio value="aksk"> 需订阅</Radio>
              <Radio value="bypass"> 无需订阅 - 公开服务</Radio>
              <Radio value="oauth2"> 无需订阅 - Oauth 授权</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <Row>
          <Col className="desc-text" offset={6}>
            {this.renderText()}
          </Col>
        </Row>
        {/* <FormItem
          {...formItemLayout}
          label="可见域限制"
        >
          {getFieldDecorator('visibleDomain', {
            valuePropName: 'checked',
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">开启后，可设置谁可以看到并订阅消费该API</span>
        </FormItem> */}
        {
          getFieldValue('authenticationType') === 'oauth2' &&
          [
            <FormItem
              {...formItemLayout}
              key="oauth2Type"
              label="选择一个授权中心"
              className="oauth-server"
            >
              {getFieldDecorator('oauth2Type', {
                initialValue: 'customer',
                rules: [{
                  required: true,
                  message: 'Please select oauth2Type',
                }],
              })(
                <RadioGroup>
                  <RadioButton value="github" disabled>
                    <Icon type="github" /> Github
                  </RadioButton>
                  <RadioButton value="google" disabled>
                    <Icon type="google" /> Google
                  </RadioButton>
                  <RadioButton value="customer">
                    <Icon type="star-o" /> 自定义
                  </RadioButton>
                </RadioGroup>
              )}
              {this.renderOAuthServerDesc()}
            </FormItem>,
            getFieldValue('oauth2Type') === 'customer' &&
            [
              <FormItem
                {...formItemLayout}
                key="endpoint"
                label="OAuth Server"
              >
                {getFieldDecorator('endpoint', {
                  initialValue: oauthObj ? oauthObj.endpoint : '',
                  rules: [{
                    required: true,
                    whitespace: true,
                    pattern: URL_REG,
                    message: '输入 OAuth Server!',
                  }],
                })(
                  <Input />
                )}
              </FormItem>,
              /* <FormItem
                {...formItemLayout}
                key="redirectUrl"
                label="授权重定向 URL"
              >
                {getFieldDecorator('redirectUrl', {
                  rules: [{
                    required: true,
                    message: '输入 redirectUrl!',
                  }],
                })(
                  <Input />
                )}
              </FormItem>, */
            ],
            <FormItem
              {...formItemLayout}
              key="clientId"
              label="Client ID"
            >
              {getFieldDecorator('clientId', {
                initialValue: oauthObj ? oauthObj.clientId : '',
                rules: [{
                  required: true,
                  message: '输入 clientId!',
                }],
              })(
                <Input />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              key="clientSecret"
              label="Client Secret"
            >
              {getFieldDecorator('clientSecret', {
                initialValue: oauthObj ? oauthObj.clientSecret : '',
                rules: [{
                  required: true,
                  message: '输入 clientSecret!',
                }],
              })(
                <Input />
              )}
            </FormItem>,
          ]
        }
      </div>,
    ]
  }
}
