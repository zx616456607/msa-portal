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
import isEmpty from 'lodash/isEmpty'
import {
  Button, notification,
} from 'antd'
import {
  createService, editService, uploadMsgConverters,
  getCascadedServicesPrerequisite,
} from '../../../../../actions/CSB/instanceService'
import {
  cascadingLinkRuleSlt,
} from '../../../../../selectors/CSB/cascadingLinkRules'
import {
  sleep,
} from '../../../../../common/utils'
import Control from './Control'

const SECONDS_CONVERSION = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
}

const DEFINITION = 'com.tenxcloud.dsb.pojo.definition'

class Step3 extends React.Component {
  state = {
    isEdit: '',
    confirmLoading: false,
  }

  submitService = async () => {
    const {
      form, createService, editService, instanceID, history, uploadMsgConverters,
      cascadingLinkRules, cascadedServicesWebsocket, csbInstanceServiceGroups, isEdit,
      serviceId, getCascadedServicesPrerequisite,
    } = this.props
    const { validateFieldsAndScroll, getFieldsValue, getFieldValue, setFields } = form
    const path_id = getFieldValue('pathId')
    if (!isEdit && path_id !== 'default') {
      let { pathId, version, groupId, name, targetInstancesIDs } = getFieldsValue()
      pathId = parseInt(pathId, 10)
      const selectPath = find(cascadingLinkRules.content, { id: pathId }) || {}
      const instances = selectPath && selectPath.instances || []
      const groupName = csbInstanceServiceGroups
        && csbInstanceServiceGroups[groupId]
        && csbInstanceServiceGroups[groupId].name
      const query = {
        pathId,
        groupName,
        serviceName: name,
        serviceVersion: version,
      }
      const result = await getCascadedServicesPrerequisite(query)
      if (result.error) {
        return
      }
      const data = result.response.result.data
      const errors = []
      if (isEmpty(targetInstancesIDs)) {
        errors.push(new Error('请选择目标实例!'))
      } else {
        Object.keys(data).forEach(key => {
          Object.keys(data[key]).forEach(itemKey => {
            const instance = find(instances, { id: itemKey }) || {}
            if (targetInstancesIDs.indexOf(itemKey) > -1 && data[key][itemKey] === false) {
              switch (key) {
                case 'privilege':
                  errors.push(new Error(`用户在实例 ${instance.name} 上无发布权限`))
                  break
                case 'groups':
                  errors.push(new Error(`用户在实例 ${instance.name} 上无同名服务组 ${groupName}`))
                  break
                case 'services':
                  errors.push(new Error(`用户在实例 ${instance.name} 上有同名及同版本服务`))
                  break
                default:
                  break
              }
              const instanceIdIndex = targetInstancesIDs.indexOf(itemKey)
              if (instanceIdIndex > -1) {
                targetInstancesIDs.splice(instanceIdIndex, 1)
              }
            }
          })
        })
      }
      setFields({
        targetInstancesIDs: {
          value: targetInstancesIDs,
          errors,
        },
      })
      await sleep(100)
    }
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
        authenticationType,
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
      const limitationType = []
      const limitationDetailArray = []

      if (apiGatewayLimit > 0) {
        limitationType.push('rate_limitation')
        limitationDetailArray.push({
          '@class': `${DEFINITION}.limitation.Rate`,
          limit: apiGatewayLimit,
          duration: `PT${SECONDS_CONVERSION[apiGatewayLimitType]}S`,
        })
      } else {
        limitationDetailArray.push({
          '@class': `${DEFINITION}.limitation.None`,
        })
      }
      // 防止XML攻击
      // const xmlProtectionType = 'definition'
      limitationType.push('xml_protecting')
      const xmlProtectionDetail = {
        '@class': `${DEFINITION}.limitation.XmlProtecting`,
        maxElementNameLength,
        maxAttibuteCount,
        removeDTD,
      }
      limitationDetailArray.push(xmlProtectionDetail)

      let authenticationDetail = {}
      if (authenticationType === 'bypass') {
        authenticationDetail = Object.assign({}, authenticationDetail, {
          '@class': `${DEFINITION}.authentication.Bypass`,
        })
      } else if (authenticationType === 'aksk') {
        authenticationDetail = Object.assign({}, authenticationDetail, {
          '@class': `${DEFINITION}.authentication.AccessKeySecretKey`,
        })
      } else {
        authenticationDetail = Object.assign({}, authenticationDetail, {
          '@class': `${DEFINITION}.authentication.OAuth2`,
          endpoint,
          clientId,
          clientSecret,
        })
      }

      // 请求方式
      if (values.method) {
        limitationType.push('http_method')
        limitationDetailArray.push({
          '@class': `${DEFINITION}.limitation.HttpMethod`,
          method: values.method,
        })
      }

      const body = [
        {
          name,
          version,
          description: values.description,
          type: values.type,
          inboundId: values.inboundId,
          accessible: true,
          targetType: protocol === 'rest' ? 'url' : 'wsdl',
          targetDetail: values.targetDetail,
          transformationType: 'direct',
          transformationDetail: '{}',
          authenticationType,
          authenticationDetail: JSON.stringify(authenticationDetail),
          errorCode: JSON.stringify(errorCode),
          limitationType: isEmpty(limitationType) ? 'no_limitation' : limitationType.join('__'),
          limitationDetail: JSON.stringify(limitationDetailArray),
          groupId,
          blackOrWhite: false,
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

      body[0].transformationDetail = JSON.stringify({
        '@class': `${DEFINITION}.transformation.Direct`,
      })
      // soap 转 rest
      if (protocol === 'soap' && openProtocol === 'rest') {
        body[0].transformationType = `${protocol}_to_${openProtocol}`
        const transformationDetail = {
          '@class': `${DEFINITION}.transformation.SoapToRest`,
          exposedRegexPath: values.exposedRegexPath,
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
        notification.success({
          message: '发布服务成功',
        })
      } else {
        // [cascadedService] 发布级联服务
        const { targetInstancesIDs } = values
        const groupName = csbInstanceServiceGroups
        && csbInstanceServiceGroups[groupId]
        && csbInstanceServiceGroups[groupId].name
        const serviceBehaviourPerInstance = {}
        cascadedInstances.forEach((instance, index, arr) => {
          const { id } = instance
          // serviceBehaviourPerInstance[id] = targetInstancesIDs.indexOf(id) > -1
          //   ? 2 // 2 - 为可订阅
          //   : 1 // 1 - 接力端（即，只接力，不可订阅，在对应的实例 ID 上，可订阅的服务里不会显示这个服务）
          if (index === 0) {
            serviceBehaviourPerInstance[id] = targetInstancesIDs.includes(id) ? 6 : 5
          } else if (index < arr.length - 1) {
            serviceBehaviourPerInstance[id] = targetInstancesIDs.includes(id) ? 8 : 1
          } else if (targetInstancesIDs.includes(id)) {
            serviceBehaviourPerInstance[id] = 2
          }
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
        await sleep(300)
      }
      this.setState({
        confirmLoading: false,
      })
      history.push(`/csb-instances-available/${instanceID}/my-published-services`)
    })
  }

  render() {
    const {
      className, data, isEdit, history, ...otherProps
    } = this.props
    const { confirmLoading } = this.state
    const classNames = ClassNames({
      fields: true,
      [className]: !!className,
    })
    return [
      <div className={classNames} key="fields">
        <Control data={data} {...otherProps} />
      </div>,
      <div className="btns" key="btns">
        <Button
          key="previous"
          onClick={() => history.goBack(-1)}
        >
        取消
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
  getCascadedServicesPrerequisite,
})(Step3)
