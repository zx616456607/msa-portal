/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RoutingRule Modal
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { Input, Modal, Form, Switch, Radio, Select, notification } from 'antd'
import { connect } from 'react-redux'
import {
  APP_NAME_REG,
  APP_NAME_REG_NOTICE,
  URL_REG,
  ROUTE_REG,
  ASYNC_VALIDATOR_TIMEOUT,
} from '../../../../constants'
import * as msaAction from '../../../../actions/msa'
import * as gateWayAction from '../../../../actions/gateway'
import {
  msaListSlt,
} from '../../../../selectors/msa'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

class RoutingRuleModal extends React.Component {
  state = {
    confirmLoading: false,
  }

  componentDidMount() {
    const { currentRoute, form } = this.props
    this.loadMsaList()
    if (currentRoute) {
      const { setFieldsValue, resetFields } = form
      resetFields()
      const {
        routeId, path, serviceId, url, description, stripPrefix,
        retryable, status,
      } = currentRoute
      const msaUrlType = url ? 'url' : 'id'
      setFieldsValue({ 'msa-url-type': msaUrlType })
      const values = {
        routeId,
        path,
        description,
        stripPrefix,
        retryable,
        status,
      }
      if (msaUrlType === 'url') {
        values.url = url
      } else {
        values.serviceId = serviceId
      }
      setTimeout(() => {
        setFieldsValue(values)
      }, 50)
    }
  }

  loadMsaList = () => {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  confirmModal = () => {
    const {
      clusterID, form, addGatewayRoute, onCancel, loadRoutesList, currentRoute,
      updateGatewayRoute,
    } = this.props
    const { validateFields, getFieldValue } = form
    const validateArray = [
      'routeId',
      'path',
      'msa-url-type',
      'description',
      'stripPrefix',
      'retryable',
      'status',
    ]
    const urlType = getFieldValue('msa-url-type')
    if (urlType === 'id') {
      validateArray.push('serviceId')
    } else {
      validateArray.push('url')
    }
    validateFields(validateArray, (err, values) => {
      if (err) {
        return
      }
      const body = Object.assign({}, values)
      delete body['msa-url-type']
      if (values['msa-url-type'] === 'id') {
        delete body.url
      } else {
        delete body.serviceId
      }
      this.setState({
        confirmLoading: true,
      })
      if (!currentRoute) {
        addGatewayRoute(clusterID, values).then(res => {
          this.setState({
            confirmLoading: false,
          })
          if (res.error) {
            return
          }
          notification.success({
            message: '添加路由规则成功',
          })
          onCancel()
          loadRoutesList()
        })
        return
      }
      updateGatewayRoute(clusterID, currentRoute.id, body).then(res => {
        this.setState({
          confirmLoading: false,
        })
        if (res.error) {
          return
        }
        notification.success({
          message: '修改路由规则成功',
        })
        onCancel()
        loadRoutesList()
      })
    })
  }

  cancelModal = () => {
    const { scope } = this.props
    scope.setState({
      ruleModal: false,
    })
  }

  /* handleSelectChange = value => {
    console.log(value)
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  } */

  routeNameCheck = (rules, value, callback) => {
    const { checkRouteName, clusterID, currentRoute } = this.props
    clearTimeout(this.routeNameTimeout)
    if (currentRoute && (currentRoute.routeId === value)) {
      return callback()
    }
    this.routeNameTimeout = setTimeout(() => {
      checkRouteName(clusterID, value).then(res => {
        if (res.response.result.data.has) {
          callback('路由名称已经存在')
        } else {
          callback()
        }
      }).catch(() => {
        callback('请求出错')
      })
    }, ASYNC_VALIDATOR_TIMEOUT)
  }

  render() {
    const { form, msaList, visible, onCancel, currentRoute } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const titleText = currentRoute ? '修改' : '添加'
    return (
      <Modal
        title={`${titleText}路由规则`}
        width={560}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={onCancel}
        confirmLoading={this.state.confirmLoading}
      >
        <FormItem {...formItemLayout} label="路由名称">
          {getFieldDecorator('routeId', {
            rules: [{
              required: true,
              whitespace: true,
              pattern: APP_NAME_REG,
              message: '路由名称' + APP_NAME_REG_NOTICE,
            }, {
              validator: this.routeNameCheck,
            }],
          })(
            <Input placeholder="请填写路由名称" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="路由路径">
          {getFieldDecorator('path', {
            rules: [{
              required: true,
              pattern: ROUTE_REG,
              message: '以/开头，由数字、字母、中划线、下划线组成',
            }],
          })(
            <Input placeholder="/service/demo/**" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="目标服务类型"
        >
          {getFieldDecorator('msa-url-type', {
            initialValue: 'id',
            rules: [{
              required: true,
            }],
          })(
            <RadioGroup>
              <Radio value="id">微服务 ID</Radio>
              <Radio value="url">路由 URL</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          getFieldValue('msa-url-type') === 'id'
            ? <FormItem {...formItemLayout} label="目标服务地址">
              {getFieldDecorator('serviceId', {
                rules: [{
                  required: true,
                  message: '请选择一个微服务',
                }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择微服务">
                  {
                    msaList.map(msa => <Option key={msa.appName}>{msa.appName}</Option>)
                  }
                </Select>
              )}
            </FormItem>
            : <FormItem {...formItemLayout} label="目标服务地址">
              {getFieldDecorator('url', {
                rules: [{
                  required: true,
                  whitespace: true,
                  pattern: URL_REG,
                  message: '请填写正确的地址',
                }],
              })(
                <Input placeholder="请填写完整的路由 URL，如：http://192.168.0.1/rule" />
              )}
            </FormItem>
        }
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('description')(
            <Input.TextArea placeholder="请填写路由规则描述" />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="去掉路径前缀">
          {getFieldDecorator('stripPrefix', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem> */}
        <FormItem {...formItemLayout} label="失败重试机制">
          {getFieldDecorator('retryable', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="默认开启">
          {getFieldDecorator('status', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="路由策略">
          {getFieldDecorator('tactics', { initialValue: '1' })(
            <Select
              onChange={this.handleSelectChange}
              style={{ width: 200 }}
            >
              <Option value="1">顺序路由</Option>
              <Option value="2">随机路由</Option>
              <Option value="3">粘性路由</Option>
              <Option value="4">加权平均路由</Option>
              <Option value="5">基于负载路由</Option>
              <Option value="6">基于连接数路由</Option>
            </Select>
          )}
        </FormItem> */}
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  return {
    clusterID: id,
    ...msaListSlt(state),
  }
}

export default connect(mapStateToProps, {
  getMsaList: msaAction.getMsaList,
  addGatewayRoute: gateWayAction.addGatewayRoute,
  updateGatewayRoute: gateWayAction.updateGatewayRoute,
  checkRouteName: gateWayAction.checkRouteName,
})(Form.create()(RoutingRuleModal))
