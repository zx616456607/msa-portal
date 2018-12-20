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
import { formatDate, handleHistoryForLoadData } from '../../../../common/utils'
import {
  eventListSlt,
} from '../../../../selectors/event'
import { parse as parseQuerystring } from 'query-string'
import { DEFAULT_PAGESIZE } from '../../../../constants'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { withNamespaces } from 'react-i18next'

const { RangePicker } = DatePicker
const Option = Select.Option

const defaultQuery = {
  page: 1,
  size: 10,
}

@withNamespaces('springCloudEventManagement')
class Event extends React.Component {
  state = {
    rangeDate: [],
  }

  componentDidMount() {
    this.loadData(null, true)
  }

  eventTypes = () => {
    const { t } = this.props
    return [
      {
        type: 'InstanceDown',
        text: t('eventList.offLine'),
      }, {
        type: 'InstanceUp',
        text: t('eventList.instanceUp'),
      }, {
        type: 'InstanceRenewed',
        text: t('eventList.instanceRenewed'),
      }, {
        type: 'EurekaServerStart',
        text: t('eventList.eurekaServerStart'),
      }, {
        type: 'EurekaREgistryStart',
        text: t('eventList.eurekaRegistryStart'),
      },
    ]
  }

  eventLevels = () => {
    const { t } = this.props
    return [
      {
        level: 'Major',
        text: t('eventList.major'),
      }, {
        level: 'Minor',
        text: t('eventList.slight'),
      }, {
        level: 'Normal',
        text: t('eventList.normal'),
      }, {
        level: 'Critical',
        text: t('eventList.critical'),
      },
    ]
  }

