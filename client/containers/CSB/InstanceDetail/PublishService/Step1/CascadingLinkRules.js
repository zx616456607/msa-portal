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
import { find } from 'lodash'
// import SockJS from 'sockjs-client'
import {
  getCascadingLinkRulesList,
} from '../../../../../actions/CSB/cascadingLinkRules'
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
    const { getCascadingLinkRulesList } = this.props
    getCascadingLinkRulesList({ size: 2000 })
  }

  getInstancesOptions = () => {
    const { form, cascadingLinkRules } = this.props
    const { getFieldValue } = form
    const pathId = parseInt(getFieldValue('pathId'))
    const selectPath = find(cascadingLinkRules.content, { id: pathId }) || {}
    const instances = selectPath && selectPath.instances || []
    return instances.map((instance, index) => ({
      label: instance ? instance.name : '实例已删除',
      value: instance ? instance.id : `deleted|${index}`,
      disabled: !instance,
    }))
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
            {getFieldDecorator('targetInstancesIDs')(
              <CheckboxGroup options={instancesOptions} />
            )}
          </FormItem>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cascadingLinkRules: cascadingLinkRuleSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getCascadingLinkRulesList,
})(CascadingLinkRules)
