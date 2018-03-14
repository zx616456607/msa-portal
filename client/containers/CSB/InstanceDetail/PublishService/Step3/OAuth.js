/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: OAuth
 *
 * 2018-01-15
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import {
  Form, Radio, Input, Switch, Icon,
} from 'antd'
import {
  URL_REG,
} from '../../../../../constants'
import './style/OAuth.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class OAuth extends React.Component {
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

  render() {
    const { className, formItemLayout, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const classNames = ClassNames('service-oauth', {
      [className]: !!className,
    })
    return (
      <div className={classNames} key="limit">
        <div className="second-title">OAuth 授权</div>
        <FormItem
          {...formItemLayout}
          label="OAuth 授权"
        >
          {getFieldDecorator('openOAuth', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">
          开启 OAuth 授权后，服务将受到授权中心保护，需提供授权方可调用
          </span>
        </FormItem>
        {
          getFieldValue('openOAuth') === true &&
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
      </div>
    )
  }
}
