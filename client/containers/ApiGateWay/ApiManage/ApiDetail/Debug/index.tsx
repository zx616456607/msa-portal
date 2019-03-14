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
import { Button, Row, Col, Input, Select, Form, Icon, Radio, Checkbox, notification } from 'antd'
import * as apiManageAction from '../../../../../actions/apiManage'
import './style/debug.less'
import { connect } from 'react-redux';

const RadioGroup = Radio.Group
const { Option } = Select
const FormItem = Form.Item
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
}
let reqParamId = 0
let reqbodyId = 1003

interface ComponentProps {
  apiGroupId?: number
}
interface StateProps {
  clusterID: string
  apiId: string
}
interface DispatchProps {
  debugApi(clusterID: string, body: object): any
}

type DebugProps = ComponentProps & StateProps & DispatchProps

class Debug extends React.Component<DebugProps> {
  state = {
    timeout: 0,
    loading: false,
    responseBody: '',
  }
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
  onApiRequest = async () => {
    const { getFieldsValue } = this.props.form
    const { apiId, debugApi, clusterID } = this.props
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

    let reqBody = null
    const reqHeader = formatData(reqHeaderCheck, reqHeaderName, reqHeaderValue)
    if (contentType === '0') {
      reqBody = formatData(formDataCheck, formDataName, formDataValue)
    } else if (contentType === '2') {
      try {
        reqBody = JSON.parse(apiData.reqBodyData)
      } catch (e) {
        notification.warn({
          message: '参数格式错误',
          description: '',
        })
        return
      }
    } else {
      reqBody = apiData.reqBodyData
    }
    const body = {
      url: api,
      headers: reqHeader,
      param: reqBody,
      method,
      paramType: contentType,
      apiId,
    }
    this.setState({ loading: true })
    const res = await debugApi(clusterID, body)
    this.setState({ loading: false })
    if (!res.error) {
      this.setState({
        timeout: res.response.result.data.deny,
        responseBody: res.response.result.data.body,
      })
    } else {
      notification.warn({
        message: '请求失败',
        description: res.error,
      })
    }

  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { loading, timeout, responseBody } = this.state
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
                    <Option value="PATCH">PATCH</Option>
                    <Option value="HEAD">HEAD</Option>
                    <Option value="OPTIONS">OPTIONS</Option>
                  </Select>,
                )
              }
            </Col>
            <Col span={18}>
              {getFieldDecorator('api')(<Input/>)}
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.onApiRequest} loading={loading}>发送</Button>
            </Col>
          </Row>
{/*
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
*/}
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
                  initialValue: '0',
                })(
                  <RadioGroup>
                    <Radio value="0">表单</Radio>
                    <Radio value="1">XML 格式</Radio>
                    <Radio value="2">JSON 格式</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </div>
            {
              (reqFormData.length !== 0 && contentType === '0') &&
              <div className="content">
                {reqFormDataItems}
              </div>
            }
            {
              contentType !== '0' &&
                getFieldDecorator('reqBodyData')(<TextArea rows={6}/>)
            }
            {
              contentType === '0' &&
                <span className="add-btn" onClick={this.onReqFormDataAdd}>
                  <Icon type="plus-circle" />
                  添加参数
                </span>
            }
          </div>
        </Col>
        <Col span={12}>
          <h1>返回结果</h1>
          <p>耗时：{timeout} ms</p>
          <h3>响应结果 Result</h3>
          <TextArea rows={20} value={responseBody} editable={false}/>
        </Col>
      </Row>
    </Form>
  }
}

const mapStateToProps = (state: object) => {
  const { current: { config: { cluster: { clusterID } } } } = state
  return {
    clusterID,
  }
}
const mapDispatchToProps = {
  debugApi: apiManageAction.debugApi,
}

export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(Form.create()(Debug))
