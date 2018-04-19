/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Log list component
 *
 * 2018-2-1
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { AutoSizer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import './style/LogList.less'
import classNames from 'classnames'

class LogList extends React.Component {
  static propTypes = {
    data: propTypes.array.isRequired,
  }

  rowRenderer = ({ index, style }) => {
    const { data } = this.props
    return (
      <div
        key={data[index].id}
        style={style}
        className="log-item-style"
      >
        {data[index].log}
      </div>
    )
  }

  render() {
    const { size, data } = this.props
    const logListClass = classNames({
      'normal-style': true,
      'small-style': size === 'small',
      'big-style': size === 'big',
    })
    return (
      <div className={logListClass}>
        {
          !data.length
            ? <div className="no-log-style">无日志</div>
            : <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  rowCount={data.length}
                  rowHeight={50}
                  rowRenderer={this.rowRenderer}
                  // disableWidth={true}
                  width={width}
                  className="list-style"
                />
              )}
            </AutoSizer>
        }
      </div>
    )
  }
}

export default LogList
