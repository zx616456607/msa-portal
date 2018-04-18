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

const list = []

for (let i = 0; i < 100000; i++) {
  list.push(`hello${i}`)
}


class LogList extends React.Component {
  static propTypes = {
    list: propTypes.array.isRequired,
  }

  rowRenderer = ({ key, index, style }) => {
    return (
      <div
        key={key}
        style={style}
        className="log-item-style"
      >
        {list[index]}
      </div>
    )
  }

  render() {
    const { size } = this.props
    const logListClass = classNames({
      'normal-style': true,
      'small-style': size === 'small',
      'big-style': size === 'big',
    })
    return (
      <div className={logListClass}>
        {
          list.length
            ? <div className="no-log-style">无日志</div>
            : <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  rowCount={list.length}
                  rowHeight={30}
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
