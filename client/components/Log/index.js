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
import LogList from './LogList'
import classNames from 'classnames'
import { DatePicker } from 'antd'

const dateFormat = 'YYYY-MM-DD'

class LogTemplate extends React.Component {
  static propTypes = {
    loadData: propTypes.func.isRequired,
  }
  state = {
    size: 'small',
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

  toggleContainerSize = () => {
    this.setState(preState => {
      return { size: preState.size === 'small' ? 'big' : 'small' }
    })
  }

  disabledDate = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }

  render() {
    const { size } = this.state
    const { data, isFetching, locale } = this.props
    const logContaierClass = classNames({
      'big-container-style': size === 'big',
      'small-container-style': size === 'small',
    })
    return (
      <div id="log-template" className={logContaierClass}>
        <div className="operaBox">
          <DatePicker
            defaultValue={moment(new Date(), dateFormat)}
            format={dateFormat}
            disabledDate={this.disabledDate}
            onChange={(data, dataString) => this.changeDate(data, dataString)}
            showToday={true}
          />
          <Icon type="reload" onClick={() => this.loadData()}/>
          <Icon
            type={size === 'small' ? 'arrows-alt' : 'shrink'}
            onClick={() => this.toggleContainerSize()}
          />
        </div>
        <LogList data={data} size={size} isFetching={isFetching} locale={locale}/>
      </div>
    )
  }
}

export default LogTemplate
