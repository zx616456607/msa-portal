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
import { Button, DatePicker, Radio } from 'antd'
import moment from 'moment'
import './style/index.less'

const { RangePicker } = DatePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
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
    value: PropTypes.array,
    // 获取选中的时间范围
    onChange: PropTypes.func,
    // 回调
    onOk: PropTypes.func.isRequired,
  }
  state = {
    value: [],
    isRangeTime: false,
    currentRadio: 'fiveMin',
  }
  componentDidMount() {
    this.setDefaultTime()
  }
  componentWillReceiveProps(nextProps) {
    /**
     * 设置时间范围
     *
     */
    const { value } = nextProps
    if (value[0] !== this.props.value[0] || value[1] !== this.props.value[1]) {
      this.setState({
        value,
      })
    }
  }
  componentWillUnmount() {
    clearInterval(this.timeInterval)
  }
  setDefaultTime = () => {
    const time = 'fiveMin'
    const value = this.getTimeArr(time)
    this.onChange(value)
    this.changeTimeInterval(time)
  }
  onOk = () => {
    const { onOk } = this.props
    /**
     * loadData 点击刷新时的回调
     *
     */
    if (onOk) {
      onOk()
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
    return [ moment(startTime), moment(now) ]
  }
  onChange = value => {
    const { onChange } = this.props
    this.setState({ value })
    /**
     * getTimeRange 获取时间范围
     *
     * @param {array} [开始时间，结束时间]
     */
    if (onChange) {
      onChange(value)
    }
  }
  handleClick = time => {
    const value = this.getTimeArr(time)
    this.setState({
      currentRadio: time,
    })
    this.onChange(value)
    setTimeout(this.onOk, 0)
    this.changeTimeInterval(time)
  }
  changeTimeInterval = time => {
    clearInterval(this.timeInterval)
    let value = this.getTimeArr(time)
    this.timeInterval = setInterval(() => {
      value = this.getTimeArr(time)
      this.onChange(value)
    }, 1000)
  }
  toogleTimePicker = () => {
    const { isRangeTime } = this.state
    if (!isRangeTime) {
      clearInterval(this.timeInterval)
      this.setState({
        currentRadio: null,
      })
    }
    this.setState({ isRangeTime: !isRangeTime })
  }
  render() {
    const { value, isRangeTime, currentRadio } = this.state
    return (
      <span className="apm-timepicker">
        <Button
          className="type-change-btn"
          type="primary"
          onClick={this.toogleTimePicker}
          icon="calendar"
        >
          自定义日期
        </Button>
        {
          isRangeTime ?
            <RangePicker
              className="apm-timepicker-component"
              key="timePicker"
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={[ '开始日期', '结束日期' ]}
              value={value}
              onChange={this.onChange}
              onOk={this.onOk}
            />
            :
            <RadioGroup
              className="apm-timepicker-btns"
              onChange={e => this.handleClick(e.target.value)}
              value={currentRadio}
            >
              {
                btnArr.map(item => (
                  <RadioButton key={item.key} value={item.key}>{item.text}</RadioButton>
                ))
              }
            </RadioGroup>
        }
      </span>
    )
  }
}
