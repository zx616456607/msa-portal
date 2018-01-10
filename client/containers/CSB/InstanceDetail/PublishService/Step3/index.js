/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: step 2
 *
 * 2018-01-09
 * @author zhangpc
 */

import React from 'react'
import ClassNames from 'classnames'
import { connect } from 'react-redux'
import {
  Button, notification,
} from 'antd'
import {
  createService, uploadMsgConverters,
} from '../../../../../actions/CSB/instanceService'
import ServiceControl from './ServiceControl'

const SECONDS_CONVERSION = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
}

class Step3 extends React.Component {
  state = {
    confirmLoading: false,
  }

  validateFieldsAndGoNext = () => {
    const { changeStep } = this.props
    changeStep(2)
  }

  submitService = async () => {
    const {
      form, createService, instanceID, history,
    } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true,
      })
      const {
        protocol,
        openProtocol,
        apiGatewayLimit,
        apiGatewayLimitType,
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
      } = values
      // 流量控制
      let limitationType = 'no_limitation'
      let limitationDetail = {}
      if (apiGatewayLimit > 0) {
        limitationType = 'rate_limitation'
        limitationDetail = {
          limit: apiGatewayLimit,
          duration: `PT${SECONDS_CONVERSION[apiGatewayLimitType]}S`,
        }
      }
      // 防止XML攻击
      const xmlProtectionType = 'definition'
      const xmlProtectionDetail = {
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
      }
      const body = [
        {
          name: values.name,
          version: values.version,
          description: values.description,
          type: values.type,
          inboundId: values.inboundId,
          accessible: values.accessible,
          targetType: protocol === 'rest' ? 'url' : 'wsdl',
          targetDetail: values.targetDetail,
          transformationType: 'direct',
          transformationDetail: '{}',
          authenticationType: 'bypass',
          authenticationDetail: '{}',
          limitationType,
          limitationDetail: JSON.stringify(limitationDetail),
          xmlProtectionType,
          xmlProtectionDetail: JSON.stringify(xmlProtectionDetail),
          groupId: parseInt(values.groupId),
        },
      ]
      // soap 转 rest
      if (protocol === 'soap' && openProtocol === 'rest') {
        // uploadMsgConverters
      }
      const res = await createService(instanceID, body)
      this.setState({
        confirmLoading: false,
      })
      if (res.error) {
        return
      }
      notification.success({
        message: '创建服务成功',
      })
      history.push(`/csb-instances-available/${instanceID}/my-published-services`)
    })
  }

  render() {
    const {
      className, currentStep, changeStep, ...otherProps
    } = this.props
    const { confirmLoading } = this.state
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <ServiceControl {...otherProps} />
      </div>,
      currentStep === 2 &&
      <div className="btns" key="btns">
        <Button
          key="previous"
          onClick={() => changeStep(1)}
        >
        上一步
        </Button>
        <Button
          type="primary"
          key="submit"
          onClick={this.submitService}
          loading={confirmLoading}
        >
        发 布
        </Button>
      </div>,
    ]
  }
}


const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  createService,
  uploadMsgConverters,
})(Step3)
