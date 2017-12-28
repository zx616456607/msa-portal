/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: parameter setting
 *
 * 2017-12-05
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import { Row, Col, Input, Button, Icon, Form } from 'antd'
import './style/ParameterSetting.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

export default class ParameterSetting extends React.Component {
  state = {
    fields: {},
  }

  uuid = 0

  add = () => {
    this.uuid++
    const { form } = this.props
    const keys = form.getFieldValue('parameterKeys')
    const nextKeys = keys.concat(this.uuid)
    const validateKeys = []
    keys.forEach(key => {
      const errorCodeKey = `errorCode-${key}`
      const errorCodeAdviceKey = `errorCodeAdvice-${key}`
      const errorCodeDescKey = `errorCodeDesc-${key}`
      validateKeys.push(errorCodeKey)
      validateKeys.push(errorCodeAdviceKey)
      validateKeys.push(errorCodeDescKey)
    })
    form.validateFields(validateKeys, errors => {
      if (errors) {
        return
      }
      form.setFieldsValue({
        parameterKeys: nextKeys,
      })
    })
  }

  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('parameterKeys')
    form.setFieldsValue({
      parameterKeys: keys.filter(key => key !== k),
    })
  }

  toogleEdit = (key, isCancel) => {
    const { form } = this.props
    const { fields } = this.state
    const { setFieldsValue, getFieldValue, validateFields } = form
    const isEditKey = `isEdit-${key}`
    const errorCodeKey = `errorCode-${key}`
    const errorCodeAdviceKey = `errorCodeAdvice-${key}`
    const errorCodeDescKey = `errorCodeDesc-${key}`
    const isEdit = getFieldValue(isEditKey)
    let fieldsValue = {
      [isEditKey]: !isEdit,
    }
    if (isEdit && isCancel === true) {
      // cancel the change
      const currentField = fields[key]
      if (!currentField) {
        this.remove(key)
      } else {
        fieldsValue = Object.assign(
          {},
          fieldsValue,
          {
            [errorCodeKey]: currentField.errorCode,
            [errorCodeAdviceKey]: currentField.errorCodeAdvice,
            [errorCodeDescKey]: currentField.errorCodeDesc,
          }
        )
      }
      setFieldsValue(fieldsValue)
      return
    }
    if (!isEdit) {
      setFieldsValue(fieldsValue)
    } else {
      // validate fields
      const validateKeys = [ errorCodeKey, errorCodeAdviceKey, errorCodeDescKey ]
      validateFields(validateKeys, (errors, values) => {
        if (errors) {
          return
        }
        // save fields
        this.setState({
          fields: Object.assign(
            {},
            fields,
            {
              [key]: {
                errorCode: values[errorCodeKey],
                errorCodeAdvice: values[errorCodeAdviceKey],
                errorCodeDesc: values[errorCodeDescKey],
              },
            }
          ),
        })
        setFieldsValue(fieldsValue)
      })
    }
  }

  renderItem = key => {
    const { form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const isEditKey = `isEdit-${key}`
    const errorCodeKey = `errorCode-${key}`
    const errorCodeAdviceKey = `errorCodeAdvice-${key}`
    const errorCodeDescKey = `errorCodeDesc-${key}`
    getFieldDecorator(isEditKey, { initialValue: true })
    const isEdit = getFieldValue(isEditKey)
    return [
      <Row key={`text-${key}`} className={isEdit ? 'hide' : ''}>
        <Col span={6}>
          <div className="parameter-setting-text txt-of-ellipsis">
            {getFieldValue(errorCodeKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="parameter-setting-text txt-of-ellipsis">
            {getFieldValue(errorCodeAdviceKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="parameter-setting-text txt-of-ellipsis">
            {getFieldValue(errorCodeDescKey)}
          </div>
        </Col>
        <Col span={6} className="btns">
          <Button type="dashed" icon="edit" onClick={this.toogleEdit.bind(this, key)} />
          <Button type="dashed" icon="delete" onClick={this.remove.bind(this, key)} />
        </Col>
      </Row>,
      <Row key={`fields-${key}`} className={!isEdit ? 'hide' : ''}>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeKey, {
              rules: [{
                required: true, message: 'Please input errorCode!',
              }],
            })(
              <Input placeholder="请填写错误代码" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeAdviceKey, {
              rules: [{
                required: true, message: 'Please input errorCodeAdvice!',
              }],
            })(
              <Input placeholder="请填写处置建议" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeDescKey)(
              <Input placeholder="请填写说明" />
            )}
          </FormItem>
        </Col>
        <Col span={6} className="btns">
          <Button type="dashed" icon="check" onClick={this.toogleEdit.bind(this, key)} />
          <Button type="dashed" icon="close" onClick={this.toogleEdit.bind(this, key, true)} />
        </Col>
      </Row>,
    ]
  }

  render() {
    const { className, form, formItemLayout } = this.props
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('parameterKeys', { initialValue: [] })
    const keys = getFieldValue('parameterKeys')
    const classNames = ClassNames({
      'parameter-setting': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        {
          getFieldValue('protocol') !== getFieldValue('serviceProtocol') &&
          [
            <div key="title" className="second-title">参数映射</div>,
            <div key="dody" className="parameter-mapping-body">
              <FormItem
                {...formItemLayout}
                label="请求转换模版"
              >
                {getFieldDecorator('requestXslt')(
                  <TextArea placeholder="请提供请求转换模版" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="响应转换模版"
              >
                {getFieldDecorator('responseXslt')(
                  <TextArea placeholder="请提供响应转换模版" />
                )}
              </FormItem>
            </div>,
          ]
        }
        <div className="second-title">编辑错误代码</div>
        <div className="parameter-setting-body">
          <div className="parameter-setting-box">
            <Row className="parameter-setting-box-header">
              <Col span={6}>错误代码</Col>
              <Col span={6}>处置建议</Col>
              <Col span={6}>说明</Col>
              <Col span={6}>操作</Col>
            </Row>
            {
              keys.map(this.renderItem)
            }
            {
              keys.length === 0 &&
              <Row className="empty-text">空空如也~</Row>
            }
          </div>
          <a className="parameter-setting-add-btn" onClick={this.add}>
            <Icon type="plus-circle-o" /> 添加一条错误代码
          </a>
        </div>
      </div>
    )
  }
}
