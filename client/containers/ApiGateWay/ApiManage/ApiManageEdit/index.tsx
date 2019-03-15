/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 * ----
 * page ApiManageEdit
 *
 * @author ZhouHaitao
 * @date 2019-03-06 10:42
 */

import * as React from 'react'
import { Card, Input, Form, Select, Icon, Button, Radio, Checkbox, Row, Col, notification } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as Redux from 'redux'
import ReturnButton from '@tenx-ui/return-button'
import * as apiGroupAction from '../../../../actions/gateway'
import * as apiManageAction from '../../../../actions/apiManage'
import './style/ApiManageEdit.less'

const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const formItemLayout = {
  labelCol: {
    sm: { span: 8, pull: 4 },
  },
  wrapperCol: {
    sm: { span: 16, pull: 4 },
  },
};

interface ComponentProps {
}
interface StateProps {
  clusterID: string
}
interface DispatchProps {
  getGatewayApiGroupList(clusterID: string, query: object): any
  createApi(clusterID: string, body: object): any
  getApiDetail(clusterID: string, id: string): any
  updateApi(clusterID: string, id: string, body: object): any
}
type ApiDetailProps = StateProps & DispatchProps & ComponentProps

class ApiManageEdit extends React.Component<ApiDetailProps> {
  state = {
    apiGroupList: [],
    loading: false,
    submitLoading: false,
    detailData: '',
  }
  componentDidMount() {
    this.onLoadApiGroupList()
    this.onLoadApiDetail()
  }
  onLoadApiDetail = async () => {
    const { id } = this.props.match.params
    if (!id) { return }
    const { getApiDetail, clusterID } = this.props
    const res = await getApiDetail(clusterID, id)
    if (!res.error) {
      this.setState({
        detailData: res.response.result.data,
      })
    }
  }
  onLoadApiGroupList = async () => {
    this.setState({
      loading: true,
    })
    const { clusterID, getGatewayApiGroupList } = this.props
    // @TODO 需要传递分页信息，但参数还未支持
    const result = await getGatewayApiGroupList(clusterID, {})
    if (result.response && result.response.result.code === 200) {
      this.setState({
        apiGroupList: result.response.result.data.content,
      })
    }
    this.setState({
      loading: false,
    })

  }
  onApiGroupChange = () => {

  }
  onApiGroupFocus = () => {

  }
  onApiGroupBlur = () => {

  }
  onFilterApiGroup = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  onReturn = () => this.props.history.push('/api-gateway')
  onSubmit = () => {
    const { validateFields } = this.props.form
    const { createApi, updateApi, clusterID } = this.props
    const { id } = this.props.match.params
    validateFields(async (err, values) => {
      if (!err) {
        this.setState({ submitLoading: true })
        values.methods = values.methods.join(',')
        values.protocols = values.protocols.join(',')
        if (id) {
          const { detailData } = this.state
          for (const k of Object.keys(values)) {
            detailData[k] = values[k]
          }
          const result = await updateApi(clusterID, id, { ...detailData })
          this.setState({ submitLoading: false })
          if (result.response && result.response.result.code === 200) {
            notification.success({ message: '编辑API成功', description: '' })
          } else {
            notification.warn({ message: '编辑API失败', description: result.error })
          }
          return
        }
        const res = await createApi(clusterID, { ...values })
        this.setState({ submitLoading: false })
        if (res.response && res.response.result.code === 200) {
          notification.success({ message: '创建API成功', description: '' })
          this.onReturn()
        } else {
          notification.warn({ message: '创建API失败', description: res.error })
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.match.params
    const { apiGroupList, loading, submitLoading, detailData } = this.state
    const nameValidator = getFieldDecorator('name', {
      initialValue: detailData && detailData.name,
      rules: [{
        required: true,
        validator: (rule, val, cb) => {
          if (!val) {
            return cb('请填写API 组名称')
          }
          cb()
        },
      }],
    })
    const desValidator = getFieldDecorator('description', {
      initialValue: detailData && detailData.description,
      rules: [{
        validator: (rule, val, cb) => {
          if (!val) { return cb() }
          if (val.length > 128) {
            return cb('支持128个汉字或字符')
          }
          cb()
        },
      }],
    })
    const apiGroupValidator = getFieldDecorator('apiGroupId', {
      initialValue: detailData && detailData.apiGroup && detailData.apiGroup.id,
      onChange: this.onApiGroupChange,
      rules: [{
          required: true,
          message: '请选择 API 组',
        }],
    })
    const visitValidator = getFieldDecorator('authType', {
      initialValue: detailData ? detailData.authType : 'Basic-Auth',
      rules: [{
        required: true,
        message: '请选择访问控制方式',
      }],
    })
    const protocalValidator = getFieldDecorator('protocols', {
      initialValue: detailData ? detailData.protocols.split(',') : ['http'],
      rules: [{
        required: true,
        message: '请选择协议',
      }],
    })
    const methodsValidator = getFieldDecorator('methods', {
      initialValue: detailData ? detailData.methods.split(',') : [],
      rules: [{
        required: true,
        message: '请选择请求方法',
      }],
    })
    const pathValidator = getFieldDecorator('path', {
      initialValue: detailData ? detailData.path : '',
      rules: [{
        required: true,
        validator: (rule, val, cb) => {
          if (!val) {
            return cb('请填写访问路径')
          }
          if (!/^\//.test(val)) { return cb('以 / 开头') }
          cb()
        },
      }],
    })

    return <div className="api-manage-detail">
      <div className="top">
        <ReturnButton onClick={this.onReturn}>返回</ReturnButton>
        <span>{id ? '编辑' : '创建'} API</span>
      </div>
      <Form>
        <Card
          hoverable
          actions={[
            <Row className="btn-group" key="btn-group">
              <Col span={8} pull={4}/>
              <Col span={16} pull={4}>
                <Button key="cancel" onClick={this.onReturn}>取消</Button>
                <Button key="ok" type="primary" onClick={this.onSubmit} loading={submitLoading}>确定</Button>
              </Col>
            </Row>,
          ]}
        >
          <div className="form-content">
            <Form.Item
              label="API 名称"
              {...formItemLayout}
            >
              {
                nameValidator(<Input placeholder="可由1-63个中文字符、英文字母、数字或中华先 ”-“ 组成"/>)
              }
            </Form.Item>
            <Form.Item
              label="描述"
              {...formItemLayout}
            >
              {
                desValidator(<TextArea placeholder="请输人描述，支持1-128个汉字或字符"/>)
              }
            </Form.Item>
            <Form.Item
              label="所属API组"
              {...formItemLayout}
            >
              <div className="api-group-box">
                {
                  apiGroupValidator(
                    <Select
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onFocus={this.onApiGroupFocus}
                      onBlur={this.onApiGroupBlur}
                      filterOption={this.onFilterApiGroup}
                    >
                      {
                        apiGroupList.length === 0 ?
                          <Option key="nodata" value="">暂无分组</Option>
                          :
                          apiGroupList.map((v: object) => <Option key={v.id} value={v.id}>{v.name}</Option>)
                      }
                    </Select>,
                  )
                }
                <div className="api-group-operation">
                  <Button icon="sync" onClick={this.onLoadApiGroupList} loading={loading}/>
                  <Link to="/api-group">新建 API 组 >></Link>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="访问控制"
              {...formItemLayout}
            >
              {
                visitValidator(
                  <RadioGroup>
                    <Radio key="Basic-Auth" value={'Basic-Auth'}>Basic Auth</Radio>
                    <Radio key="JWT" value={'JWT'}>JWT</Radio>
                    <Radio key="OAuth2" value={'OAuth2'}>OAuth2</Radio>
                    <Radio key="none" value={'0'}>无认证</Radio>
                  </RadioGroup>,
                )
              }
            </Form.Item>
            <Form.Item
              label="协议"
              {...formItemLayout}
            >
              {
                protocalValidator(
                  <CheckboxGroup
                    options={[
                      { label: 'HTTP', value: 'http' },
                      { label: 'HTTPS', value: 'https' },
                    ]}
                  />,
                )
              }
            </Form.Item>
            <Form.Item
              label="请求方法"
              {...formItemLayout}
            >
              {
                methodsValidator(
                  <Select mode="multiple" placeholder="请选择请求方法">
                    <Option key="GET" value="GET">GET</Option>
                    <Option key="POST" value="POST">POST</Option>
                    <Option key="PUT" value="PUT">PUT</Option>
                    <Option key="DELETE" value="DELETE">DELETE</Option>
                    <Option key="PATCH" value="PATCH">PATCH</Option>
                    <Option key="HEAD" value="HEAD">HEAD</Option>
                    <Option key="OPTIONS" value="OPTIONS">OPTIONS</Option>
                  </Select>,
                )
              }
            </Form.Item>
            <Form.Item
              label="访问路径"
              {...formItemLayout}
            >
              <>
                {
                  pathValidator(<Input placeholder="请自定义url地址，以／开头"/>)
                }
                <span className="tip">
                  <Icon type="info-circle" /> 网关对外暴露的API路径
                </span>
              </>
            </Form.Item>
          </div>
        </Card>
      </Form>
    </div>
  }
}

const mapStateToProps = (state: object): StateProps => {
  const { current: { config: { cluster: { clusterID } } } } = state
  return {
    clusterID,
  }
}
const mapDispatchToProps = {
  getGatewayApiGroupList: apiGroupAction.getGatewayApiGroupList,
  createApi: apiManageAction.createApi,
  getApiDetail: apiManageAction.getApiDetail,
  updateApi: apiManageAction.updateApi,
}
export default connect<StateProps, DispatchProps, ComponentProps>
(mapStateToProps, mapDispatchToProps)(Form.create()(ApiManageEdit))
