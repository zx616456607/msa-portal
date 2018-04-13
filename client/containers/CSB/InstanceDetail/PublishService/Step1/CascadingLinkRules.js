/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service: cascading link rules
 *
 * 2017-12-04
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Form, Checkbox, Select,
} from 'antd'
import ClassNames from 'classnames'
import find from 'lodash/find'
import {
  getCascadingLinkRulesList,
} from '../../../../../actions/CSB/cascadingLinkRules'
import {
  getCascadedServicesPrerequisite,
} from '../../../../../actions/CSB/instanceService'
import {
  cascadingLinkRuleSlt,
} from '../../../../../selectors/CSB/cascadingLinkRules'
import './style/CascadingLinkRules.less'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class CascadingLinkRules extends React.Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { getCascadingLinkRulesList, instanceID: instanceId } = this.props
    getCascadingLinkRulesList({ size: 2000, instanceId })
  }

  getInstancesOptions = () => {
    const { form, cascadingLinkRules } = this.props
    const { getFieldValue } = form
    const pathId = parseInt(getFieldValue('pathId'), 10)
    const selectPath = find(cascadingLinkRules.content, { id: pathId }) || {}
    const instances = selectPath && selectPath.instances || []
    const firstDeletedInstanceIndex = instances.indexOf(null)
    return instances.map((instance, index) => {
      const { id, name, privilege, services, groups } = instance || {}
      let disabled = (firstDeletedInstanceIndex > -1 && index >= firstDeletedInstanceIndex)
      const tips = []
      if (privilege === false) {
        disabled = true
        tips.push('无发布权限')
      }
      if (groups === false) {
        disabled = true
        tips.push('无同名服务组')
      }
      if (services === false) {
        disabled = true
        tips.push('有同名及同版本服务')
      }
      return {
        label: instance
          ? `${name}${tips.length > 0 ? `（${tips.join('/')}）` : ''}`
          : '实例已删除',
        value: instance ? id : `deleted|${index}`,
        disabled,
      }
    })
  }

  onPathChange = pathId => {
    this.props.form.resetFields([ 'targetInstancesIDs' ])
    if (pathId === 'default') {
      return
    }
    const { getCascadedServicesPrerequisite } = this.props
    getCascadedServicesPrerequisite({ pathId })
  }

  render() {
    const { formItemLayout, form, className, cascadingLinkRules } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const serviceName = getFieldValue('name') || '-'
    const instancesOptions = this.getInstancesOptions()
    const classNames = ClassNames('cascading-link-rules', {
      [className]: !!className,
    })
    return (
      <div className={classNames}>
        <FormItem
          {...formItemLayout}
          label="服务发布目标实例"
          className="path-targets"
        >
          {getFieldDecorator('pathId', {
            initialValue: 'default',
            rules: [{
              required: true,
              message: '请选择链路!',
            }],
            onChange: this.onPathChange,
          })(
            <Select
              placeholder="选择级联链路"
              showSearch
              optionFilterProp="children"
            >
              <Option value="default">
              实例 {serviceName}（本实例，非级联发布）
              </Option>
              {
                cascadingLinkRules.content.map(path =>
                  <Option key={path.id}>{path.name}</Option>
                )
              }
            </Select>
          )}
          {
            getFieldValue('pathId') !== 'default' &&
            <div className="desc-text">
            链路中实例按照级联链路方向排列；需预先申请目标实例的发布权限，需预先在目
            标实例中创建一个与当前发布的服务所选择的服务组名称相同的服务组。
            </div>
          }
        </FormItem>
        {
          getFieldValue('pathId') !== 'default' &&
          <FormItem
            {...formItemLayout}
            label=" "
            className="path-instances"
          >
            {getFieldDecorator('targetInstancesIDs', {
              rules: [{
                required: true,
                message: '请选择目标实例!',
              }],
            })(
              <CheckboxGroup options={instancesOptions} />
            )}
          </FormItem>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const cascadingLinkRules = cascadingLinkRuleSlt(state, ownProps)
  const { CSB } = state
  const { cascadedServicePrerequisite = {} } = CSB
  cascadingLinkRules.content.map(clr => {
    const csp = cascadedServicePrerequisite[clr.id]
    if (csp) {
      clr.instances && clr.instances.forEach(instance => {
        if (!instance) {
          return
        }
        instance.privilege = csp.privilege && csp.privilege[instance.id]
        instance.groups = csp.groups && csp.groups[instance.id]
        instance.services = csp.services && csp.services[instance.id]
      })
    }
    return clr
  })
  return {
    cascadingLinkRules,
  }
}

export default connect(mapStateToProps, {
  getCascadingLinkRulesList,
  getCascadedServicesPrerequisite,
})(CascadingLinkRules)
