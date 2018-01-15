/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: step 3
 *
 * 2018-01-09
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import {
  Button,
} from 'antd'
import ErrorCode from './ErrorCode'

export default class Step2 extends React.Component {
  validateFieldsAndGoNext = () => {
    const { form, changeStep } = this.props
    const { getFieldsValue, validateFieldsAndScroll } = form
    let fields = []
    const values = getFieldsValue()
    const { protocol, openProtocol, errCodeKeys } = values
    if (protocol !== openProtocol) {
      fields = [ 'requestXslt', 'responseXslt' ]
    }
    errCodeKeys.forEach(key => {
      const errorCodeKey = `code-${key}`
      const errorCodeAdviceKey = `advice-${key}`
      fields.push(errorCodeKey, errorCodeAdviceKey)
    })
    validateFieldsAndScroll(fields, errors => {
      if (errors) {
        return
      }
      changeStep(2)
    })
  }

  render() {
    const {
      className, currentStep, changeStep, ...otherProps
    } = this.props
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <ErrorCode {...otherProps} />
      </div>,
      currentStep === 1 &&
      <div className="btns" key="btns">
        <Button
          key="previous"
          onClick={() => changeStep(0)}
        >
        上一步
        </Button>
        <Button
          type="primary"
          key="next"
          onClick={this.validateFieldsAndGoNext}
        >
        下一步
        </Button>
      </div>,
    ]
  }
}
