/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * subscribedService names pop
 *
 * 2018-4-16
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { Popover, Icon } from 'antd'
import CopyToClipboardComponent from '../../../../components/CopyToClipboard'

class SubscribedServiceNamePop extends React.Component {
  static propTypes = {
    serviceList: propTypes.array.isRequired,
  }

  state = {
    icoTip: false,
  }

  renderPopoverContent = () => {
    const { serviceList } = this.props
    if (!serviceList.length) {
      return <div>无订阅服务</div>
    }
    return serviceList.map((item, index) => {
      return <CopyToClipboardComponent
        content={<span>{item}</span>}
        message={item}
        key={`${item}-${index}`}
      />
    })
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
            ? <Icon type="minus-square-o"
              onClick={() => this.setState({ icoTip: true })}
            />
            : <Icon type="plus-square-o"
              onClick={() => this.setState({ icoTip: false })}
            />
        }
      </Popover>
    )
  }
}

export default SubscribedServiceNamePop
