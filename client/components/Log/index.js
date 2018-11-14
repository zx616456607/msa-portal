/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * LogTemplate component
 *
 * 2018-2-1
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import { Icon } from 'antd'
import moment from 'moment'
import './style/LogTemplate.less'
import { DatePicker } from 'antd'
import TenxLogs from '@tenx-ui/logs'
import '@tenx-ui/logs/assets/index.css'

const dateFormat = 'YYYY-MM-DD'
class LogTemplate extends React.Component {
  static propTypes = {
    loadData: propTypes.func.isRequired,
  }
  state = {
    date_start: null,
  }

  changeDate = (data, dataString) => {
    this.setState({
      date_start: dataString,
    }, this.loadData)
  }

  loadData = (query = {}) => {
    const { date_start } = this.state
    const { loadData } = this.props
    query = Object.assign({}, {
      date_start,
      date_end: date_start,
    }, query)
    loadData(query)
  }

  disabledDate = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }
  logs = () => {
    const { data, isFetching } = this.props
    const logsArr = []
    if (data !== null && data.length !== 0) {
      data.forEach(v => {
        const item = `<div class="log-item">
          <span class="log-name">${v.name}</span>
          <span class="log">${v.log}</span>
        </div>`
        logsArr.push(item)
      })
    } else if (isFetching) {
      logsArr.push('<span>加载中...</span>')
    } else if (!isFetching && data.length === 0) {
      logsArr.push('<span>暂无日志</span>')
    }
    if (this.logRef) {
      this.logRef.clearLogs()
      this.logRef.writeln(logsArr)
    }
  }
  render() {
    this.logs()
    return (
      <div id="log-template">
        <TenxLogs
          ref={ref => (this.logRef = ref)}
          header={<div className="operaBox">
            <DatePicker
              defaultValue={moment(new Date(), dateFormat)}
              format={dateFormat}
              disabledDate={this.disabledDate}
              onChange={(data, dataString) => this.changeDate(data, dataString)}
              showToday={true}
            />
            <Icon type="reload" onClick={() => this.loadData()}/>
          </div>}
          isDangerouslySetInnerHTML={true}

        />
      </div>
    )
  }
}

export default LogTemplate
