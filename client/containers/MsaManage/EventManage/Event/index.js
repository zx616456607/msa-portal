/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 *
 *
 * @author zhangxuan
 * @date 2018-05-24
 */
import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import isEmpty from 'lodash/isEmpty'
import { Card, Table, Select, Input, DatePicker, Button, Pagination, Icon } from 'antd'
import './style/index.less'
import { eventLogList } from '../../../../actions/eventManage'
import { formatDate, handleHistoryForLoadData, parseOrderToQuery } from '../../../../common/utils'
import { parse as parseQuerystring } from 'query-string'
import { DEFAULT_PAGESIZE } from '../../../../constants'
import URGENT_ICON from '../../../../assets/img/msa-manage/urgent.svg'

const { RangePicker } = DatePicker
const Option = Select.Option

const EVENT_TYPES = [
  {
    type: 'EurekaInstanceCanceledEvent',
    text: '服务下线事件',
  }, {
    type: 'EurekaInstanceRegisteredEvent',
    text: '服务注册事件',
  }, {
    type: 'EurekaInstanceRenewedEvent',
    text: '服务续约事件',
  }, {
    type: 'EurekaRegistryAvailableEvent',
    text: 'Eureka注册中心启动事件',
  }, {
    type: 'EurekaServerStartedEvent',
    text: 'Eureka Server启动事件',
  },
]

const EVENT_LEVELS = [
  {
    level: 'Major',
    text: '重要',
  }, {
    level: 'Normal',
    text: '正常',
  }, {
    level: 'Critical',
    text: '严重',
  },
]

const ROOT_PLACES = [
  {
    root: 'eureka-server',
    text: '注册中心',
  },
]

const defaultQuery = {
  page: 1,
  size: 10,
}

class Event extends React.Component {
  state = {
    rangeDate: [],
  }

  componentDidMount() {
    this.loadData(null, true)
  }

  loadData = async (query, isFirst) => {
    const { eventLogList, clusterID, history, location } = this.props
    const { eventType, eventLevel, rootPlace, appName, keyword, rangeDate } = this.state
    const [ start, end ] = rangeDate
    query = Object.assign({}, location.query,
      { eventType, eventLevel, rootPlace, appName, keyword }, query)
    if (start) {
      query = Object.assign({}, query, { startTime: new Date(start).getTime() })
    }
    if (end) {
      query = Object.assign({}, query, { endTime: new Date(end).getTime() })
    }
    if (query.page === 1) {
      delete query.page
    }
    if (query.sort === '') {
      delete query.sort
    }
    if (isEmpty(rangeDate)) {
      delete query.startTime
      delete query.endTime
    }
    handleHistoryForLoadData(history, query, location, isFirst)
    const res = await eventLogList(clusterID, Object.assign({}, defaultQuery, query))
    if (res.error) {
      return
    }
  }

  tableChange = (pagination, filters, sorter) => {
    let sorterStr = ''
    if (!isEmpty(sorter)) {
      sorterStr = parseOrderToQuery(sorter)
    }
    this.loadData({
      page: pagination.current,
      sort: sorterStr,
    })
  }

  resetConfig = () => {
    this.setState({
      eventType: '',
      eventLevel: '',
      rootPlace: '',
      appName: '',
      keyword: '',
      rangeDate: [],
    }, () => this.loadData({ page: 1 }))
  }

  rangeChange = value => {
    this.setState({
      rangeDate: value,
    })
  }

  rangeConfirm = value => {
    this.setState({
      rangeDate: value,
    })
  }

  renderEventLevel = text => {
    let displayName = ''
    let icon
    let classname = ''
    switch (text) {
      case 'Critical':
        displayName = '严重'
        icon = (<svg className="event-page-urgent">
          <use xlinkHref={`${URGENT_ICON}`} />
        </svg>)
        classname = 'error-status'
        break
      case 'Major':
        displayName = '重要'
        icon = <Icon type="warning" />
        classname = 'warning-status'
        break
      case 'Normal':
        displayName = '正常'
        icon = <Icon type="exclamation-circle" />
        classname = 'primary-color'
        break
      default:
        break
    }
    return <span className={`${classname} event-page-status`}>
      {icon}
      <span style={{ marginLeft: 5 }}>{displayName}</span>
    </span>
  }

  render() {
    const { location } = this.props
    const { query } = location

    const columns = [
      {
        title: '事件类型',
        width: '10%',
        dataIndex: 'eventType',
      }, {
        title: '事件级别',
        width: '10%',
        dataIndex: 'eventLevel',
        render: this.renderEventLevel,
      }, {
        title: '事件源',
        width: '10%',
        dataIndex: 'rootPlace',
      }, {
        title: '服务名称',
        width: '10%',
        dataIndex: 'appName',
      }, {
        title: '服务实例 ID',
        width: '10%',
        dataIndex: 'instanceId',
      }, {
        title: '事件详情',
        width: '30%',
        dataIndex: 'describe',
      }, {
        title: '产生时间',
        width: '10%',
        dataIndex: 'eventTime',
        sorter: true,
        render: text => formatDate(text),
      },
    ]
    const data = []
    for (let i = 0; i < 11; i++) {
      data.push({
        key: i,
        eventType: '注册',
        eventLevel: i === 1 ? 'Major' : 'Critical',
        rootPlace: '注册中心',
        appName: 'abc',
        instanceId: i + 1,
        describe: 'hahdfhasfasf',
        eventTime: Date.now(),
      })
    }
    const pagination = {
      simple: true,
      pageSize: DEFAULT_PAGESIZE,
      total: data.length,
      current: parseInt(query.page, 10) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="event-page">
        <div className="alert-row" key="alert-row">事件页面中可查看微服务治理中需要关注的事件。</div>
        <div className="layout-content-btns event-page-btns" key="btns">
          <Select
            style={{ width: 200 }}
            placeholder="事件类型"
            onSelect={eventType => this.setState({ eventType })}
            value={this.state.eventType}
          >
            {
              EVENT_TYPES.map(item => <Option key={item.type}>{item.text}</Option>)
            }
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="事件级别"
            onSelect={eventLevel => this.setState({ eventLevel })}
            value={this.state.eventLevel}
          >
            {
              EVENT_LEVELS.map(item => <Option key={item.level}>{item.text}</Option>)
            }
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="事件源"
            onSelect={rootPlace => this.setState({ rootPlace })}
            value={this.state.rootPlace}
          >
            {
              ROOT_PLACES.map(item => <Option key={item.root}>{item.text}</Option>)
            }
          </Select>
          <Input
            placeholder="服务名称"
            style={{ width: 200 }}
            value={this.state.appName}
            onChange={e => this.setState({ appName: e.target.value })}
          />
          <Input
            placeholder="请输入事件关键字"
            style={{ width: 200 }}
            value={this.state.keyword}
            onChange={e => this.setState({ keyword: e.target.value })}
          />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={[ 'Start Time', 'End Time' ]}
            value={this.state.rangeDate}
            onChange={this.rangeChange}
            onOk={this.rangeConfirm}
          />
          <Button type="primary" icon="search" onClick={() => this.loadData()}>搜索</Button>
          <Button type="primary" icon="reload" onClick={() => this.resetConfig()}>重置</Button>
          <div className="page-box">
            <span className="total">共计 10 条</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              columns={columns}
              pagination={false}
              dataSource={data}
              onChange={this.tableChange}
              rowKey={row => row.key}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current } = state
  const { config } = current
  const { cluster } = config
  const { id } = cluster
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    clusterID: id,
  }
}

export default connect(mapStateToProps, {
  eventLogList,
})(Event)
