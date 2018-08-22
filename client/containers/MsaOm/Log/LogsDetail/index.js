/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * logsDetail
 *
 * @author zhaoyb
 * @date 2017-11-10
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import { Icon, Card } from 'antd'
import { formatDate } from '../../../../common/utils'

class LogComponent extends React.Component {
  state = {
    bigLog: true,
  }

  handleDown = () => {
    const { logs } = this.props
    let downUrl = ''
    const blob = new Blob([ logs ])
    downUrl = URL.createObjectURL(blob)
    URL.revokeObjectURL(blob)
    return downUrl
  }

  onChangeBigLog = () => {
    const { callback } = this.props
    callback(!this.state.bigLog)
    this.setState({
      bigLog: !this.state.bigLog,
    })
  }

  timeFormat = time => {
    const newDate = new Date()
    time = parseInt(time)
    const newTime = newDate.setTime(time / 1000000)
    return formatDate(newTime)
  }

  render() {
    const { bigLog, name } = this.state
    const { logs } = this.props
    let logItems
    if (logs) {
      logItems = logs && logs.map((item, index) => {
        const logDetail = (
          <div className="logDetail" key={'logDetail' + index}>
            <span className="instanceSpan">{'[' + item.name + ']'}</span>
            {
              <span className="instanceSpan">{this.timeFormat(item.timeNano)}</span>
            }
            <span className="logSpan">
              <span>{item.log}</span>
            </span>
          </div>
        )
        return (
          <div>
            {logDetail}
          </div>
        )
      })
    }

    return (
      <Card className="info">
        <div className="logs-detail">
          <div className="title">
            <span className="desc">结果查询页</span>
            <div>
              <a className="download" href={`${this.handleDown()}`}
                download={name ? `${name}_${formatDate(new Date())}.log` :
                  `${formatDate(new Date())}.log`}>
                <Icon type="download" />下载
              </a>
            </div>
            <Icon type={bigLog ? 'arrows-alt' : 'shrink'} className="enlarge"
              onClick={() => this.onChangeBigLog()} />
          </div>
          <div className="log-body">
            {
              logs ?
                <div className="logList">
                  <pre>
                    {logItems}
                  </pre>
                </div> :
                <div className="infos">
                  <span>暂无日志记录</span>
                </div>
            }
          </div>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
  }
}

export default connect(mapStateToProps, {
})(LogComponent)

