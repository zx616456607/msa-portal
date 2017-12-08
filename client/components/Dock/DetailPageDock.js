/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Detail page dock
 *
 * 2017-12-07
 * @author zhangpc
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'antd'
import Dock from './'
import './style/Dock.less'

export default class ServiceDetailDock extends React.Component {
  render() {
    const { visible, onVisibleChange, children, ...otherProps } = this.props
    return ReactDOM.createPortal(
      <Dock
        position="right"
        defaultSize={0.6}
        minSize={0.35}
        maxSize={0.7}
        isResizing={false}
        isVisible={visible}
        dimMode="opaque"
        dockStyle={{
          background: '#ecf0f4',
          cursor: 'initial',
        }}
        onVisibleChange={onVisibleChange}
        {...otherProps}
      >
        <div className="detail-page-dock">
          <Icon type="cross" onClick={() => onVisibleChange(false)} />
          {
            visible && children
          }
        </div>
      </Dock>,
      document.body
    )
  }
}
