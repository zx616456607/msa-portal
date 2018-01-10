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
  Form, Input, Select,
} from 'antd'
import ClassNames from 'classnames'
import './style/OpenAgreement.less'

const FormItem = Form.Item
const Option = Select.Option

export default class OpenAgreement extends React.Component {
  render() {
    const { formItemLayout, form, className, serviceGroups } = this.props
    const { getFieldDecorator, getFieldValue } = form
    // const name = getFieldValue('name')
    // const version = getFieldValue('version')
    const openUrlBefore = getFieldValue('openUrlBefore')
    /* if (name) {
      openUrlBefore += `${name}/`
    } else {
      openUrlBefore += '<服务名称>/'
    }
    if (version) {
      openUrlBefore += `${version}/`
    } else {
      openUrlBefore += '<服务版本>/'
    } */
    const openProtocol = getFieldValue('openProtocol') || []
    const classNames = ClassNames({
      'open-agreement': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <div className="second-title">服务开放配置</div>
        <FormItem
          {...formItemLayout}
          label="服务名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '输入合法的服务名!',
            }],
          })(
            <Input placeholder="可由1-63个中文字符、英文字母、数字或中划线“-”组成" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务版本"
        >
          {getFieldDecorator('version', {
            rules: [{
              required: true,
              message: '输入服务版本!',
            }],
          })(
            <Input placeholder="自定义版本" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开放地址"
        >
          {getFieldDecorator('openUrl', {
            initialValue: openProtocol === 'soap' ? null : openUrlBefore,
            rules: [{
              required: true,
              message: '输入自定义地址!',
            }],
          })(
            openProtocol === 'soap'
              ? <Input
                addonBefore={openUrlBefore}
                placeholder="输入自定义地址"
              />
              : <Input readOnly />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属服务组"
          key="serviceGroup"
        >
          {getFieldDecorator('groupId', {
            rules: [{
              required: true,
              message: '选择服务组!',
            }],
          })(
            <Select showSearch optionFilterProp="children" placeholder="请选择">
              {
                serviceGroups.map(group => <Option key={group.id}>{group.name}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务描述"
        >
          {getFieldDecorator('description')(
            <Input.TextArea placeholder="请输入描述，支持1-128个汉字或字符" />
          )}
        </FormItem>
        {/*
          openProtocol === 'rest' &&
          <FormItem
            {...formItemLayout}
            label="Restful Path"
          >
            {getFieldDecorator('restfulPath')(
              <Input placeholder="请提供 Restful Path" />
            )}
          </FormItem>
          */}
      </div>
    )
  }
}