  rootPlaces = () => {
    const { t } = this.props
    return [
      {
        root: 'discovery:spring-cloud-discovery:8761',
        text: t('eventList.eurekaRegistry'),
      },
    ]
  }
  loadData = async (query, isFirst) => {
    query = query || {}
    const { eventLogList, clusterID, history, location } = this.props
    const { eventType, eventLevel, rootPlace, appName, rangeDate } = this.state
    const [ start, end ] = rangeDate
    query = Object.assign({}, location.query,
      { eventType, eventLevel, rootPlace,
        appName: appName ? encodeURIComponent(appName) : '',
        page: query.page || 1,
      })
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
      switch (sorter.order) {
        case 'descend':
          sorterStr = 'DESC'
          break
        case 'ascend':
          sorterStr = 'ASC'
          break
        default:
          break
      }
    }
    this.loadData({
      page: pagination.current,
      sort: sorterStr,
    })
  }

  resetConfig = () => {
    this.setState({
      eventType: undefined,
      eventLevel: undefined,
      rootPlace: undefined,
      appName: '',
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

  renderEventType = text => {
    const { t } = this.props
    switch (text) {
      case 'InstanceDown':
        return t('eventList.offLine')
      case 'InstanceUp':
        return t('eventList.instanceUp')
      case 'InstanceRenewed':
        return t('eventList.instanceRenewed')
      case 'EurekaServerStart':
        return t('eventList.eurekaServerStart')
      case 'EurekaRegistryStart':
        return t('eventList.eurekaRegistryStart')
      default:
        return t('eventList.unknown')
    }
  }
  renderRootPlace = text => {
    const { t } = this.props
    switch (text) {
      case 'discovery:spring-cloud-discovery:8761':
        return t('eventList.eurekaRegistry')
      default:
        return t('eventList.unknown')
    }
  }

  renderEventLevel = text => {
    const { t } = this.props
    let displayName = ''
    let icon
    let classname = ''
    switch (text) {
      case 'Critical':
        displayName = t('eventList.critical')
        icon = (
          <TenxIcon
            type="urgent"
            size={12}
            className="event-page-urgent"
          />
        )
        classname = 'error-status'
        break
      case 'Minor':
        displayName = t('eventList.slight')
        icon = (
          <TenxIcon
            type="down"
            size={12}
            className="event-page-slight"
          />
        )
        classname = 'primary-color'
        break
      case 'Major':
        displayName = t('eventList.major')
        icon = <Icon type="warning" />
        classname = 'warning-status'
        break
      case 'Normal':
        displayName = t('eventList.normal')
        icon = <Icon type="info-circle" />
        classname = 'success-status'
        break
      default:
        break
    }
    return <span className={`${classname} event-page-status`}>
      {icon}
      <span style={{ marginLeft: 5 }}>{displayName}</span>
    </span>
  }
  changeQueryType(typeObj) {
    this.setState(typeObj)
  }
  render() {
    const { location, eventList, isFetching, totalElements } = this.props
    const { query } = location
    const { t } = this.props
    const columns = [
      {
        title: t('eventList.eventType'),
        width: '10%',
        dataIndex: 'eventType',
        render: this.renderEventType,
      }, {
        title: t('eventList.eventLevel'),
        width: '10%',
        dataIndex: 'eventLevel',
        render: this.renderEventLevel,
      }, {
        title: t('eventList.eventSource'),
        width: '20%',
        dataIndex: 'rootPlace',
        render: this.renderRootPlace,
      }, {
        title: t('eventList.serviceName'),
        width: '15%',
        dataIndex: 'appName',
      }, {
        title: t('eventList.servicePodId'),
        width: '20%',
        dataIndex: 'instanceId',
      }, {
        // title: '事件详情',
        // width: '10%',
        // dataIndex: 'describe',
        // render: _ => _ || '-',
      }, {
        title: t('eventList.createTime'),
        width: '20%',
        dataIndex: 'eventTime',
        sorter: true,
        render: text => formatDate(text),
      },
    ]
    const pagination = {
      simple: true,
      pageSize: DEFAULT_PAGESIZE,
      total: totalElements,
      current: parseInt(query.page, 10) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="event-page">
        <div className="alert-row" key="alert-row">{t('eventList.tip')}</div>
        <div className="layout-content-btns event-page-btns" key="btns">
          <Select
            style={{ width: 200 }}
            placeholder={t('eventList.eventType')}
            onChange={eventType => this.changeQueryType({ eventType })}
            value={this.state.eventType}
            allowClear={true}
          >
            <Option key="all" value="">{t('eventList.allEvents')}</Option>
            {
              this.eventTypes().map(item => <Option key={item.type}>{item.text}</Option>)
            }
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder={t('eventList.eventLevel')}
            onChange={eventLevel => this.changeQueryType({ eventLevel })}
            value={this.state.eventLevel}
            allowClear={true}
          >
            {
              this.eventLevels().map(item => <Option key={item.level}>{item.text}</Option>)
            }
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder={t('eventList.eventSource')}
            onChange={rootPlace => this.changeQueryType({ rootPlace })}
            value={this.state.rootPlace}
            allowClear={true}
          >
            {
              this.rootPlaces().map(item => <Option key={item.root}>{item.text}</Option>)
            }
          </Select>
          <Input
            placeholder={t('eventList.serviceName')}
            style={{ width: 200 }}
            value={this.state.appName}
            onChange={e => this.changeQueryType({ appName: e.target.value })}
          />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={[ 'Start Time', 'End Time' ]}
            value={this.state.rangeDate}
            onChange={this.rangeChange}
            onOk={this.rangeConfirm}
          />
          <Button type="primary" icon="search" onClick={() => this.loadData()}>{t('eventList.search')}</Button>
          <Button type="primary" icon="reload" onClick={() => this.resetConfig()}>{t('eventList.reset')}</Button>
          <div className="page-box">
            <span className="total">{t('eventList.totalCount', {
              replace: { totalElements },
            })}</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              columns={columns}
              pagination={false}
              dataSource={eventList}
              loading={isFetching}
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
  const { current, eventManage } = state
  const { config } = current
  const { cluster } = config
  const { id } = cluster
  const { eventList } = eventManage
  const { isFetching, totalElements } = eventList
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    clusterID: id,
    ...eventListSlt(state),
    isFetching,
    totalElements,
  }
}

export default connect(mapStateToProps, {
  eventLogList,
})(Event)
