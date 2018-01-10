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
      form, createService, instanceID, history, uploadMsgConverters,
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
      const { requestXslt, responseXslt } = values
      const _generatFile = (string, name) => {
        return new File([ string ], name, { type: 'text/xml' })
      }
      // soap 转 rest
      if (protocol === 'soap' && openProtocol === 'rest') {
        body[0].transformationType = `${protocol}_to_${openProtocol}`
        const transformationDetail = {
          requestXsltId: 4,
          responseXsltId: 5,
          exposedRegexPath: values.openUrl,
          bindingName: values.bindingName,
          operationName: values.operationName,
          wsdl: values.targetDetail,
        }
        // 上传转换模板
        const uplodaActions = []
        // 请求转换模板
        const reqXsltBody = new FormData()
        reqXsltBody.append('file', _generatFile(requestXslt, 'request.xsl'))
        reqXsltBody.append('type', 'xslt')
        uplodaActions.push(uploadMsgConverters(instanceID, reqXsltBody))
        // 响应转换模板
        const resXsltBody = new FormData()
        resXsltBody.append('file', _generatFile(responseXslt, 'response.xsl'))
        resXsltBody.append('type', 'xslt')
        uplodaActions.push(uploadMsgConverters(instanceID, resXsltBody))
        const [ reqXsltResult, resXsltResult ] = await Promise.all(uplodaActions)
        // 上传转换模板失败
        if (reqXsltResult.error || resXsltResult.error) {
          this.setState({
            confirmLoading: false,
          })
          notification.error({
            message: '上传转换模板失败',
          })
          return
        }
        transformationDetail.requestXsltId = reqXsltResult.response.result.data.id
        transformationDetail.responseXsltId = resXsltResult.response.result.data.id
        body[0].transformationDetail = JSON.stringify(transformationDetail)
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
