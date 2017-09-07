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
import { Button, Icon, DatePicker, Radio } from 'antd'
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
    value: PropTypes.array,
    // 获取选中的时间范围
    onChange: PropTypes.func,
    // 回调
    onOk: PropTypes.func.isRequired,
  }
  state = {
    value: [],
    configTime: true,
    currentRadio: 'fiveMin',
  }
  componentWillMount() {
    const now = Date.parse(new Date())
    const startTime = now - (5 * 60 * 1000)
    this.setState({
      value: [ startTime, now ],
    })
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
    this.setState({
      currentRadio: time,
    })
    return [ startTime, now ]
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
    this.onChange(this.getTimeArr(time))
    setTimeout(this.onOk, 0)
  }
  toogleTimePicker = () => {
    const { configTime } = this.state
    this.setState({ configTime: !configTime })
    if (configTime) {
      this.setState({
        currentRadio: '',
      })
    }
    this.onChange([])
  }
  render() {
    const { value, configTime, currentRadio } = this.state
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
              value={value}
              onChange={this.onChange}
              onOk={this.onOk}
            />
            :
            <RadioGroup className="apm-timepicker-btns" onChange={e => this.handleClick(e.target.value)} value={currentRadio} defaultValue="fiveMin">
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
