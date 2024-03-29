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
import { connect } from 'react-redux'
import {
  Form, Input, Radio, Select, Button, Modal, Switch,
} from 'antd'
import ClassNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import SecurityHeaderModal from './SecurityHeaderModal'
import {
  URL_REG,
} from '../../../../../../constants'
import {
  getCSBServiceOpenType,
} from '../../../../../../common/utils'
import {
  getValueFromLimitDetail,
} from '../../../../../../components/utils'
import {
  pingService,
} from '../../../../../../actions/CSB/instanceService'
import './style/index.less'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

// const ENDPOINT_METHOD = [ 'GET', 'POST', 'PUT', 'DELETE' ]
// const ENDPOINT_METHODS = [ 'GET', 'POST', 'PUT', 'DELETE', '所有方法' ]
// const ENDPOINT_REQUEST_TYPE = [ 'HTTP', 'JSON' ]
// const ENDPOINT_RESPONSE_TYPE = [
//   {
//     key: 'penetrate',
//     text: '透传',
//   },
// ]

class AccessAgreement extends React.Component {
  state = {
    checkWSDLModalVisible: false,
    pingLoading: false,
    securityHeaderModalVisible: false,
    pingSuccess: null,
  }

  ping = () => {
    const { instanceID, pingService, form } = this.props
    form.validateFields([ 'targetDetail' ], (err, values) => {
      if (err) {
        return
      }
      this.setState({
        pingLoading: true,
        pingSuccess: null,
      })
      this.shinning = false
      pingService(instanceID, { url: values.targetDetail }).then(res => {
        this.setState({ pingLoading: false })
        if (res.error) {
          this.setState({ pingSuccess: false })
          return
        }
        let pingMethod
        try {
          pingMethod = res.response.result.body &&
            res.response.result.body.replace('[', '').replace(']', '').split(',')
            || []
        } catch (error) {
          pingMethod = []
        }
        form.setFieldsValue({
          method: pingMethod,
        })
        this.setState({ pingSuccess: true, pingMethod })
      })
    })
  }

  getPingBtnIcon = () => {
    const { pingSuccess } = this.state
    switch (pingSuccess) {
      case true:
        return 'check-circle-o'
      case false:
        return 'exclamation-circle-o'
      default:
        return 'rocket'
    }
  }

  renderServiceRoutingStrategyTips = () => {
    const { getFieldValue } = this.props.form
    switch (getFieldValue('serviceRoutingStrategy')) {
      case 'route1':
        return '直接路由是指直接接入，不需要路由；只能选择一种接入协议或一个接入地址，根据该协议所支持的开放接口协议，选择一种要开放的协议'
      case 'route2':
        return '基于内容的路由是指，根据接入请求的参数值的不同，设置路由条件，路由到多个不同的后端接入地址；该路由方式仅支持开放支持 Restful 协议类型'
      case 'route3':
        return '无条件路由是指，服务支持添加多个不同的接入地址，随机路由到其中一个地址；该路由方式仅支持开放支持 Restful 协议类型'
      default:
        return ''
    }
  }

  getOpenUrlBefore = (ssl, type) => {
    const { form, servicesInbounds, currentInstance } = this.props
    const { getFieldDecorator } = form
    const protocol = ssl ? 'https' : 'http'
    let port = '-'
    servicesInbounds.data && servicesInbounds.data.every(inbound => {
      if (inbound.type === type) {
        port = inbound.port
        getFieldDecorator('inboundId', {
          initialValue: inbound.id,
        })
        return false
      }
      return true
    })
    const host = currentInstance && currentInstance.instance.host || 'csb-service-host'
    return `${protocol}://${host}:${port}`
  }

  filterMethod = value => {
    if (!value) return
    const result = value.split(',').map(item => {
      return item
    })
    return result
  }

