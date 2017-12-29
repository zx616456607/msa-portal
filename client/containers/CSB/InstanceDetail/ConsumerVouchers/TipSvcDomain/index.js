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
import propTypes from 'prop-types'
import { Popover, Icon, Tooltip } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default class IndentTip extends React.Component {
  static propTypes = {
    // 当前消费凭证
    record: propTypes.object.isRequired,
  }

  state = {
    icoTip: false,
    copyStatus: false,
    inputID: '',
  }

  copyKey = () => {
    this.setState({ copyStatus: true })
    setTimeout(() => {
      this.setState({ copyStatus: false })
    }, 1000)
  }

  renderPopoverContent = () => {
    const { record } = this.props
    const { copyStatus } = this.state
    return (
      <div>
        <div>
          <span className="key-value">ak:{record.clientId}</span>
          <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
            <CopyToClipboard text={record.clientId} onCopy={() => this.copyKey()}>
              <Icon type="copy"/>
            </CopyToClipboard>
          </Tooltip>
        </div>
        <div>
          <span className="key-value">
            sk:{record.secret}
          </span>
          <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
            <CopyToClipboard text={record.secret} onCopy={() => this.copyKey()}>
              <Icon type="copy"/>
            </CopyToClipboard>
          </Tooltip>
        </div>
      </div>
    )
  }

  render() {
    const { icoTip } = this.state
    return (
      <Popover
        placement="right"
        trigger="click"
        arrowPointAtCenter={true}
        overlayClassName="keys-popover"
        onVisibleChange={visible => this.setState({ icoTip: visible })}
        content={this.renderPopoverContent()}
      >
        {
          icoTip
            ? <Icon type="minus-square-o" onClick={() => this.setState({ icoTip: true })}/>
            : <Icon type="plus-square-o" onClick={() => this.setState({ icoTip: false })}/>
        }
      </Popover>
    )
  }
}
