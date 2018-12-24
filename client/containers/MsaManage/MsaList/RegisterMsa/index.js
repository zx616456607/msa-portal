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
import { parse as parseQuerystring } from 'query-string'
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
  Tooltip,
} from 'antd'
import {
  // APP_NAME_REG,
  // APP_NAME_REG_NOTICE,
  // HOST_REG,
  IP_REG,
  HOSTNAME_REG,
  URL_REG,
} from '../../../../constants'
import {
  addManualrules,
  discoveryPing,
  addInstancesIntoManualrules,
} from '../../../../actions/msa'
import './style/index.less'
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item

@withNamespaces('MsaList')
class RegisterMsa extends React.Component {
  state = {
    ping: {},
    submitLoading: false,
    mode: 'create',
    ruleId: null,
  }

  uuid = 0

  componentDidMount() {
    const { location, form } = this.props
    const { appName, id, mode } = parseQuerystring(location.search)
    if (appName && id && mode) {
      this.setState({
        mode,
        ruleId: id,
      })
    }
    form.setFieldsValue({
      appName,
    })

    this.add()
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, t } = this.props
    const { validateFields } = form
    validateFields((err, values) => {
      if (err) {
        return
      }
      let hasRepeat = false
      values.keys.forEach(k => {
        values.keys.every(v => {
          if (v === k) {
            return false
          }
          if (`${values[`host-${v}`]}:${values[`port-${v}`]}` === `${values[`host-${k}`]}:${values[`port-${k}`]}`) {
            hasRepeat = true
            return false
          }
          return true
        })
      })
      if (hasRepeat) {
        notification.warn({
          message: t('register.portRepeat'),
        })
        return
      }
      this.setState({
        submitLoading: true,
      })
      if (this.state.mode === 'add') {
        this.addInstances(values)
        return
      }
      this.createManualrules(values)
    })
  }

  createManualrules = values => {
    const { form, addManualrules, clusterID, history, t } = this.props
    const { getFieldValue } = form
    const { appName, keys } = values
    const instances = keys.map(k => {
      const host = getFieldValue(`host-${k}`)
      const port = getFieldValue(`port-${k}`)
      const healthProbe = getFieldValue(`healthProbe-${k}`)
      return {
        instanceId: `${host}:${appName}:${port}`,
        detail: JSON.stringify({
          host,
          ip: host,
          port,
          healthProbe,
          secure: false,
        }),
      }
    })
    const body = [
      {
        appName,
        instances,
      },
    ]
    addManualrules(clusterID, body, { isHandleError: true }).then(res => {
      this.setState({
        submitLoading: false,
      })
      if (res.error) {
        let description = ''
        if (res.status === 500) {
          if (res.error === 'service name cannot be same with other service\'s name') {
            description = t('register.appNameRepeat')
          }
          if (res.error === 'host:port cannot be same with other instances') {
            description = t('register.portRepeat')
          }
        }
        notification.warn({
          message: t('register.registerFailed'),
          description,
        })
        return
      }
      notification.success({
        message: t('register.registerSucc'),
        description: t('register.registerSuccDesc'),
      })
      history.push('/msa-manage')
    })
  }

  addInstances = values => {
    const { form, addInstancesIntoManualrules, clusterID, history, t } = this.props
    const { getFieldValue } = form
    const { appName, keys } = values
    const { ruleId } = this.state
    const body = keys.map(k => {
      const host = getFieldValue(`host-${k}`)
      const port = getFieldValue(`port-${k}`)
      const healthProbe = getFieldValue(`healthProbe-${k}`)
      return {
        instanceId: `${host}:${appName}:${port}`,
        detail: JSON.stringify({
          host,
          ip: host,
          port,
          healthProbe,
          secure: false,
        }),
        ruleId,
      }
    })
    addInstancesIntoManualrules(clusterID, body, { isHandleError: true }).then(res => {
      this.setState({
        submitLoading: false,
      })
      if (res.error) {
        let description = ''
        if (res.status === 500) {
          if (res.error === 'host:port cannot be same with other instances') {
            description = t('register.portRepeat')
          }
        }
        notification.warn({
          message: t('register.addInstFailed'),
          description,
        })
        return
      }
      notification.success({
        message: t('register.addInstSucc'),
      })
      history.push(`/msa-manage/detail/${appName}`)
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
    const { t } = this.props
    const { ping } = this.state
    const currentPing = ping[k]
    if (!currentPing) {
      return <a onClick={this.checkHealth.bind(this, k)}>{t('register.testHealth')}</a>
    }
    if (currentPing.loading) {
      return <span><Icon type="loading" /> {t('register.testHealthing')}</span>
    }
    if (currentPing.health) {
      return (
        <span className="success-status">
          <Icon type="check-circle" /> {t('register.healthy')}
          <a onClick={this.checkHealth.bind(this, k)}>{t('register.reTestHealth')}</a>
        </span>
      )
    }
    return (
      <span className="error-status">
        <Icon type="close-circle" /> {t('register.testFalied')}
        <a onClick={this.checkHealth.bind(this, k)}>{t('register.reTry')}</a>
      </span>
    )
  }

  render() {
    const { form, t } = this.props
    const { ping, mode } = this.state
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
          <FormItem {...formItemLayout} label={t('register.serverAddr')}>
            {getFieldDecorator(`host-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                validator: (rule, value, cb) => {
                  if (HOSTNAME_REG.test(value) || IP_REG.test(value)) {
                    return cb()
                  }
                  cb(t('register.pleaseEnterCorrect'))
                },
              }],
            })(
              <Input placeholder={t('register.hostPlaceHolder')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={t('register.port')}>
            {getFieldDecorator(`port-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                type: 'integer',
                validator: (rule, value, cb) => {
                  if (value === undefined || !String(value)) return cb(new Error(t('register.pleaseEnterPort')))
                  if (value < 1 || value > 65535) return cb(new Error(t('register.pleaseEnterCorrectPort')))
                  cb()
                },
              }],
            })(
              <InputNumber placeholder={t('register.portPlaceholder')} min={1} max={65535} style={{ width: '30%' }} />
            )}
          </FormItem>
          <FormItem {...formItemLayoutLast} label={
            <span>
              {t('register.healthAddr')}
              <Tooltip
                title={t('register.healthAddrTooltip')}
              ><Icon type="question-circle-o" className="msa-register-tip"/>
              </Tooltip>
            </span>
          }
          >
            {getFieldDecorator(`healthProbe-${k}`, {
              rules: [{
                required: true,
                whitespace: true,
                pattern: URL_REG,
                message: t('register.pleaseEnterCorrectAddr'),
              }],
            })(
              <Row gutter={16}>
                <Col span={19}>
                  <Input
                    placeholder={t('register.healthPorbePlaceholder')}
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
    const isAddMode = mode === 'add'
    return (
      <Card
        className="msa-register"
        title={
          isAddMode
            ? t('list.add')
            : t('list.registerMsa')
        }
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={t('list.appName')}>
            {getFieldDecorator('appName', {
              rules: [{
                required: true,
                whitespace: true,
                pattern: /^[a-z][a-z0-9\-]{1,48}[a-z0-9]$/,
                message: t('register.appNameMessage'),
              }],
            })(
              <Input placeholder={t('register.appNamePlaceHolder')} disabled={isAddMode}/>
            )}
          </FormItem>
          <div style={{ paddingLeft: '36px' }}>{t('register.appMsg')}</div>
          {formItems}
          <div className="dotted"/>
          <a onClick={this.add} className="msa-register-add">
            <Icon type="plus-circle-o" />{t('register.addMore')}
          </a>
          <FormItem
            wrapperCol={{
              span: 19, offset: 5,
            }}
          >
            <Button type="primary" htmlType="submit">
              {t('register.submit')}
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
  addManualrules,
  discoveryPing,
  addInstancesIntoManualrules,
})(Form.create()(RegisterMsa))
