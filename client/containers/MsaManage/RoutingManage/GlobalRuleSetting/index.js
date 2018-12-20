/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Global Rule setting
 *
 * 2018-11-12
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Icon, Row, Col, notification } from 'antd'
import isEmpty from 'lodash/isEmpty'
import * as gatewayActions from '../../../../actions/gateway'
import { getDeepValue } from '../../../../common/utils';
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item
let uidd = 0

const mapStateToProps = state => {
  const clusterID = getDeepValue(state, [ 'current', 'config', 'cluster', 'id' ])
  const globalRule = getDeepValue(state, [ 'gateway', 'globalRuleSetting', 'headers' ])
  return {
    clusterID,
    globalRule,
  }
}

@connect(mapStateToProps, {
  getGlobalRuleSetting: gatewayActions.getGlobalRuleSetting,
  updateGlobalRuleSetting: gatewayActions.updateGlobalRuleSetting,
})
@withNamespaces('springCloudRouteManage')
class GlobalRuleSetting extends React.Component {

  state = {
    initialData: { keys: [] },
  }

  async componentDidMount() {
    const { getGlobalRuleSetting, clusterID } = this.props
    await getGlobalRuleSetting(clusterID)
    this.initForm()
  }

  initForm = () => {
    const { globalRule } = this.props
    if (isEmpty(globalRule)) {
      return
    }
    const headers = globalRule.split(',')
    const initialData = { keys: [] }
    headers.forEach((item, index) => {
      uidd = index
      initialData.keys.push(uidd)
      initialData[`header-${index}`] = item
    })
    this.setState({
      initialData,
    })
  }

  componentWillUnmount() {
    const { form } = this.props
    const { resetFields } = form
    uidd = 0
    resetFields()
  }

  handleConfirm = async () => {
    const { updateGlobalRuleSetting, clusterID, form, onCancel, t } = this.props
    const { validateFields } = form
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        loading: true,
      })
      const { keys } = values
      const headers = []
      keys.forEach(key => {
        headers.push(values[`header-${key}`])
      })
      const res = await updateGlobalRuleSetting(clusterID,
        { headers: headers.join() }, { isHandleError: true })
      this.setState({
        loading: false,
      })
      if (res.error) {
        return notification.warn({
          message: t('global.editConfFail'),
        })
      }
      notification.success({
        message: t('global.editConfScs'),
      })
      onCancel()
    })
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
    })
  }

  removeHeader = key => {
    const { getFieldValue, setFieldsValue } = this.props.form
    setFieldsValue({
      keys: getFieldValue('keys').filter(_key => _key !== key),
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
      return callback(this.props.t('global.headerExist'))
    }
    callback()
  }

  renderHeaders = () => {
    const { form, t } = this.props
    const { getFieldValue, getFieldDecorator } = form
    const keys = getFieldValue('keys')
    if (isEmpty(keys)) {
      return
    }
    const formItemLayout = {
      wrapperCol: { offset: 5, span: 19 },
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
                  required: true,
                  whitespace: true,
                  message: t('global.headerNotNull'),
                }, {
                  validator: (rules, value, callback) =>
                    this.checkHeader(rules, value, callback, key),
                }],
                initialValue: this.state.initialData[`header-${key}`],
              })(
                <Input/>
              )
            }
          </Col>
          <Col span={4}>
            <Icon type={'delete'} className="pointer" onClick={() => this.removeHeader(key)}/>
          </Col>
        </Row>
      </FormItem>
    })
  }

  render() {
    const { loading, initialData } = this.state
    const { visible, onCancel, form, t } = this.props
    const { getFieldDecorator } = form
    getFieldDecorator('keys', {
      initialValue: initialData.keys,
    })
    return (
      <Modal
        title={t('global.routeConf')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        closable={false}
        confirmLoading={loading}
      >
        <Form>
          <Row type="flex" style={{ marginBottom: 16 }}>
            <Col span={5}>
              {t('global.defaultSensitiveH')}
            </Col>
            <Col span={19} className="empty-text">
              {t('global.notPassFor')}
            </Col>
          </Row>
          {this.renderHeaders()}
          <Row>
            <Col offset={5} className="primary-color">
              <span onClick={this.addHeader} className="pointer">
                <Icon type="plus-circle"/> {t('global.addHeader')}
              </span>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(GlobalRuleSetting)
