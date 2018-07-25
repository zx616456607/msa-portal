/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Empty blown
 *
 * @author zhangxuan
 * @date 2018-07-25
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Icon } from 'antd'
import './style/EmptyBlown.less'

export default class EmptyBlown extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
  }
  render() {
    const { loading } = this.props
    return (
      <Spin spinning={loading} wrapperClassName="empty-loading">
        <div className="empty-text empty-blown-monitor">
          <span>
            <Icon type="frown-o" />
            <div>暂无数据</div>
          </span>
        </div>
      </Spin>
    )
  }
}
