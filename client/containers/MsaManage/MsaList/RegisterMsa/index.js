/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RegisterMsa Modal
 *
 * 2017-09-12
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Input,
  Form,
  Icon,
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  notification,
} from 'antd'
import {
  APP_NAME_REG,
  HOST_REG,
  URL_REG,
  MSA_RULE_ADM,
} from '../../../../constants'
import {
  addManualrule,
  discoveryPing,
} from '../../../../actions/msa'
import './style/index.less'

const FormItem = Form.Item

class RegisterMsa extends React.Component {
  state = {
    ping: {},
    submitLoading: false,
  }

  uuid = 0

  componentDidMount() {
    this.add()
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, addManualrule, clusterID, history } = this.props
    const { validateFields, getFieldValue } = form
    validateFields((err, values) => {
      if (err) {
        return
      }
      this.setState({
        submitLoading: true,
      })
      const { appName, keys } = values
      const body = keys.map(k => {
        const host = getFieldValue(`host-${k}`)
        const port = getFieldValue(`port-${k}`)
        const healthProbe = getFieldValue(`healthProbe-${k}`)
        return {
          appName,
          host,
          port,
          healthProbe,
          rule: MSA_RULE_ADM,
        }
      })
      addManualrule(clusterID, body).then(res => {
        this.setState({
          submitLoading: false,
        })
        if (res.error) {
          return
        }
        notification.success({
          message: '注册成功',
          description: '手动注册完成，将在数秒内展示在微服务列表',
        })
        history.push('/msa-manage')
      })
    })
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    this.uuid++
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.uuid)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  checkHealth = k => {
    const { form, discoveryPing, clusterID } = this.props
    const { ping } = this.state
    const field = `healthProbe-${k}`
    form.validateFields([ field ], (err, values) => {
      if (err) {
        return
      }
      this.setState({
        ping: Object.assign({}, ping, { [k]: { loading: true } }),
      })
      discoveryPing(clusterID, values[field]).then(res => {
        const health = !res.error && res.response && res.response.result.code === 200
        this.setState({
          ping: Object.assign(
            {},
            ping,
            {
              [k]: {
                loading: false,
                health,
              },
            }),
        })
      })
    })
  }

  renderHealthCheck = k => {
    const { ping } = this.state
    const currentPing = ping[k]
    if (!currentPing) {
      return <a onClick={this.checkHealth.bind(this, k)}>测试健康状态</a>
    }
    if (currentPing.loading) {
      return <span><Icon type="loading" /> 测试健康状态中...</span>
    }
    if (currentPing.health) {
      return (
        <span className="success-status">
          <Icon type="check-circle" /> 健康，
          <a onClick={this.checkHealth.bind(this, k)}>点击重新检查</a>
        </span>
      )
    }
    return (
      <span className="error-status">
        <Icon type="close-circle" /> 连接失败，
        <a onClick={this.checkHealth.bind(this, k)}>点击重试</a>
      </span>
    )
  }

  render() {
    const { form } = this.props
    const { ping } = this.state
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const formItemLayoutLast = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <div key={k}>
          <div className="dotted"/>
          {
            index > 0 &&
            <Button
              className="msa-register-delete-instance"
              type="dashed"
              icon="close"
              onClick={() => this.remove(k)}
            />
          }
          <FormItem {...formItemLayout} label="服务地址">
            {getFieldDecorator(`host-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                pattern: HOST_REG,
                message: `请填写正确的服务地址，格式要求为：${HOST_REG.toString()}`,
              }],
            })(
              <Input placeholder="请确保 IP 或主机名可被当前集群访问（如 192.168.0.1）" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="服务端口">
            {getFieldDecorator(`port-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                type: 'integer',
                message: '请填写端口',
              }],
            })(
              <InputNumber placeholder="如 8080" min={1} max={65535} style={{ width: '30%' }} />
            )}
          </FormItem>
          <FormItem {...formItemLayoutLast} label="健康检查地址">
            {getFieldDecorator(`healthProbe-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                pattern: URL_REG,
                message: '请填写正确的地址',
              }],
            })(
              <Row gutter={16}>
                <Col span={19}>
                  <Input
                    placeholder="如 192.168.0.1:8080/healthcheck.html"
                    disabled={ping[k] && ping[k].loading}
                  />
                </Col>
                <Col span={5}>
                  {this.renderHealthCheck(k)}
                </Col>
              </Row>
            )}
          </FormItem>
        </div>
      )
    })
    return (
      <Card
        className="msa-register"
        title="注册微服务"
        noHovering
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="微服务名称">
            {getFieldDecorator('appName', {
              rules: [{
                required: true,
                whitespace: true,
                pattern: APP_NAME_REG,
                message: `请填写正确的微服务名称，格式要求为：${APP_NAME_REG.toString()}`,
              }],
            })(
              <Input placeholder="填写手动注册微服务名称" />
            )}
          </FormItem>
          <div style={{ paddingLeft: '36px' }}>微服务实例信息</div>
          {formItems}
          <div className="dotted"/>
          <a onClick={this.add} className="msa-register-add">
            <Icon type="plus-circle-o" />继续添加微服务实例
          </a>
          <FormItem
            wrapperCol={{
              span: 19, offset: 5,
            }}
          >
            <Button type="primary" htmlType="submit">
            提 交
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { project, cluster } = current.config
  const namespace = project.namespace
  const clusterID = cluster.id
  return {
    namespace,
    clusterID,
  }
}

export default connect(mapStateToProps, {
  addManualrule,
  discoveryPing,
})(Form.create()(RegisterMsa))
