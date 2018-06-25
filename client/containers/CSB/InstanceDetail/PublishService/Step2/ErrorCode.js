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
import isEmpty from 'lodash/isEmpty'
import { Row, Col, Input, Button, Icon, Form } from 'antd'
import './style/ErrorCode.less'
import { sleep } from '../../../../../common/utils'

const FormItem = Form.Item

export default class ErrorCode extends React.Component {
  state = {
    fields: {},
  }

  uuid = 0

  async componentDidMount() {
    const { data, form } = this.props
    if (isEmpty(data)) {
      return
    }
    const { errorCode } = data
    const parseError = JSON.parse(errorCode)
    if (isEmpty(parseError)) {
      return
    }
    const keys = []
    const errObj = {}
    parseError.forEach((err, index) => {
      this.uuid = index
      keys.push(index)
      const { code, advice, description } = err
      Object.assign(errObj, {
        [`code-${index}`]: code,
        [`advice-${index}`]: advice,
        [`description-${index}`]: description,
      })
    })
    form.setFieldsValue({
      errCodeKeys: keys,
    })
    await sleep()
    form.setFieldsValue({
      ...errObj,
    })
  }

  add = () => {
    this.uuid++
    const { form } = this.props
    const keys = form.getFieldValue('errCodeKeys')
    const nextKeys = keys.concat(this.uuid)
    const validateKeys = []
    keys.forEach(key => {
      const errorCodeKey = `code-${key}`
      const errorCodeAdviceKey = `advice-${key}`
      const errorCodeDescKey = `description-${key}`
      validateKeys.push(errorCodeKey)
      validateKeys.push(errorCodeAdviceKey)
      validateKeys.push(errorCodeDescKey)
    })
    form.validateFields(validateKeys, errors => {
      if (errors) {
        return
      }
      form.setFieldsValue({
        errCodeKeys: nextKeys,
      })
    })
  }

  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('errCodeKeys')
    form.setFieldsValue({
      errCodeKeys: keys.filter(key => key !== k),
    })
  }

  toogleEdit = (key, isCancel) => {
    const { form } = this.props
    const { fields } = this.state
    const { setFieldsValue, getFieldValue, validateFields } = form
    const isEditKey = `isEdit-${key}`
    const errorCodeKey = `code-${key}`
    const errorCodeAdviceKey = `advice-${key}`
    const errorCodeDescKey = `description-${key}`
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
    const errorCodeKey = `code-${key}`
    const errorCodeAdviceKey = `advice-${key}`
    const errorCodeDescKey = `description-${key}`
    getFieldDecorator(isEditKey, { initialValue: true })
    const isEdit = getFieldValue(isEditKey)
    const { code, advice, description } = key
    return [
      <Row key={`text-${key}`} className={isEdit ? 'hide' : ''}>
        <Col span={6}>
          <div className="error-code-text txt-of-ellipsis">
            {getFieldValue(errorCodeKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="error-code-text txt-of-ellipsis">
            {getFieldValue(errorCodeAdviceKey)}
          </div>
        </Col>
        <Col span={6}>
          <div className="error-code-text txt-of-ellipsis">
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
              initialValue: code || '',
              rules: [{
                required: true,
                message: '请填写错误代码!',
              }],
            })(
              <Input placeholder="请填写错误代码" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeAdviceKey, {
              initialValue: advice || '',
              rules: [{
                required: true,
                message: '请填写处置建议!',
              }],
            })(
              <Input placeholder="请填写处置建议" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator(errorCodeDescKey, {
              initialValue: description || '',
            })(
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
    const { className, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('errCodeKeys', { initialValue: [] })
    const keys = getFieldValue('errCodeKeys')
    const classNames = ClassNames({
      'error-code': true,
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <div className="second-title">编辑错误代码</div>
        <div className="error-code-body">
          <div className="error-code-box">
            <Row className="error-code-box-header">
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
          <a className="error-code-add-btn" onClick={this.add}>
            <Icon type="plus-circle-o" /> 添加一条错误代码
          </a>
        </div>
      </div>
    )
  }
}
