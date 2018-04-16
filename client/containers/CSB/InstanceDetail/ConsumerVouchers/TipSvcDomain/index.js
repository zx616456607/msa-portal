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
import { Popover, Icon } from 'antd'
import CopyToClipboardComponent from '../../../../../components/CopyToClipboard'

export default class IndentTip extends React.Component {
  static propTypes = {
    // 当前消费凭证
    record: propTypes.object.isRequired,
  }

  state = {
    icoTip: false,
  }

  renderPopoverContent = () => {
    const { record } = this.props
    return (
      <div>
        <div>
          <CopyToClipboardComponent
            content={<span>ak:{record.clientId}</span>}
            message={record.clientId}
          />
        </div>
        <div>
          <CopyToClipboardComponent
            content={<span>ak:{record.secret}</span>}
            message={record.secret}
          />
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
