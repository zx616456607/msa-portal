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
import './style/index.less'

export default class CSBApplyStatus extends React.Component {
  filterState = key => {
    switch (key) {
      case 2:
        return <div className="adopt circular"><div></div><span>已通过</span></div>
      case 1:
        return <div className="apply circular"><div></div><span>申请中</span></div>
      case 3:
        return <div className="refuse circular"><div></div><span>已拒绝</span></div>
      default:
        return
    }
  }

  render() {
    const { stateKey } = this.props
    return (
      <div className="CSBApply-status">
        {this.filterState(stateKey)}
      </div>
    )
  }
}
