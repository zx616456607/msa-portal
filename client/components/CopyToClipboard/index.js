/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CopyToClipboard component
 *
 * 2018-4-18
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { Tooltip, Icon } from 'antd'
import './style/copyToClipboardCompent.less'
import { CopyToClipboard } from 'react-copy-to-clipboard'

class CopyToClipboardComponent extends React.Component {
  static propTypes = {
    // 复制 Icon 前显示的内容，需要传入一个 html 标签
    content: propTypes.element.isRequired,
    // 用户点击复制按钮时，需要复制的内容
    message: propTypes.string.isRequired,
  }

  state = {
    copyStatus: false,
  }

  copyKey = () => {
    this.setState({ copyStatus: true })
    setTimeout(() => {
      this.setState({ copyStatus: false })
    }, 1000)
  }

  render() {
    const { copyStatus } = this.state
    const { content, message } = this.props
    return (
      <div id="CopyToClipboardComponent">
        <span className="key-value">
          {content}
        </span>
        <Tooltip placement="top" title={copyStatus ? '复制成功' : '点击复制'}>
          <CopyToClipboard text={message} onCopy={() => this.copyKey()}>
            <Icon type="copy"/>
          </CopyToClipboard>
        </Tooltip>
      </div>
    )
  }
}

export default CopyToClipboardComponent
