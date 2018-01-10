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
import ParameterSetting from './ParameterSetting'

export default class Step2 extends React.Component {
  validateFieldsAndGoNext = () => {
    const { form, changeStep } = this.props
    const { getFieldsValue, validateFieldsAndScroll } = form
    let fields = []
    const { protocol, openProtocol } = getFieldsValue()
    if (protocol !== openProtocol) {
      fields = [ 'requestXslt', 'responseXslt' ]
    }
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
        <ParameterSetting {...otherProps} />
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
