/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * SCBApply
 *
 * 2017-12-18
 * @author zhaoyb
 */
import React from 'react'
import { Badge } from 'antd'

export default class CSBApplyStatus extends React.Component {
  filterState = key => {
    let status
    let text
    switch (key) {
      case 2:
        status = 'success'
        text = '已通过'
        break
      case 1:
        status = 'processing'
        text = '申请中'
        break
      case 3:
        status = 'error'
        text = '已拒绝'
        break
      default:
        status = 'default'
        text = '未知'
    }
    return { status, text }
  }

  render() {
    const { stateKey } = this.props
    return <Badge {...this.filterState(stateKey)} />
  }
}
