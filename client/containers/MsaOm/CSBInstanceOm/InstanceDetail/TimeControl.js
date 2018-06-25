/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * TimeControl of Monitor
 *
 * @author zhangxuan
 * @date 2018-06-25
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'

export default class TimeControl extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const { value, onChange } = this.props
    return (
      <Radio.Group value={value} onChange={onChange}>
        <Radio.Button value="1">最近1小时</Radio.Button>
        <Radio.Button value="6">最近6小时</Radio.Button>
        <Radio.Button value="24">最近24小时</Radio.Button>
        <Radio.Button value="168">最近7天</Radio.Button>
        <Radio.Button value="720">最近30天</Radio.Button>
      </Radio.Group>
    )
  }
}
