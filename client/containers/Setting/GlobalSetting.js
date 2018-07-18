/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * GlobalSetting
 *
 * 2017-11-14
 * @author zhangcz
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import './style/GlobalSetting.less'
import {
  Card, Form, Input,
  Row, Col, Button, notification,
} from 'antd'
import APIAddress from '../../assets/img/system-settings/API-address.png'
import { API_CONFIG } from '../../constants/index.js'
import { getZkhost, setZkhost } from '../../actions/globalConfig'

const FormItem = Form.Item
const { PAAS_API_PROTOCOL, PAAS_API_HOST, MSA_API } = API_CONFIG

class GlobalSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      dubbo: '',
    }
  }

  componentDidMount() {
    // 获取zkhost
    // const { clusterId, getZkhost } = this.props
    // getZkhost(clusterId)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.host !== nextProps.host) {
      this.setState({
        dubbo: nextProps.host,
      })
    }
  }
  // 配置zkhost相关
  submitDubbo = () => {
    if (this.state.dubbo === '') {
      return
    }
    const { clusterId, setZkhost } = this.props
    setZkhost(
      clusterId,
      { zkhost: this.state.dubbo }
    ).then(res => {
      if (res.response.result.code === 200) {
        this.setState({ isEdit: false })
        notification.success({
          message: '修改成功',
        })
      }
    })

  }
  cancelDubbo = () => {
    this.setState({
      isEdit: false,
      dubbo: this.props.host,
    })
    this.props.form.resetFields([ 'dubbo' ])
  }
  testIp = (rule, value, callback) => {
    if (new RegExp('[\\u4E00-\\u9FFF]+', 'g').test(value)) {
      return callback('不能包含中文')
    }
    if (new RegExp('[a-zA-Z]+', 'g').test(value)) {
      return callback('不能包含字母')
    }
    callback()
  }
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field])
  }
  render() {
    const { form, isFetching, host } = this.props
    const { isEdit } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }

    return <QueueAnim>
      <div key="GlobalSetting">
        <Card
          id="GlobalSetting"
          title="全局配置"
        >
          <div className="API_address">
            <div className="second-title">开放 API 地址</div>
            <Row>
              <Col span="4" className="img_col">
                <img src={APIAddress} alt=""/>
              </Col>
              <Col span="20" className="form_col">
                <Form>
                  <FormItem
                    {...formItemLayout}
                    label="微服务引擎  API"
                    key="container"
                  >
                    {getFieldDecorator('container', {
                      initialValue: `${PAAS_API_PROTOCOL}//${PAAS_API_HOST}`,
                      rules: [{
                        // required: true,
                        message: '请配置微服务底层 API 地址（即 API Server）',
                      }],
                    })(
                      <Input placeholder="请填写容器引擎API" disabled/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="SpringCloud API"
                    key="integration"
                  >
                    {getFieldDecorator('integration', {
                      initialValue: `${MSA_API}`,
                      rules: [{
                        // required: true,
                        message: 'SpringCloud API 地址',
                      }],
                    })(
                      <Input placeholder="请填写集成部署API" disabled/>
                    )}
                  </FormItem>
                  {
                    // 由于dev-branch暂时不需要RPC相关功能,暂时隐藏
                    false && <FormItem
                      {...formItemLayout}
                      label="Dubbo 注册中心"
                      hasFeedBack
                      key="dubbo"
                    >
                      {getFieldDecorator('dubbo', {
                        initialValue: `${this.state.dubbo}`,
                        rules: [
                          {
                            required: true,
                            message: '请输入zookeeper地址 不能为空',
                          },
                          {
                            validator: this.testIp,
                            trigger: [ 'onBlur', 'onChange' ],
                          },
                        ],
                        onChange: e => {
                          this.setState({
                            dubbo: e.target.value,
                          })
                        },
                      })(
                        <Input placeholder="请输入zookeeper地址" disabled = {!isEdit}/>
                      )}
                    </FormItem>
                  }
                  {
                    // 由于dev-branch暂时不需要RPC相关功能,暂时隐藏
                    false && <div className="button_group">
                      {
                        !isEdit ?
                          <Button type="primary" onClick={() => {
                            this.setState({
                              isEdit: true,
                            })
                          }}>修改</Button>
                          :
                          <div>
                            <Button type="default" className="cancel" onClick={this.cancelDubbo}>取消</Button>
                            <Button type="primary" loading={isFetching} disabled={this.hasErrors(form.getFieldsError()) || this.state.dubbo === host} onClick={this.submitDubbo}>确认</Button>
                          </div>
                      }
                    </div>
                  }


                </Form>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </QueueAnim>
  }
}

const mapStateToProps = state => {
  const { clusters } = state.entities
  let host = ''
  let isFetching = false
  if (state.globalConfig.data) {
    host = state.globalConfig.data.host
    isFetching = state.globalConfig.isFetching
  }
  const clusterId = clusters ? Object.keys(clusters)[0] : ''
  return { clusterId, host, isFetching }
}

const FormGlobalSetting = Form.create()(GlobalSetting)
export default connect(mapStateToProps, {
  getZkhost,
  setZkhost,
})(FormGlobalSetting)
