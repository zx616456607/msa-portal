/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * ApmTimePicker
 *
 * 2017-09-06
 * @author zhangxuan
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, DatePicker, message, Radio } from 'antd'
const { RangePicker } = DatePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import './style/index.less'

const btnArr = [{
  key: 'fiveMin',
  text: '最近5分钟',
}, {
  key: 'threeHour',
  text: '最近3小时',
}, {
  key: 'today',
  text: '今天',
}, {
  key: 'yesterday',
  text: '昨天',
}, {
  key: 'beforeYes',
  text: '最近2天',
}]

export default class ApmTimePicker extends React.Component {
  static propTypes = {
    // 时间范围
    rangeDateTime: PropTypes.array,
    // 应用名称
    application: PropTypes.string,
    // 获取选中的时间范围
    getTimeRange: PropTypes.func,
    // 回调
    loadData: PropTypes.func,
  }
  state = {
    application: undefined,
    rangeDateTime: [],
    configTime: true,
  }
  componentWillMount() {
    const now = Date.parse(new Date())
    const startTime = now - (5 * 60 * 1000)
    this.setState({
      rangeDateTime: [ startTime, now ],
    })
  }
  componentWillReceiveProps(nextProps) {
    /**
     * 设置时间范围以及应用
     *  
     */
    const { rangeDateTime, application } = nextProps
    if (rangeDateTime[0] !== this.props.rangeDateTime[0] || rangeDateTime[1] !== this.props.rangeDateTime[1]) {
      this.setState({
        rangeDateTime,
      })
    }
    if (application !== this.props.application) {
      this.setState({
        application,
      })
    }
  }
  loadData = () => {
    const { application, rangeDateTime } = this.state
    const { loadData } = this.props
    if (!application) {
      message.warning('请选择服务')
      return
    }
    if (!rangeDateTime || !rangeDateTime[0]) {
      message.warning('请选择开始跟结束时间')
      return
    }
    /**
     * loadData 点击刷新时的回调
     *
     */
    if (loadData) {
      loadData()
    }
  }
  getTimeArr = time => {
    const now = Date.parse(new Date())
    let startTime
    if (time === 'fiveMin') {
      startTime = now - (5 * 60 * 1000)
    } else if (time === 'threeHour') {
      startTime = now - (3 * 60 * 60 * 1000)
    } else if (time === 'today') {
      startTime = new Date(new Date().setHours(0, 0, 0, 0))
    } else if (time === 'yesterday') {
      startTime = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)).valueOf()
    } else if (time === 'beforeYes') {
      startTime = new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(0, 0, 0, 0)).valueOf()
    }
    this.getRangeDate([ startTime, now ])
  }
  getRangeDate = rangeDateTime => {
    const { getTimeRange } = this.props
    this.setState({ rangeDateTime }, () => {
      /**
       * getTimeRange 获取时间范围
       * 
       * @param {array} [开始时间，结束时间]
       */
      if (getTimeRange) {
        getTimeRange(this.state.rangeDateTime)
      }
    })
  }
  toogleTimePicker = () => {
    const { configTime } = this.state
    this.setState({ configTime: !configTime, rangeDateTime: [] })
  }
  render() {
    const { rangeDateTime, configTime } = this.state
    return (
      <span className="apm-timepicker">
        <Button className="type-change-btn" type="primary" onClick={this.toogleTimePicker}><Icon type="calendar"/> 自定义日期</Button>
        {
          !configTime ?
            <RangePicker
              className="apm-timepicker-component"
              key="timePicker"
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={[ '开始日期', '结束日期' ]}
              value={rangeDateTime}
              onChange={rangeDateTime => this.getRangeDate(rangeDateTime)}
              onOk={this.loadData}
            />
            :
            <RadioGroup className="apm-timepicker-btns" onChange={e => this.getTimeArr(e.target.value)} defaultValue="fiveMin">
              {
                btnArr.map(item => {
                  return <RadioButton key={item.key} value={item.key}>{item.text}</RadioButton>
                })
              }
            </RadioGroup>
        }
      </span>
    )
  }
}
