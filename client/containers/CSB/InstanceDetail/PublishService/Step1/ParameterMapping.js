/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Parameter mapping
 *
 * @author zhangxuan
 * @date 2018-06-20
 */
import React from 'react'
import { Row, Col, Input, Form } from 'antd'
import '../Step2/style/ErrorCode.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

export default class ParameterMapping extends React.PureComponent {
  render() {
    const { form, formItemLayout } = this.props
    const { getFieldDecorator } = form
    return (
      <div>
        <div className="second-title">参数映射</div>
        <div className="parameter-mapping-body">
          <FormItem
            {...formItemLayout}
            label="请求转换模板"
          >
            {getFieldDecorator('requestXslt', {
              rules: [{
                required: true,
                message: '请提供请求转换模版!',
              }],
            })(
              <TextArea rows={5} placeholder="请提供请求转换模版" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="响应转换模版"
          >
            {getFieldDecorator('responseXslt', {
              rules: [{
                required: true,
                message: '请提供响应转换模版!',
              }],
            })(
              <TextArea rows={5} placeholder="请提供响应转换模版" />
            )}
          </FormItem>
          <Row>
            <Col span={14} offset={6}>
              如需从 URL 中解析相关参数用于 WebService 调用，请根据需求填写 URL 正则，并在转换模板中匹配使用
            </Col>
          </Row>
          <FormItem
            wrapperCol={{ offset: 6, span: 14 }}
          >
            {getFieldDecorator('exposedRegexPath')(
              <Input placeholder="如：/bank/.*" />
            )}
          </FormItem>
        </div>
      </div>
    )
  }
}
