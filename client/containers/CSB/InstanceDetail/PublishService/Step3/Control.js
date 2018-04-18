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
  Form, InputNumber, Select, Switch, Icon, Tooltip, Row, Col,
} from 'antd'
import { API_GATEWAY_LIMIT_TYPES } from '../../../../../constants'
import './style/Control.less'

const FormItem = Form.Item
const Option = Select.Option

export default class Control extends React.Component {
  render() {
    const { className, formItemLayout, form, data } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const classNames = ClassNames({
      'service-control': true,
      [className]: !!className,
    })
    const accessibleValue = getFieldValue('accessible')
    const { accessible, limitationDetail, xmlProtectionDetail } = data
    const limitDetail = limitationDetail && JSON.parse(limitationDetail)
    const xml = xmlProtectionDetail && JSON.parse(xmlProtectionDetail)
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
                initialValue: limitDetail !== undefined ? limitDetail.limit : 0,
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
      <div className={classNames} key="xml">
        <div className="second-title">防止 XML 攻击</div>
        <FormItem
          {...formItemLayout}
          label="XML 元素名称长度"
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
          位
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="XML 各元素属性数量"
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
          label="公开访问"
        >
          {getFieldDecorator('accessible', {
            valuePropName: 'checked',
            initialValue: accessible || false,
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">
            { accessibleValue ? '关闭『公开访问』，则此 API 无需订阅即可访问。' : '开启『公开访问』，需使用消费凭证订阅后访问。' }
          </span>
        </FormItem>
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
      </div>,
    ]
  }
}
