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
import { Input, Modal, Form, Switch, Radio, Select, notification, Tooltip, Icon, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  APP_NAME_REG,
  URL_REG,
  ROUTE_REG,
  ASYNC_VALIDATOR_TIMEOUT,
} from '../../../../constants'
import * as msaAction from '../../../../actions/msa'
import * as gateWayAction from '../../../../actions/gateway'
import {
  msaListSlt,
} from '../../../../selectors/msa'
import { getDeepValue, sleep } from '../../../../common/utils'
import isEmpty from 'lodash/isEmpty';
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
let uidd = 0

@withNamespaces('springCloudRouteManage')
class RoutingRuleModal extends React.Component {
  state = {
    confirmLoading: false,
    globalData: { keys: [] },
    diyData: { keys: [ 0 ] },
  }

  async componentDidMount() {
    const { currentRoute, form, getGlobalRuleSetting, clusterID } = this.props
    this.loadMsaList()
    await getGlobalRuleSetting(clusterID)
    this.initForm()
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

  componentWillUnmount() {
    this.props.form.resetFields()
  }

  initForm = () => {
    const { globalRule, currentRoute } = this.props
    if (!currentRoute || !currentRoute.headerFlag || currentRoute.headerFlag === 'global') {
      const headers = globalRule.split(',')
      if (isEmpty(globalRule) || isEmpty(headers)) {
        return
      }
      const globalData = { keys: [] }
      headers.forEach((item, index) => {
        globalData.keys.push(index)
        globalData[`header-${index}`] = item
      })
      this.setState({
        globalData,
      })
      return
    }
    const { sensitiveHeaders } = currentRoute
    if (!sensitiveHeaders) {
      return
    }
    const headers = sensitiveHeaders.split(',')
    const diyData = { keys: [] }
    headers.forEach((item, index) => {
      diyData.keys.push(index)
      diyData[`header-${index}`] = item
    })
    this.setState({
      diyData,
    })
  }

  loadMsaList = () => {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  confirmModal = () => {
    const {
      clusterID, form, addGatewayRoute, onCancel, loadRoutesList, currentRoute,
      updateGatewayRoute, globalRule, t,
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
      'headerFlag',
    ]
    const urlType = getFieldValue('msa-url-type')
    if (urlType === 'id') {
      validateArray.push('serviceId')
    } else {
      validateArray.push('url')
    }
    const headerFlag = getFieldValue('headerFlag')
    if (headerFlag === 'custom') {
      validateArray.push('keys')
      const keys = getFieldValue('keys')
      keys.forEach(key => {
        validateArray.push(`header-${key}`)
      })
    }
    validateFields(validateArray, (err, values) => {
      if (err) {
        return
      }
      const body = Object.assign({}, {
        routeId: values.routeId,
        path: values.path,
        description: values.description,
        stripPrefix: !!values.stripPrefix,
        retryable: values.retryable,
        status: values.status,
        url: values.url,
        serviceId: values.serviceId,
        headerFlag: values.headerFlag,
        sensitiveHeaders: globalRule,
      })
      delete body['msa-url-type']
      if (values['msa-url-type'] === 'id') {
        delete body.url
      } else {
        delete body.serviceId
      }
      const sensitiveHeaders = []
      if (values.headerFlag === 'custom') {
        const keys = values.keys
        keys.forEach(key => {
          sensitiveHeaders.push(values[`header-${key}`])
        })
        Object.assign(body, {
          sensitiveHeaders: sensitiveHeaders.join(),
        })
      }
      this.setState({
        confirmLoading: true,
      })
      if (!currentRoute) {
        addGatewayRoute(clusterID, body, { isHandleError: true }).then(res => {
          this.setState({
            confirmLoading: false,
          })
          if (res.error) {
            let message = res.message
            if (res.error.indexOf('path exist') > -1) {
              message = t('new.pathExist')
            }
            notification.warn({
              message,
            })
            return
          }
          notification.success({
            message: t('new.addRuleSuccess'),
          })
          onCancel()
          loadRoutesList()
        })
        return
      }
      updateGatewayRoute(clusterID, currentRoute.id, body, { isHandleError: true }).then(res => {
        this.setState({
          confirmLoading: false,
        })
        if (res.error) {
          let message = res.message
          if (res.error.indexOf('path exist') > -1) {
            message = t('new.pathExist')
          }
          notification.warn({
            message,
          })
          return
        }
        notification.success({
          message: t('new.editRuleScs'),
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
    const { checkRouteName, clusterID, currentRoute, t } = this.props
    clearTimeout(this.routeNameTimeout)
    if (currentRoute && (currentRoute.routeId === value)) {
      return callback()
    }
    if (!value) {
      return callback()
    }
    if (!APP_NAME_REG.test(value)) {
      return callback(t('constants.APP_NAME_REG_NOTICE', {
        ns: 'common',
      }))
    }
    this.routeNameTimeout = setTimeout(() => {
      checkRouteName(clusterID, value).then(res => {
        if (res.response.result.data.has) {
          callback(t('new.routeNameExist'))
        } else {
          callback()
        }
      }).catch(() => {
        callback(t('new.requestErr'))
      })
    }, ASYNC_VALIDATOR_TIMEOUT)
  }
  routePathCheck = (rules, value, cb) => {
    const { checkRoutePath, clusterID, currentRoute, t } = this.props
    clearTimeout(this.routePathTimeout)
    if (currentRoute && (currentRoute.path === value)) {
      return cb()
    }
    if (!value) {
      return cb()
    }
    if (!ROUTE_REG.test(value)) {
      return cb(t('new.startWith'))
    }
    if (/^\/[*]+(\/.+)?$/.test(value)) {
      return cb(t('new.firstRouteNot'))
    }
    this.routePathTimeout = setTimeout(() => {
      checkRoutePath(clusterID, value).then(res => {
        if (res.response.result.data.has) {
          cb(t('new.routePathExist'))
        } else {
          cb()
        }
      }).catch(() => {
        cb(t('new.requestErr'))
      })
    }, ASYNC_VALIDATOR_TIMEOUT)
  }
  checkServiceAddress = (rules, value, cb) => {
    const { t } = this.props
    if (!value) {
      return cb()
    }
    if (!URL_REG.test(value)) {
      return cb(t('new.serverPathErr'))
    }
    let hasError = false
    const newValue = value.replace(/https?:\/\/(www.)?/, '')
    const newRep = newValue.split('.')
    // number and port + router regex
    const portRouter = /^\d+(:([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/[a-zA-Z0-9_\-\/\?#]*)?$/
    if (/^\d/.test(newRep[0])) { // first has number in ip+port regex
      newValue.split('.').every(item => {
        if (parseInt(item) > 255) {
          hasError = true
          return false
        }
        if (!portRouter.test(item)) {
          hasError = true
          return false
        }
        return true
      })
    }
    if (hasError) {
      return cb(t('new.serverIpErr'))
    }
    cb()
  }

  addHeader = () => {
    const { getFieldValue, setFieldsValue, validateFields } = this.props.form
    const keys = getFieldValue('keys')
    const validateArray = []
    if (!isEmpty(keys)) {
      keys.forEach(key => {
        validateArray.push(`header-${key}`)
      })
    }
    validateFields(validateArray, errors => {
      if (errors) {
        return
      }
      uidd++
      setFieldsValue({
        keys: keys.concat(uidd),
      })
      this.setState(({ diyData }) => {
        return {
          diyData: {
            ...diyData,
            keys: keys.concat(uidd),
            [`header-${uidd}`]: '',
          },
        }
      })
    })
  }

  removeHeader = key => {
    const { getFieldValue, setFieldsValue } = this.props.form
    const keys = getFieldValue('keys')
    setFieldsValue({
      keys: keys.filter(_key => _key !== key),
    })
    this.setState(({ diyData }) => {
      delete diyData[`header-${key}`]
      return {
        diyData: {
          ...diyData,
          keys: keys.filter(_key => _key !== key),
        },
      }
    })
  }

  checkHeader = (rules, value, callback, key) => {
    const { getFieldValue } = this.props.form
    const keys = getFieldValue('keys')
    const currentHeader = getFieldValue(`header-${key}`)
    const isExisted = keys
      .filter(_key => key !== _key)
      .some(_key => currentHeader === getFieldValue(`header-${_key}`))
    if (isExisted) {
      return callback(this.props.t('new.headerExist'))
    }
    callback()
  }

  headerChange = (value, key) => {
    this.setState(({ diyData }) => {
      return {
        diyData: {
          ...diyData,
          [`header-${key}`]: value,
        },
      }
    })
  }

  renderHeaders = () => {
    const { globalData, diyData } = this.state
    const { form } = this.props
    const { getFieldValue, getFieldDecorator } = form
    const keys = getFieldValue('keys')
    const type = getFieldValue('headerFlag')
    if (isEmpty(keys)) {
      return
    }
    const formItemLayout = {
      wrapperCol: { offset: 6, span: 18 },
    }
    return keys.map(key => {
      return <FormItem
        {...formItemLayout}
      >
        <Row gutter={8}>
          <Col span={20}>
            {
              getFieldDecorator(`header-${key}`, {
                rules: [{
                  validator: (rules, value, callback) =>
                    this.checkHeader(rules, value, callback, key),
                }],
                initialValue: type === 'global' ? globalData[`header-${key}`] : diyData[`header-${key}`],
                onChange: e => this.headerChange(e.target.value, key),
              })(
                <Input disabled={type === 'global'}/>
              )
            }
          </Col>
          <Col span={4}>
            {
              type === 'custom' &&
              <Icon type={'delete'} className="pointer" onClick={() => this.removeHeader(key)}/>
            }
          </Col>
        </Row>
      </FormItem>
    })
  }

  changeHeaderType = async e => {
    const { globalData, diyData } = this.state
    const { form } = this.props
    const { setFieldsValue, getFieldValue, resetFields } = form
    const { value } = e.target
    const resetArray = [ 'keys' ]
    const keys = getFieldValue('keys')
    keys.forEach(key => {
      resetArray.push(`header-${key}`)
    })
    resetFields(resetArray)
    await sleep()
    if (value === 'global') {
      setFieldsValue({
        ...globalData,
      })
      return
    }
    setFieldsValue({
      ...diyData,
    })
  }

  render() {
    const { globalData, diyData } = this.state
    const { form, msaList, visible, onCancel, currentRoute, t } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const headerFlag = getFieldValue('headerFlag')
    getFieldDecorator('keys', {
      initialValue: headerFlag === 'global' ? globalData.keys : diyData.keys,
    })
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const titleText = currentRoute ? t('table.modify') : t('new.add')
    const renderNotice = (
      <span>
        {t('table.path')}&nbsp;
        <Tooltip overlayClassName="routingTooltip" title={(
          <div>
            <div key="notice-1">{t('new.exactMatch1')}</div>
            <div key="notice-2">{t('new.singlePath')}</div>
            <div key="notice-3">{t('new.multiPath')}</div>
          </div>
        )}>
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    )
    return (
      <Modal
        title={t('new.titleRouteRule', {
          replace: { titleText },
        })}
        width={560}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={onCancel}
        confirmLoading={this.state.confirmLoading}
      >
        <FormItem {...formItemLayout} label={t('table.name')}>
          {getFieldDecorator('routeId', {
            rules: [{
              required: true,
              whitespace: true,
              message: t('new.inputName'),
            }, {
              validator: this.routeNameCheck,
            }],
          })(
            <Input placeholder={t('new.inputRouteName')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={renderNotice}>
          {getFieldDecorator('path', {
            rules: [{
              required: true,
              message: t('new.inputPath'),
            }, {
              validator: this.routePathCheck,
            }],
          })(
            <Input placeholder="/service/demo/**" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={t('table.targetType')}
        >
          {getFieldDecorator('msa-url-type', {
            initialValue: 'id',
            rules: [{
              required: true,
            }],
          })(
            <RadioGroup>
              <Radio value="id">{t('table.microId')}</Radio>
              <Radio value="url">{t('table.url')}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          getFieldValue('msa-url-type') === 'id'
            ? <FormItem {...formItemLayout} label={t('table.targetUrl')}>
              {getFieldDecorator('serviceId', {
                rules: [{
                  required: true,
                  message: t('new.choseOneMicro'),
                }],
              })(
                <Select style={{ width: '100%' }} placeholder={t('new.choseMicro')}>
                  {
                    msaList.map(msa => <Option key={msa.appName}>{msa.appName}</Option>)
                  }
                </Select>
              )}
            </FormItem>
            : <FormItem {...formItemLayout} label={t('table.targetUrl')}>
              {getFieldDecorator('url', {
                rules: [{
                  required: true,
                  whitespace: true,
                  // pattern: IP_REG,
                  message: t('new.plsInputPath'),
                }, {
                  validator: this.checkServiceAddress,
                }],
              })(
                <Input placeholder={t('new.iptFullUrl')} />
              )}
            </FormItem>
        }
        <FormItem {...formItemLayout} label={t('table.desc')}>
          {getFieldDecorator('description')(
            <Input.TextArea placeholder={t('new.iptRuleDesc')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('table.noPrefix')}>
          {getFieldDecorator('stripPrefix', { valuePropName: 'checked' })(
            <Switch checkedChildren={t('new.open')} unCheckedChildren={t('new.close')} />
          )}
          <span className="empty-text">&nbsp;&nbsp;{t('new.ifNoPre')}</span>
        </FormItem>
        <FormItem {...formItemLayout} label={t('new.failRetry')}>
          {getFieldDecorator('retryable', { valuePropName: 'checked' })(
            <Switch checkedChildren={t('new.open')} unCheckedChildren={t('new.close')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t('new.defaultOpen')}>
          {getFieldDecorator('status', { valuePropName: 'checked' })(
            <Switch checkedChildren={t('new.open')} unCheckedChildren={t('new.close')} />
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
        <Row>
          <Col span={6} style={{ textAlign: 'right' }}>
            {t('table.sensitive')}：
          </Col>
          <Col span={16} className="empty-text">{t('new.noSensitiveToDown')}</Col>
        </Row>
        <FormItem
          wrapperCol={{
            offset: formItemLayout.labelCol.span,
            span: formItemLayout.wrapperCol.span,
          }}
          label={''}
        >
          {getFieldDecorator('headerFlag', {
            initialValue: currentRoute ? currentRoute.headerFlag : 'global',
            onChange: this.changeHeaderType,
          })(
            <RadioGroup>
              <Radio value="global">{t('new.globalDefaultSensitive')}</Radio>
              <Radio value="custom">{t('new.customSensitive')}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {this.renderHeaders()}
        {
          headerFlag === 'custom' &&
          <Row>
            <Col offset={6} className="primary-color">
              <span onClick={this.addHeader} className="pointer">
                <Icon type="plus-circle"/> {t('new.add')} Header
              </span>
            </Col>
          </Row>
        }
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  const globalRule = getDeepValue(state, [ 'gateway', 'globalRuleSetting', 'headers' ])
  return {
    clusterID: id,
    ...msaListSlt(state),
    globalRule,
  }
}

export default connect(mapStateToProps, {
  getMsaList: msaAction.getMsaList,
  addGatewayRoute: gateWayAction.addGatewayRoute,
  updateGatewayRoute: gateWayAction.updateGatewayRoute,
  checkRouteName: gateWayAction.checkRouteName,
  checkRoutePath: gateWayAction.checkRoutePath,
  getGlobalRuleSetting: gateWayAction.getGlobalRuleSetting,
})(Form.create()(RoutingRuleModal))
