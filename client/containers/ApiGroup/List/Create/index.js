/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * api group create
 *
 * 2019-03-04
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
// import { parse } from 'query-string'
import QueueAnim from 'rc-queue-anim'
import { loadAllServices } from '../../../../actions/serviceMesh'
import { createGatewayApiGroup, updateGatewayApiGroup, getGatewayApiGroup, getGatewayApiGroupTargets } from '../../../../actions/gateway'
import { ipOrDomainValidator } from '../../../../common/utils'
import { Button, Select, Input, InputNumber, Card, Form, Radio, Icon, Row, Col, notification, Spin } from 'antd'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'

const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item
const { TextArea } = Input
let uuid = 1

class CreateConfig extends React.Component {
  state = {
    confirmLoading: false,
    initialValues: {},
    isLoading: false,
  }
  componentDidMount() {
    this.getServices()
    const { isEdit, apiGroupId, clusterID, getGatewayApiGroup,
      getGatewayApiGroupTargets } = this.props
    let initialValues
    if (isEdit) {
      this.setState({
        isLoading: true,
      }, async () => {
        await getGatewayApiGroup(clusterID, apiGroupId).then(res => {
          const result = getDeepValue(res, [ 'response', 'result' ]) || {}
          if (result.code === 200) {
            initialValues = result.data
            this.setState({
              initialValues,
            })
          }
        })
        await getGatewayApiGroupTargets(clusterID, apiGroupId,
          { page: 0, size: 9999 }).then(async res => {
          const result = getDeepValue(res, [ 'response', 'result' ]) || {}
          if (result.code === 200) {
            const { form: { setFieldsValue } } = this.props
            const content = result.data.content
            setFieldsValue({
              keys: content.map((item, key) => {
                return {
                  key,
                }
              }),
            })
            await this.forceUpdate()
            content.forEach((item, key) => {
              setFieldsValue({
                [`serviceName-${key}`]: initialValues.proxyType === 0 ? item.host : item.serviceName,
                [`port-${key}`]: item.port,
                [`weight-${key}`]: item.weight,
              })
            })
          }
        })
        this.setState({
          isLoading: false,
        })
      })
    }
  }
  handleAddService = () => {
    const { form: { getFieldValue, setFieldsValue } } = this.props
    const keys = getFieldValue('keys')
    const nextKeys = keys.concat({
      key: uuid++,
    })
    setFieldsValue({
      keys: nextKeys,
    })
  }
  checkPortAndName = (values, keys) => {
    let b
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        if (i !== j
          && values[`port-${keys[i].key}`] === values[`port-${keys[j].key}`]
          && values[`serviceName-${keys[i].key}`] === values[`serviceName-${keys[j].key}`]) {
          notification.destroy()
          notification.warn({
            message: `服务地址 ${values[`serviceName-${keys[i].key}`]} + 服务端口 ${values[`port-${keys[i].key}`]} 重复`,
          })
          b = true
          break;
        }
      }
      if (b) break
    }
    return b
  }
  handleAdd = () => {
    const { form: { validateFields }, createGatewayApiGroup, updateGatewayApiGroup,
      clusterID, history, isEdit, apiGroupId } = this.props
    validateFields((err, values) => {
      if (err) return
      const keys = values.keys.filter(item => !item._delete)
      if (this.checkPortAndName(values, keys)) return
      const targets = []
      keys.forEach(item => {
        if (!item._delete) {
          const key = item.key
          targets.push({
            host: values[`serviceName-${key}`],
            serviceName: values.proxyType === 0 ? values.name : values[`serviceName-${key}`],
            port: values[`port-${key}`],
            weight: values[`weight-${key}`],
          })
        }
      })
      const body = Object.assign({
        targets,
      }, values)
      if (isEdit) {
        updateGatewayApiGroup(clusterID, apiGroupId, body).then(res => {
          if (getDeepValue(res, [ 'response', 'result', 'code' ]) === 200) {
            notification.success({
              message: '修改 API 组成功',
            })
            history.push('/api-group/list')
            return
          }
          notification.warn({
            message: '修改 API 组失败',
          })
        })
      } else {
        createGatewayApiGroup(clusterID, body).then(res => {
          if (getDeepValue(res, [ 'response', 'result', 'code' ]) === 200) {
            notification.success({
              message: '创建 API 组成功',
            })
            history.push('/api-group/list')
            return
          }
          notification.warn({
            message: '创建 API 组失败',
          })
        })
      }
    })
  }
  onCheckName = (rule, value, callback) => {
    if (value) {
      if (value.length > 64) {
        return callback('最多可输入 63 位字符')
      }
      if (!/^[a-zA-Z0-9\-]+$/.test(value)) {
        return callback('仅支持字母、数字、中划线')
      }
    }
    callback()
  }
  onCheckDesc = (rule, value, callback) => {
    if (value) {
      if (value.length > 128) {
        return callback('最多可输入 128 位字符')
      }
    }
    callback()
  }
  getServices = () => {
    const { clusterID, loadAllServices, project } = this.props
    loadAllServices(
      clusterID,
      { headers: project, from: 0, size: 999 }
    )
  }
  deleteService = i => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    form.setFieldsValue({
      keys: keys.map(item => {
        if (item.key === i) {
          item._delete = true
        }
        return item
      }),
    })
  }
  checkPort = (rule, value, cb) => {
    if (!value) return cb('请输入服务端口')
    if (value < 1 || value > 65535) return cb('服务端口范围 1~65535')
    cb()
  }
  validateService = (rule, value, cb) => {
    const { getFieldValue } = this.props.form
    const isAgent = getFieldValue('proxyType') === 0
    if (isAgent) {
      if (!value) return cb('请输入服务地址')
      return ipOrDomainValidator(rule, value, cb)
    }
    if (!value) return cb('请选择服务')
    cb()
  }
  renderServices = () => {
    const { form: { getFieldDecorator, getFieldValue }, serviceList } = this.props
    const keys = getFieldValue('keys')
    const isAgent = getFieldValue('proxyType') === 0
    const len = keys.filter(item => !item._delete).length
    return <div>
      <Button type="ghost" disabled={isAgent} onClick={this.handleAddService}><Icon type="link" /> 添加后端服务</Button>
      <div>
        <Row className="_serviceHeader">
          <Col span={8}>服务地址</Col>
          <Col span={8}>服务端口</Col>
          <Col span={5}>权重 <Icon type="question-circle" /></Col>
          <Col span={3}>操作</Col>
        </Row>
        {keys.length > 0 ? keys.map(item => {
          const { key, _delete } = item
          if (_delete) return null
          return (
            <Row className="_serviceList" key={key}>
              <Col span={8} className="service">
                <FormItem
                >
                  {getFieldDecorator(`serviceName-${key}`, {
                    rules: [{
                      validator: this.validateService,
                    }],
                    validateTrigger: [ 'onChange', 'onSubmit' ],
                  })(
                    !isAgent ?
                      <Select
                        placeholder="请选择服务"
                        style={{ width: '100%' }}
                      >
                        {
                          serviceList && serviceList.map(_item => {
                            const name = getDeepValue(_item, [ 'service', 'metadata', 'name' ]) || ''
                            return <Option key={name} value={name}>
                              {name}</Option>
                          })
                        }
                      </Select>
                      :
                      <Input placeholder="请输入服务 IP 地址" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                >
                  {getFieldDecorator(`port-${key}`, {
                    rules: [{
                      validator: this.checkPort,
                    }],
                    validateTrigger: [ 'onChange', 'onSubmit' ],
                  }
                  )(
                    <Input
                      placeholder="8080"
                      style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator(`weight-${key}`, {
                    rules: [{ required: true, message: '权重不能为空' }],
                    initialValue: 100,
                  }
                  )(
                    <InputNumber
                      placeholder="0"
                      style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col span={3}>
                <Button
                  type="dashed"
                  className="delete"
                  disabled={len === 1}
                  onClick={() => this.deleteService(key)}>
                  <Icon type="delete" />
                </Button>
              </Col>
            </Row>
          )
        }) :
          <Row className="serviceList hintColor noneService" type="flex" align="middle" justify="center">
            暂无服务
          </Row>
        }
      </div>
    </div>
  }
  onSourceChange = value => {
    const { setFieldsValue, getFieldValue, resetFields } = this.props.form
    const temp_keys = getFieldValue('keys')
    if (value === '0') {
      setFieldsValue({
        keys: temp_keys.map((item, idx) => {
          idx > 0 && (item._delete = true)
          return item
        }),
        'serviceName-0': '',
      })
    } else {
      resetFields(temp_keys.map(item => 'serviceName-' + item.key))
    }
  }
  render() {
    const { form, isEdit } = this.props
    const { confirmLoading, initialValues, isLoading } = this.state
    const { getFieldDecorator } = form
    const fromLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    }
    getFieldDecorator('keys', { initialValue: [{ key: 0 }] })
    return (
      <QueueAnim className="create-wrapper">
        <div className="create-top layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/api-group/list')
            }>返回</span>
          </div>
          <span className="title">{(isEdit ? '编辑' : '创建') + ' API 分组'}</span>
        </div>
        <Spin spinning={isLoading}>
          <Card className="create-wrapper" key="body">
            <div className="second-title">基础信息</div>
            <FormItem {...fromLayout} label="API 组名称">
              {getFieldDecorator('name', {
                initialValue: initialValues.name || '',
                rules: [
                  { required: true, whitespace: true, message: '请输入 API 组名称' },
                  { validator: this.onCheckName },
                ],
              })(
                <Input placeholder="可由 1-63 个英文、数字、或中划线'-'组成" />
              )}
            </FormItem>
            <FormItem {...fromLayout} label="描述">
              {getFieldDecorator('description', {
                initialValue: initialValues.description || '',
                rules: [
                  { validator: this.onCheckDesc },
                ],
              })(
                <TextArea placeholder="请输入描述, 支持 1-128 个汉字或字符" />
              )}
            </FormItem>
            <FormItem {...fromLayout} label="访问协议">
              {getFieldDecorator('protocol', {
                initialValue: initialValues.protocol || undefined,
                rules: [
                  { required: true, message: '请选择访问协议' },
                ],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择访问协议">
                  <Option value="http">HTTP</Option>
                  <Option value="https">HTTPS</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...fromLayout} label={<span>URL 前缀 <Icon type="question-circle" /></span>}>
              {getFieldDecorator('path', {
                initialValue: initialValues.path || '',
              })(
                <Input placeholder="例如: /demo" />
              )}
            </FormItem>
            <div className="bar"></div>

            <div className="second-title">后端服务</div>
            <FormItem {...fromLayout} label="后端服务源">
              {getFieldDecorator('proxyType', {
                initialValue: initialValues.proxyType || 0,
                rules: [
                  { required: true, message: '请选择后端服务源' },
                ],
                onChange: this.onSourceChange,
              })(<RadioGroup>
                <Radio value={0}>代理</Radio>
                <Radio value={1}>负载均衡</Radio>
              </RadioGroup>)}
              <div className="hint" key="hint">选择代理仅支持添加一个后端服务，选择应用负载服务支持添加多个后端服务</div>
            </FormItem>
            <FormItem {...fromLayout} wrapperCol={{ span: 20 }} label="后端服务">
              {this.renderServices()}
            </FormItem>
            <div className="operation" >
              <div>
                <Button className="close" onClick={() => this.props.history.push('/api-group/list')}>取消</Button>
                <Button className="ok" type="primary" loading={confirmLoading} onClick={this.handleAdd}>确定</Button>
              </div>
            </div>
          </Card>
        </Spin>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, serviceMesh } = state
  const { cluster, project, project: { namespace } } = current.config
  const clusterID = cluster.id
  const serviceList = getDeepValue(serviceMesh, [ 'serviceList', 'data', 'services' ]) || []
  const { location } = ownProps
  const isEdit = location.pathname.indexOf('/update/') > -1
  const { match } = ownProps
  const { apiGroupId } = match.params
  return {
    clusterID,
    namespace,
    serviceList,
    isEdit,
    apiGroupId,
    project: project.namespace,
  }
}

export default connect(mapStateToProps, {
  loadAllServices,
  getGatewayApiGroup,
  createGatewayApiGroup,
  getGatewayApiGroupTargets,
  updateGatewayApiGroup,
})(Form.create()(CreateConfig))
