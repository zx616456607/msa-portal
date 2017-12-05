/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Vouchers
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import { Popover } from 'antd'

class SvcTip extends React.Component {
  state = {
    copyStatus: false,
    inputID: '',
  }
  servercopyCode() {
    const code = document.getElementById(this.state.inputID)
    code.select()
    document.execCommand('Copy', false)
    this.setState({
      copyStatus: true,
    })
  }
  returnDefaultTooltip() {
    const _this = this
    setTimeout(() => {
      _this.setState({
        copyStatus: false,
      })
    }, 500)
  }
  render() {
    const { svcDomain } = this.props
    const scope = this
    const item = svcDomain.map(element => {
      return (
        <li>
          <span> ak:</span>
          <span> sk:</span>
          <Tooltip placement="top" title={scope.state.copyStatus ? '复制成功' : '点击复制'}>
            <Icon type="copy" onClick={this.servercopyCode} onMouseLeave={this.returnDefaultTooltip} onMouseEnter={() => this.startCopyCode(element.domain)}/>
          </Tooltip>
        </li>
      )
    })
    return (
      <div>
        <ul>
          {item}
        </ul>
      </div>
    )
  }
}

export default class IndentTip extends React.Component {
  render() {
    return (
      <div>
        <Popover
          placement="right"
          content={<SvcTip />}
          trigger="click">
        </Popover>
      </div>
    )
  }
}