  render() {
    const { formItemLayout, form, className, dataList, isEdit } = this.props
    const { pingSuccess, pingMethod } = this.state
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form
    const { transformationDetail, transformationType, type, targetDetail } = dataList
    const protocol = getFieldValue('protocol')
    const classNames = ClassNames({
      'access-agreement': true,
      [className]: !!className,
    })
    const pingBtnClassNames = ClassNames({
      'right-btn': true,
      shinning: this.shinning,
      success: pingSuccess === true,
      failed: pingSuccess === false,
    })
    let limitationDetail = null
    if (!isEmpty(dataList)) {
      limitationDetail = JSON.parse(dataList.limitationDetail)
    }
    const openProtocol = getFieldValue('openProtocol')
    const ssl = getFieldValue('ssl')
    const serviceOpenType = getCSBServiceOpenType(openProtocol, ssl)
    const openUrlBefore = this.getOpenUrlBefore(ssl, serviceOpenType)
    let openProtocolType = 'rest'
    let protocolType = 'rest'
    let bindingName
    let operationName
    let wsdl
    if (!isEmpty(dataList)) {
      if (type === 'rest_ssl' || type === 'rest') {
        openProtocolType = 'rest'
      } else {
        openProtocolType = 'soap'
      }
      protocolType = transformationType === 'direct'
        ?
        type
        :
        transformationType.split('_')[0]
      const {
        bindingName: copyBindingName,
        operationName: copyOperationName,
        wsdl: copyWsdl,
      } = JSON.parse(transformationDetail)
      bindingName = copyBindingName
      operationName = copyOperationName
      wsdl = copyWsdl
    }
    getFieldDecorator('type', {
      initialValue: serviceOpenType,
    })
    getFieldDecorator('openUrlBefore', {
      initialValue: openUrlBefore,
    })
    const isDisabled = isEdit === 'true'

    return (
      <div className={classNames}>
        <div className="second-title">选择协议及接入配置</div>
        <FormItem
          {...formItemLayout}
          label="选择路由策略"
          className="service-routing-strategy"
        >
          {getFieldDecorator('serviceRoutingStrategy', {
            initialValue: 'route1',
            rules: [{
              required: true,
              message: '选择路由策略',
            }],
          })(
            <RadioGroup>
              <Radio value="route1">直接路由</Radio>
              {/*
              <Radio value="route2" disabled>基于内容的路由</Radio>
              <Radio value="route3" disabled>无条件路由</Radio>
*/}
            </RadioGroup>
          )}
          <div className="desc-text">{this.renderServiceRoutingStrategyTips()}</div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="选择一个接入协议"
        >
          {getFieldDecorator('protocol', {
            initialValue: protocolType,
            rules: [{
              required: true,
              message: 'Please input protocol',
            }],
            onChange: e => {
              const type = e.target.value
              if (type === 'rest') {
                setFieldsValue({
                  openProtocol: 'rest',
                })
              }
            },
          })(
            <RadioGroup disabled={isDisabled}>
              <RadioButton value="rest">Restful</RadioButton>
              <RadioButton value="soap">WebService</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="选择服务开放接口"
          className="service-protocols"
        >
          {getFieldDecorator('openProtocol', {
            initialValue: openProtocolType,
            // rules: [{
            //   required: true,
            //   message: '选择协议类型',
            // }],
            onChange: e => {
              // let openUrl
              // if (!(protocol === 'soap' && e.target.value === 'rest')) {
              //  openUrl = openUrlBefore
              // }
              let type = e.target.value
              if (ssl) {
                type += '_ssl'
              }
              const openUrl = this.getOpenUrlBefore(ssl, type)
              setFieldsValue({
                openUrl,
              })
            },
          })(
            <RadioGroup disabled={isDisabled}>
              <Radio value="rest">Restful</Radio>
              <Radio value="soap" disabled={getFieldValue('protocol') === 'rest'}>WebService</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="SSL 加密"
          className="service-ssl"
        >
          {getFieldDecorator('ssl', {
            initialValue: dataList ? dataList.type === 'rest_ssl' : false,
            valuePropName: 'checked',
            onChange: e => {
              let type = openProtocol
              if (e) {
                type += '_ssl'
              }
              const openUrl = this.getOpenUrlBefore(e, type)
              setFieldsValue({
                openUrl,
              })
            },
          })(
            <Switch disabled={isDisabled} checkedChildren="开" unCheckedChildren="关" />
          )}
          <span className="desc-text">开启后将提高 API 访问的安全性</span>
        </FormItem>
        {
          (!protocol || protocol === 'rest') &&
          [
            <FormItem
              {...formItemLayout}
              label="端点"
              key="endpoint"
              className="publish-service-body-endpoint"
            >
              {getFieldDecorator('targetDetail', {
                initialValue: dataList ? dataList.targetDetail : '',
                rules: [{
                  required: true,
                  whitespace: true,
                  pattern: URL_REG,
                  message: '请填写正确的服务地址',
                }],
                onChange: () => { this.shinning = true },
              })(
                <Input placeholder="请提供接入服务的基础 URL" />
              )}
              <Button
                className={pingBtnClassNames}
                icon={this.getPingBtnIcon()}
                loading={this.state.pingLoading}
                onClick={this.ping}
              >
                测试连接
              </Button>
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="方法"
              key="method"
            >
              {getFieldDecorator('method', {
                initialValue: this.filterMethod(getValueFromLimitDetail(limitationDetail, 'method')),
                rules: [{
                  required: true,
                  message: '请输入端点地址点击“测试连接”获取方法',
                }],
              })(
                <Select placeholder="请点击“测试连接”获取方法" mode="multiple">
                  {
                    (pingMethod || []).map(method => <Option key={method}>{method}</Option>)
                  }
                </Select>
              )}
            </FormItem>,
          ]
        }
        {
          protocol === 'soap' &&
          <FormItem
            {...formItemLayout}
            label="WSDL 地址"
            key="targetDetail"
            className="publish-service-body-wsdl-address"
          >
            {getFieldDecorator('targetDetail', {
              initialValue: wsdl || targetDetail,
              rules: [{
                required: true,
                whitespace: true,
                pattern: URL_REG,
                message: '请填写正确的 WSDL 地址',
              }],
            })(
              <Input placeholder="请提供地址" />
            )}
            <Button
              className="right-btn"
              onClick={() => this.setState({ checkWSDLModalVisible: true })}
            >
              本地 WSDL
            </Button>
          </FormItem>
        }
        {
          protocol === 'soap' && openProtocol === 'rest' &&
          [
            <FormItem
              {...formItemLayout}
              label="Binding 名称"
              key="bindingName"
            >
              {getFieldDecorator('bindingName', {
                initialValue: bindingName || '',
                rules: [{
                  required: true,
                  message: 'Please input bindingName',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="方法名称"
              key="operationName"
            >
              {getFieldDecorator('operationName', {
                initialValue: operationName || '',
                rules: [{
                  required: true,
                  message: 'Please input operationName',
                }],
              })(
                <Input placeholder="长度为1-128字符，允许英文字母、数字，或“-”" />
              )}
            </FormItem>,
            <FormItem
              {...formItemLayout}
              label="安全头定制"
              key="security-head-customization"
            >
              <Button
                onClick={() => this.setState({ securityHeaderModalVisible: true })}
              >
                点击定制
              </Button>
            </FormItem>,
          ]
        }
        <Modal
          title="检测 WSDL"
          visible={this.state.checkWSDLModalVisible}
          onCancel={() => this.setState({ checkWSDLModalVisible: false })}
        >
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label="内容"
          >
            <Input.TextArea />
          </FormItem>
        </Modal>
        {
          protocol === 'soap' && this.state.securityHeaderModalVisible &&
          <SecurityHeaderModal
            visible={true}
            formItemLayout={formItemLayout}
            form={form}
            onCancel={() => this.setState({ securityHeaderModalVisible: false })}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  pingService,
})(Form.create()(AccessAgreement))
