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

export default class ParameterSetting extends React.Component {
  state = {
    fields: {},
  }

  uuid = 0

  add = () => {
    this.uuid++
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.uuid)
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  toogleEdit = (key, isCancel) => {
    const { form } = this.props
    const { fields } = this.state
    const { setFieldsValue, getFieldValue } = form
    const isEditKey = `isEdit-${key}`
    const errorCodeKey = `errorCode-${key}`
    const errorCodeAdviceKey = `errorCodeAdvice-${key}`
    const errorCodeDescKey = `errorCodeDesc-${key}`
    const isEdit = getFieldValue(isEditKey)
    let fieldsValue = {
      [isEditKey]: !isEdit,
    }
    if (!isEdit) {
      // save fields
      const errorCode = getFieldValue(errorCodeKey)
      const errorCodeAdvice = getFieldValue(errorCodeAdviceKey)
      const errorCodeDesc = getFieldValue(errorCodeDescKey)
      this.setState({
        fields: Object.assign(
          {},
          fields,
          { [key]: { errorCode, errorCodeAdvice, errorCodeDesc } }
        ),
      })
    } else if (isCancel === true) {
      // cancel the change
      const currentField = fields[key] || []
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
          <div className="txt-of-ellipsis">{getFieldValue(errorCodeKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="txt-of-ellipsis">{getFieldValue(errorCodeAdviceKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="txt-of-ellipsis">{getFieldValue(errorCodeDescKey)}
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
              <Input />
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
              <Input />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeDescKey, {
              rules: [{
                required: true, message: 'Please input errorCodeDesc!',
              }],
            })(
              <Input />
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
    const { className, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const classNames = ClassNames({
      'parameter-setting': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
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
              <Row>暂无</Row>
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
