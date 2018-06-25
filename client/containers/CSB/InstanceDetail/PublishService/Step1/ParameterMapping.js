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
import { connect } from 'react-redux'
import { Row, Col, Input, Form } from 'antd'
import isEmpty from 'lodash/isEmpty'
import {
  getMsgConverters,
  CSB_GET_MESSAGE_CONVERTERS_SUCCESS,
} from '../../../../../actions/CSB/instanceService'
import '../Step2/style/ErrorCode.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

class ParameterMapping extends React.PureComponent {
  state = {}

  async componentDidMount() {
    const { getMsgConverters, instanceID, data } = this.props
    if (isEmpty(data)) {
      return
    }
    const { requestXsltId, responseXsltId } = JSON.parse(data.transformationDetail)
    getMsgConverters(instanceID, requestXsltId)
    getMsgConverters(instanceID, responseXsltId)
    const actionArray = [
      getMsgConverters(instanceID, requestXsltId),
      getMsgConverters(instanceID, responseXsltId),
    ]
    const [ reqMsgResult, resMsgResult ] = await Promise.all(actionArray)
    const msgResultArray = []
    if (reqMsgResult.type === CSB_GET_MESSAGE_CONVERTERS_SUCCESS) {
      msgResultArray[0] = reqMsgResult.response.result.body
    }
    if (resMsgResult.type === CSB_GET_MESSAGE_CONVERTERS_SUCCESS) {
      msgResultArray[1] = resMsgResult.response.result.body
    }
    this.setState({
      msgResultArray,
    })
  }
  render() {
    const { msgResultArray } = this.state
    const { form, formItemLayout, data } = this.props
    const { getFieldDecorator } = form
    let exposedRegexPath
    if (!isEmpty(data)) {
      exposedRegexPath = JSON.parse(data.transformationDetail).exposedRegexPath
    }
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
              initialValue: msgResultArray && msgResultArray[0],
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
              initialValue: msgResultArray && msgResultArray[1],
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
            {getFieldDecorator('exposedRegexPath', {
              initialValue: exposedRegexPath || '',
            })(
              <Input placeholder="如：/bank/.*" />
            )}
          </FormItem>
        </div>
      </div>
    )
  }
}

export default connect(null, {
  getMsgConverters,
})(ParameterMapping)
