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
  selectServerName = (rule, value, callback) => {
    if (value.length > 64) {
      return callback('最多可输入63位字符')
    }
    if (!/^[a-zA-Z0-9\-]+$/.test(value)) {
      return callback('支持字母、数字、中划线')
    }
    callback()
  }
  serverVersion = (rule, value, callback) => {
    if (value.length > 64) {
      return callback('最多可输入63位字符')
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
      return callback('支持字母、数字、下划线、中划线和 "."')
    }
    callback()
  }
  render() {
    const { formItemLayout, form, className, serviceGroups, dataList, isEdit } = this.props
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
    // const protocol = getFieldValue('protocol') || []
    // const openProtocol = getFieldValue('openProtocol') || []
    const classNames = ClassNames({
      'open-agreement': true,
      [className]: !!className,
    })
    const isDisabled = isEdit === 'true'
    return (
      <div className={classNames}>
        <div className="second-title">服务开放配置</div>
        <FormItem
          {...formItemLayout}
          label="服务名称"
        >
          {getFieldDecorator('name', {
            initialValue: dataList ? dataList.name : '',
            rules: [{
              required: true,
              message: '请输入服务名称',
            },
            { validator: this.selectServerName }],
          })(
            <Input disabled={isDisabled} placeholder="支持1-63位字母、数字或中划线组成" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="服务版本"
        >
          {getFieldDecorator('version', {
            initialValue: dataList ? dataList.version : '',
            rules: [{
              required: true,
              message: '请输入服务版本',
            },
            { validator: this.serverVersion }],
          })(
            <Input disabled={isDisabled} placeholder="自定义版本" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开放地址"
        >
          {getFieldDecorator('openUrl', {
            initialValue: openUrlBefore,
            rules: [{
              required: true,
              message: '输入自定义地址!',
            }],
          })(
            // openProtocol === 'rest' || openProtocol === 'soap'
            //  ? <Input
            //    addonBefore={openUrlBefore}
            //    placeholder="输入自定义地址"
            //  />
            //  : <Input disabled={isDisabled} readOnly />
            <Input disabled={isDisabled} readOnly placeholder="输入自定义地址"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属服务组"
          key="serviceGroup"
        >
          {getFieldDecorator('groupId', {
            initialValue: dataList ? dataList.groupName : '',
            rules: [{
              required: true,
              message: '选择服务组!',
            }],
          })(
            <Select disabled={isDisabled} showSearch optionFilterProp="children" placeholder="请选择">
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
          {getFieldDecorator('description', {
            initialValue: dataList ? dataList.description : '',
          })(
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
