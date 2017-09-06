/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * ApmButtonGroup
 *
 * 2017-09-06
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Icon, DatePicker, Select, message, Radio } from 'antd'
const { RangePicker } = DatePicker
const Option = Select.Option
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

class ApmButtonGroup extends React.Component {
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
  selectApp = application => {
    const { rangeDateTime } = this.state
    const { getCurrentApp } = this.props
    this.setState({ application })
    if (!rangeDateTime || !rangeDateTime[0]) {
      message.warning('请选择开始跟结束时间')
      return
    }
    /**
     * getCurrentApp 获取当前选中的应用
     * 
     * @param {string} 应用名称
     */
    if (getCurrentApp) {
      getCurrentApp(application)
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
    const { application, rangeDateTime, configTime } = this.state
    const { apps } = this.props
    return (
      <div className="layout-content-btns">
        <Select
          showSearch
          style={{ width: 150 }}
          placeholder="选择微服务"
          optionFilterProp="children"
          value={application}
          onChange={application => this.selectApp(application)}
        >
          {
            apps.map(app => (
              <Option key={app.applicationName}>{app.applicationName}</Option>
            ))
          }
        </Select>
        <Button icon="reload" onClick={this.loadData}>
          刷新
        </Button>
        <span>
          <Button type="primary" onClick={this.toogleTimePicker}><Icon type="calendar"/> 自定义日期</Button>
          {
            !configTime ?
              <RangePicker
                key="timePicker"
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={[ '开始日期', '结束日期' ]}
                value={rangeDateTime}
                onChange={rangeDateTime => this.getRangeDate(rangeDateTime)}
                onOk={this.getData}
              />
              :
              <RadioGroup onChange={e => this.getTimeArr(e.target.value)} defaultValue="fiveMin">
                {
                  btnArr.map(item => {
                    return <RadioButton key={item.key} value={item.key}>{item.text}</RadioButton>
                  })
                }
              </RadioGroup>
          }
        </span>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const clusterID = current.config.cluster.id
  const apms = queryApms[clusterID]
  // @Todo: not support other apm yet
  const apmID = apms.ids[0]
  let apps = []
  if (pinpoint.apps[apmID]) {
    apps = pinpoint.apps[apmID].ids || []
    apps = apps.map(id => entities.ppApps[id])
  }
  return {
    apps,
  }
}

export default connect(mapStateToProps, {
})(ApmButtonGroup)
