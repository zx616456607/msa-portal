/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Sider component
 *
 * 2017-12-18
 * @author zhangxuan
 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TableSort extends React.Component {
  static propTypes = {
    // 标题
    title: PropTypes.string.isRequired,
    // 当前状态, true: 降序, false: 升序
    status: PropTypes.bool.isRequired,
    // 切换状态函数
    onChange: PropTypes.func.isRequired,
  }
  render() {
    const { title, status, onChange } = this.props
    return (
      <span onClick={onChange}>{title}
        <div className="ant-table-column-sorter">
          <span className={classNames('ant-table-column-sorter-up off', { on: !status })} title="↑">
            <i className="anticon anticon-caret-up"/>
          </span>
          <span className={classNames('ant-table-column-sorter-up off', { on: status })} title="↓">
            <i className="anticon anticon-caret-down"/>
          </span></div>
      </span>
    )
  }
}
