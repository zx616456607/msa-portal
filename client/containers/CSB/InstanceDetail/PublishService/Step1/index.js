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
import { connect } from 'react-redux'
import {
  Button,
} from 'antd'
import AccessAgreement from './AccessAgreement/'
import OpenAgreement from './OpenAgreement'
import CascadingLinkRules from './CascadingLinkRules'
import {
  getCascadedServicesPrerequisite,
} from '../../../../../actions/CSB/instanceService'
import {
  cascadingLinkRuleSlt,
} from '../../../../../selectors/CSB/cascadingLinkRules'
import find from 'lodash/find'

class Step1 extends React.Component {
  state = {
    loading: false,
  }

  getValidateFields = () => {
    const { form } = this.props
    const { getFieldsValue } = form
    let fields = [
      'protocol', 'openProtocol', 'targetDetail', 'name', 'version',
      'openUrl', 'groupId', 'pathId',
    ]
    const { protocol, openProtocol, pathId } = getFieldsValue()
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
    if (pathId !== 'default') {
      fields.push('targetInstancesIDs')
    }
    return fields
  }

  validateFieldsAndGoNext = () => {
    const {
      form, changeStep, getCascadedServicesPrerequisite,
      csbInstanceServiceGroups, cascadingLinkRules,
    } = this.props
    const { validateFieldsAndScroll, getFieldsValue, setFields } = form
    validateFieldsAndScroll(this.getValidateFields(), errors => {
      if (errors) {
        return
      }
      const values = getFieldsValue()
      const { targetInstancesIDs, groupId, name, version } = values
      let pathId = values.pathId
      if (pathId === 'default') {
        return changeStep(1)
      }
      this.setState({
        loading: true,
      })
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
      getCascadedServicesPrerequisite(query).then(res => {
        this.setState({
          loading: false,
        })
        if (res.error) {
          return changeStep(1)
        }
        const data = res.response.result.data
        const errors = []
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
        if (errors.length === 0) {
          return changeStep(1)
        }
        setFields({
          targetInstancesIDs: {
            value: targetInstancesIDs,
            errors,
          },
        })
      })
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
          loading={this.state.loading}
          onClick={this.validateFieldsAndGoNext}
        >
        下一步
        </Button>
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { csbInstanceServiceGroups } = state.entities
  return {
    csbInstanceServiceGroups,
    cascadingLinkRules: cascadingLinkRuleSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getCascadedServicesPrerequisite,
})(Step1)
