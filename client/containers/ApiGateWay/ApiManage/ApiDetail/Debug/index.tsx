/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * component Debug
 *
 * @author ZhouHaitao
 * @date 2019-03-08 10:42
 */

import * as React from 'react'
import { Button, Row, Col, Input, Select, Form, Icon, Radio, Checkbox } from 'antd'

import './style/debug.less'

const RadioGroup = Radio.Group
const { Option } = Select
const FormItem = Form.Item
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
}
let reqParamId = 0
let reqbodyId = 1000

interface DebugProps {

}

class Debug extends React.Component<DebugProps> {
  onReqParamAdd = () => {
    const { getFieldValue } = this.props.form
    const reqParam = getFieldValue('reqParam')
    const nextParams = reqParam.concat(reqParamId++);
    this.props.form.setFieldsValue({
      reqParam: nextParams,
    });
  }
  onReqParamRemove = k => {
    const { form } = this.props;
    const reqParam = form.getFieldValue('reqParam');
    form.setFieldsValue({
      reqParam: reqParam.filter(key => key !== k),
    });
  }
  onReqFormDataAdd = () => {
    const { getFieldValue } = this.props.form
    const reqFormData = getFieldValue('reqFormData')
    const nextFormData = reqFormData.concat(reqbodyId++);
    this.props.form.setFieldsValue({
      reqFormData: nextFormData,
    });
  }
  onReqFormDataRemove = k => {
    const { form } = this.props;
    const reqFormData = form.getFieldValue('reqFormData');
    form.setFieldsValue({
      reqFormData: reqFormData.filter(key => key !== k),
    });
  }
  onApiRequest = () => {
    const { getFieldsValue } = this.props.form
    const apiData = getFieldsValue()
    const { contentType,
      formDataCheck,
      formDataName,
      formDataValue,
      reqHeaderCheck,
      reqHeaderName,
      reqHeaderValue,
      method,
      password,
      userName,
      api,
    } = apiData
    const auth = { method: 'Basic_Auth', password, userName }
    const formatData = (checkAry: any[], keyData: any[], valueData: any[]) => {
      const resultData = {}
      for (const k in checkAry) {
        if (checkAry[k]) {
          resultData[keyData[k]] = valueData[k]
        }
      }
      return resultData
    }
    const apiRequest = (url: string,
                        authData: object,
                        headers: object,
                        body?: any, type?: any, requestMethod: string) => {
      return { url, authData, headers, body, type, requestMethod }
    }
    let reqBody = null
    const reqHeader = formatData(reqHeaderCheck, reqHeaderName, reqHeaderValue)
    if (contentType === 'application/x-www-form-urlencoded') {
      reqBody = formatData(formDataCheck, formDataName, formDataValue)
    } else {
      reqBody = apiData.reqBodyData
    }
    apiRequest(api, auth, reqHeader, reqBody, contentType, method)
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator('reqParam', { initialValue: [401, 402] })
    const reqParams = getFieldValue('reqParam')
    const reqParamsItems = reqParams.map(v => {
      return <Row key={v} gutter={8} className="req-params-item">
        <Col span={1}>
          <FormItem>
            {getFieldDecorator(`reqHeaderCheck[${v}]`)(<Checkbox placeholder="请输入参数名"/>)}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem>
            {getFieldDecorator(`reqHeaderName[${v}]`)(<Input placeholder="请输入参数名"/>)}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem>
            {getFieldDecorator(`reqHeaderValue[${v}]`)(<Input placeholder="请输入参数值"/>)}
          </FormItem>
        </Col>
        <Col span={1} className="del-button">
          <Button icon="delete" onClick={() => this.onReqParamRemove(v)}/>
        </Col>
      </Row>
    })
    getFieldDecorator('reqFormData', { initialValue: [1001, 1002] })
    const reqFormData = getFieldValue('reqFormData')
    const reqFormDataItems = reqFormData.map(v => {
      return <Row key={v} gutter={8} className="req-params-item">
        <Col span={1}>
          <FormItem>
            {getFieldDecorator(`formDataCheck[${v}]`)(<Checkbox placeholder="请输入参数名"/>)}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem>
            {getFieldDecorator(`formDataName[${v}]`)(<Input placeholder="请输入参数名"/>)}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem>
            {getFieldDecorator(`formDataValue[${v}]`)(<Input placeholder="请输入参数值"/>)}
          </FormItem>
        </Col>
        <Col span={1} className="del-button">
            <Button icon="delete" onClick={() => this.onReqFormDataRemove(v)}/>
        </Col>
      </Row>
    })
    const contentType = getFieldValue('contentType')
    return <Form className="api-debug">
      <Row gutter={48}>
        <Col span={12} className="input">
          <h1 key="debug">调试 API</h1>
          <Row className="url-config" gutter={16}>
            <Col span={4}>
              {
                getFieldDecorator('method', {
                  initialValue: 'GET',
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                  </Select>,
                )
              }
            </Col>
            <Col span={18}>
              {getFieldDecorator('api')(<Input/>)}
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.onApiRequest}>发送</Button>
            </Col>
          </Row>
          <h1 key="auth">认证</h1>
          <div className="auth">
            <FormItem
              label="认证方式"
              {...formLayout}
            >
              Basic_Auth
            </FormItem>
            <FormItem
              label="用户名"
              {...formLayout}
            >
              {getFieldDecorator('userName')(<Input placeholder="填写用户名"/>)}
            </FormItem>
            <FormItem
              label="密码"
              {...formLayout}
            >
              {getFieldDecorator('password')(<Input.Password placeholder="请输入密码"/>)}
            </FormItem>
          </div>
          <h1>请求头参数 Headers</h1>
          <div className="req-params" key="reqHeaderContent">
            {
              reqParams.length !== 0 &&
              <div className="content">
                {reqParamsItems}
              </div>
            }
            <span className="add-btn" onClick={this.onReqParamAdd}>
              <Icon type="plus-circle" />
              添加参数
            </span>
          </div>
          <div className="req-body">
            <div className="title">
              <h1>请求体 Body</h1>
              <FormItem>
                {getFieldDecorator('contentType', {
                  initialValue: 'application/x-www-form-urlencoded',
                })(
                  <RadioGroup>
                    <Radio value="application/x-www-form-urlencoded">表单</Radio>
                    <Radio value="text/xml">XML 格式</Radio>
                    <Radio value="application/json">JSON 格式</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </div>
            {
              (reqFormData.length !== 0 && contentType === 'application/x-www-form-urlencoded') &&
              <div className="content">
                {reqFormDataItems}
              </div>
            }
            {
              contentType !== 'application/x-www-form-urlencoded' &&
                getFieldDecorator('reqBodyData')(<TextArea rows={6}/>)
            }
            {
              contentType === 'application/x-www-form-urlencoded' &&
                <span className="add-btn" onClick={this.onReqFormDataAdd}>
                  <Icon type="plus-circle" />
                  添加参数
                </span>
            }
          </div>
        </Col>
        <Col span={12}>
          <h1>返回结果</h1>
          <p>耗时：{3}秒</p>
          <h3>响应结果 Result</h3>
          <TextArea rows={20} value={123} editable={false}/>
        </Col>
      </Row>
    </Form>
  }
}

export default Form.create()(Debug)
