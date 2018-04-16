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
import find from 'lodash/find'
import {
  Button, notification,
} from 'antd'
import {
  createService, editService, uploadMsgConverters,
} from '../../../../../actions/CSB/instanceService'
import {
  cascadingLinkRuleSlt,
} from '../../../../../selectors/CSB/cascadingLinkRules'
import {
  sleep,
} from '../../../../../common/utils'
import Control from './Control'
import OAuth from './OAuth'

const SECONDS_CONVERSION = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
}
class Step3 extends React.Component {
  state = {
    isEdit: '',
    confirmLoading: false,
  }

  validateFieldsAndGoNext = () => {
    const { changeStep } = this.props
    changeStep(2)
  }

  submitService = async () => {
    const {
      form, createService, editService, instanceID, history, uploadMsgConverters,
      cascadingLinkRules, cascadedServicesWebsocket, csbInstanceServiceGroups, isEdit,
      serviceId,
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
        name,
        version,
        protocol,
        openProtocol,
        apiGatewayLimit,
        apiGatewayLimitType,
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
        openOAuth,
        endpoint,
        clientId,
        clientSecret,
        errCodeKeys,
      } = values
      const groupId = parseInt(values.groupId, 10)
      // 错误代码
      const errorCode = errCodeKeys.map(key => ({
        code: values[`code-${key}`],
        advice: values[`advice-${key}`],
        description: values[`description-${key}`],
      }))
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
      // OAuth
      const oauth2Type = values.oauth2Type || 'no_oauth'
      let oauth2Detail = {}
      if (openOAuth) {
        oauth2Detail = {
          endpoint,
          clientId,
          clientSecret,
        }
      }
      const body = [
        {
          name,
          version,
          description: values.description,
          type: values.type,
          inboundId: values.inboundId,
          accessible: values.accessible,
          targetType: protocol === 'rest' ? 'url' : 'wsdl',
          targetDetail: values.targetDetail,
          method: values.method,
          requestType: values.requestType,
          responseType: values.responseType,
          transformationType: 'direct',
          transformationDetail: '{}',
          authenticationType: 'bypass',
          authenticationDetail: '{}',
          errorCode: JSON.stringify(errorCode),
          limitationType,
          limitationDetail: JSON.stringify(limitationDetail),
          xmlProtectionType,
          xmlProtectionDetail: JSON.stringify(xmlProtectionDetail),
          oauth2Type,
          oauth2Detail: JSON.stringify(oauth2Detail),
          groupId,
        },
      ]
      const { requestXslt, responseXslt } = values
      const _generatFile = (string, name) => {
        return new File([ string ], name, { type: 'text/xml' })
      }
      // 上传转换模板的实例 ID
      let uploadInstanceID = instanceID
      let pathId = values.pathId
      let cascadedInstances
      // [cascadedService] 如果为级联发布，将转换模板上传到链路的第一个实例中
      if (pathId !== 'default') {
        pathId = parseInt(pathId, 10)
        const selectPath = find(cascadingLinkRules.content, { id: pathId }) || {}
        cascadedInstances = selectPath && selectPath.instances || []
        uploadInstanceID = cascadedInstances[0] && cascadedInstances[0].id
      }
      // soap 转 rest
      if (protocol === 'soap' && openProtocol === 'rest') {
        body[0].transformationType = `${protocol}_to_${openProtocol}`
        const transformationDetail = {
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
        uplodaActions.push(uploadMsgConverters(uploadInstanceID, reqXsltBody))
        // 响应转换模板
        const resXsltBody = new FormData()
        resXsltBody.append('file', _generatFile(responseXslt, 'response.xsl'))
        resXsltBody.append('type', 'xslt')
        uplodaActions.push(uploadMsgConverters(uploadInstanceID, resXsltBody))
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
      if (pathId === 'default') {
        let res
        if (isEdit === 'true') {
          res = await editService(instanceID, serviceId, body[0])
        } else {
          res = await createService(instanceID, body)
        }
        if (res.error) {
          this.setState({
            confirmLoading: false,
          })
          return
        }
      } else {
        // [cascadedService] 发布级联服务
        const { targetInstancesIDs } = values
        const groupName = csbInstanceServiceGroups
        && csbInstanceServiceGroups[groupId]
        && csbInstanceServiceGroups[groupId].name
        const serviceBehaviourPerInstance = {}
        cascadedInstances.forEach(instance => {
          const { id } = instance
          serviceBehaviourPerInstance[id] = targetInstancesIDs.indexOf(id) > -1
            ? 2 // 2 - 为可订阅
            : 1 // 1 - 接力端（即，只接力，不可订阅，在对应的实例 ID 上，可订阅的服务里不会显示这个服务）
        })
        const cascadedBody = {
          type: 'publish',
          cascadedService: {
            pathId,
            groupName,
            serviceName: name,
            serviceVersion: version,
            serviceBehaviourPerInstance: JSON.stringify(serviceBehaviourPerInstance),
          },
          service: body[0],
        }
        cascadedServicesWebsocket.send('/api/v1/cascaded-services', {}, JSON.stringify(cascadedBody))
        await sleep(200)
      }
      this.setState({
        confirmLoading: false,
      })
      notification.success({
        message: '发布服务成功',
      })
      history.push(`/csb-instances-available/${instanceID}/my-published-services`)
    })
  }

  render() {
    const {
      className, currentStep, changeStep, data, isEdit, ...otherProps
    } = this.props
    const { confirmLoading } = this.state
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <Control data={data} {...otherProps} />
        <OAuth data={data} {...otherProps} />
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
          { isEdit ? '保 存' : '发 布' }
        </Button>
      </div>,
    ]
  }
}


const mapStateToProps = (state, ownProps) => {
  const { entities, CSB } = state
  const { csbInstanceServiceGroups } = entities
  const { cascadedServicesWebsocket } = CSB
  return {
    csbInstanceServiceGroups,
    cascadedServicesWebsocket,
    cascadingLinkRules: cascadingLinkRuleSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  editService,
  createService,
  uploadMsgConverters,
})(Step3)
