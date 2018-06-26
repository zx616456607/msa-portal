/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Service Groups
 *
 * 2017-12-27
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import './style/ServiceOrGroupSwitch.less'

const RadioGroup = Radio.Group

export default class ServiceOrGroupSwitch extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.oneOf([ 'all', 'group' ]).isRequired,
    instanceID: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  onChange = e => {
    const { history, instanceID } = this.props
    switch (e.target.value) {
      case 'all':
        history.push(`/csb-instances/available/${instanceID}/my-published-services`)
        break
      case 'group':
        history.push(`/csb-instances/available/${instanceID}/my-published-services-groups`)
        break
      default:
        break
    }
  }

  render() {
    const { defaultValue } = this.props
    return <span className="service-or-group-switch">
      <label>显示方式：</label>
      <RadioGroup onChange={this.onChange} defaultValue={defaultValue}>
        <Radio value="all">显示全部服务</Radio>
        <Radio value="group">显示服务组</Radio>
      </RadioGroup>
    </span>
  }
}
