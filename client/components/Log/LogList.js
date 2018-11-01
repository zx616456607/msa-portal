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
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer'
import 'react-virtualized/styles.css'
import './style/LogList.less'
import classNames from 'classnames'
import { formatDate } from '../../common/utils'

class LogList extends React.Component {
  static propTypes = {
    data: propTypes.array.isRequired,
  }
  state = {
    measureCache: new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 40,
    }),
  }
  componentWillReceiveProps() {
    this.setState({
      measureCache: new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 40,
      }),
    })
  }
  rowRenderer = ({ index, key, parent, style }) => {
    const { data } = this.props
    const time = data[index].time_nano ? parseInt(data[index].time_nano.substring(0, 13)) : 0
    return (
      <CellMeasurer
        cache={this.state.measureCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div
          key={data[index].id}
          style={ style }
          className="log-item-style"
        >
          {data[index].mark && <span className="markSpan">[{data[index].mark}]</span>}
          {data[index].name && <span className="nameSpan">[{data[index].name}]</span>}
          {time && <span className="timeSpan">[{formatDate(time)}]</span>}
          {data[index].log && <span>{data[index].log}</span>}
        </div>
      </CellMeasurer>
    )
  }
  render() {
    const { size, data, isFetching } = this.props
    const { measureCache } = this.state
    const logListClass = classNames({
      'normal-style': true,
      'small-style': size === 'small',
      'big-style': size === 'big',
    })
    return (
      <div className={logListClass}>
        {
          !data || !data.length
            ? <div className="no-log-style">{ isFetching ? '获取中。。。' : '暂无数据' }</div>
            : <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  rowCount={data.length}
                  rowHeight={measureCache.rowHeight}
                  rowRenderer={this.rowRenderer}
                  // disableWidth={true}
                  deferredMeasurementCache={measureCache}
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
