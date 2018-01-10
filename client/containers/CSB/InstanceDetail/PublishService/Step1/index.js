/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: step 1
 *
 * 2018-01-09
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import {
  Button,
} from 'antd'
import AccessAgreement from './AccessAgreement/'
import OpenAgreement from './OpenAgreement'

export default class Step1 extends React.Component {
  validateFieldsAndGoNext = () => {
    const { changeStep } = this.props
    changeStep(1)
  }

  render() {
    const {
      className, currentStep, servicesInbounds, serviceGroups, history,
      ...otherProps
    } = this.props
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <AccessAgreement
          servicesInbounds={servicesInbounds}
          {...otherProps}
        />
        <OpenAgreement
          serviceGroups={serviceGroups}
          {...otherProps}
        />
      </div>,
      currentStep === 0 &&
      <div className="btns" key="btns">
        <Button key="cancel" onClick={() => history.goBack(-1)}>
        取 消
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
