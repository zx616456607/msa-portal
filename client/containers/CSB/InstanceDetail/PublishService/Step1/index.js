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
import CascadingLinkRules from './CascadingLinkRules'

export default class Step1 extends React.Component {
  getValidateFields = () => {
    const { form } = this.props
    const { getFieldsValue } = form
    let fields = [
      'protocol', 'openProtocol', 'targetDetail', 'name', 'version',
      'openUrl', 'groupId',
    ]
    const { protocol, openProtocol } = getFieldsValue()
    const transformationType = `${protocol}_to_${openProtocol}`
    switch (transformationType) {
      case 'rest_to_rest':
        fields = fields.concat([
          'targetDetail', 'method',
        ])
        break
      case 'rest_to_soap':
        fields = fields.concat([])
        break
      case 'soap_to_rest':
        fields = fields.concat([
          'bindingName', 'operationName',
        ])
        break
      case 'soap_to_soap':
        fields = fields.concat([])
        break
      default:
        break
    }
    return fields
  }

  validateFieldsAndGoNext = () => {
    const { form, changeStep } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll(this.getValidateFields(), errors => {
      if (errors) {
        return
      }
      changeStep(1)
    })
  }

  render() {
    const {
      className, currentStep, servicesInbounds, serviceGroups, history,
      currentInstance, ...otherProps
    } = this.props
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <AccessAgreement
          currentInstance={currentInstance}
          servicesInbounds={servicesInbounds}
          {...otherProps}
        />
        <OpenAgreement
          serviceGroups={serviceGroups}
          {...otherProps}
        />
        <CascadingLinkRules
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
