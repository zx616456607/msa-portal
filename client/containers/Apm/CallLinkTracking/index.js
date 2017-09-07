/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Call link tracking container
 *
 * 2017-08-29
 * @author zhangpc
 */

import React from 'react'
import { Select, Button, DatePicker, Card, Table, message, Icon } from 'antd'
import { connect } from 'react-redux'
import { parse as parseQuerystring } from 'query-string'
import moment from 'moment'
import Dock from '../../../components/Dock'
import TransactionInspector from '../../../components/TransactionInspector'
import { formatDate } from '../../../common/utils'
import {
  loadPPApps,
  loadScatterData,
  loadTransactionMetadata,
  loadTransactionInfo,
} from '../../../actions/pinpoint'
import {
  PINPOINT_LIMIT,
  X_GROUP_UNIT,
  Y_GROUP_UNIT,
  ALL,
  ERROR,
} from '../../../constants'
import './style/index.less'

const Option = Select.Option
const ButtonGroup = Button.Group
const { RangePicker } = DatePicker
const DEFAULT_DOCK_SIZE = 0.5

class CallLinkTracking extends React.Component {
  state = {
    isVisible: false,
    currentRecord: {},
    application: undefined,
    agent: ALL,
    agentList: [],
    rangeDateTime: null,
    loading: false,
  }

  componentWillMount() {
    const { loadPPApps, clusterID, apmID, location } = this.props
    loadPPApps(clusterID, apmID)
    const { application, from, to } = location.query || {}
    if (application && from && to) {
      this.setState({
        application,
        rangeDateTime: [ moment(from), moment(to) ],
      }, () => {
        this.loadData()
      })
    }
  }

  componentDidMount() {
    this.appDom = document.getElementById('app')
  }

  componentWillUnmount() {
    this.appDom.style.cssText = ''
  }

  loadData = () => {
    const {
      loadScatterData,
      loadTransactionMetadata,
      clusterID,
      apmID,
      apps,
    } = this.props
    const { application, rangeDateTime, agent } = this.state
    if (!application) {
      message.warning('请选择微服务')
      return
    }
    if (!rangeDateTime || !rangeDateTime[0]) {
      message.warning('请选择开始跟结束时间')
      return
    }
    this.setState({
      loading: true,
    })
    let serviceTypeName
    apps.every(app => {
      if (app.applicationName === application) {
        serviceTypeName = app.serviceType
        return false
      }
      return true
    })
    const query = {
      application,
      serviceTypeName,
      from: rangeDateTime[0].valueOf(),
      to: rangeDateTime[1].valueOf(),
      xGroupUnit: X_GROUP_UNIT,
      yGroupUnit: Y_GROUP_UNIT,
      limit: PINPOINT_LIMIT,
    }
    loadScatterData(clusterID, apmID, query).then(res => {
      if (res.error) {
        this.setState({
          loading: false,
        })
        return
      }
      const body = {}
      const { scatter, from } = res.response.result
      let { dotList, metadata } = scatter
      if (agent !== ALL) {
        const targetAgentKey = Object.keys(metadata).filter(key => metadata[key][0] === agent)
        dotList = dotList.filter(dot => targetAgentKey.indexOf(dot[2] + '') > -1)
      }
      const I = 'I'
      const T = 'T'
      const R = 'R'
      dotList.forEach((dot, index) => {
        const agentMetadata = metadata[dot[2]]
        body[`${I}${index}`] = `${agentMetadata[0]}^${agentMetadata[2]}^${dot[3]}`
        body[`${T}${index}`] = from + dot[0]
        body[`${R}${index}`] = dot[1]
      })
      return loadTransactionMetadata(clusterID, apmID, application, body)
    }).then(res => {
      this.setState({
        loading: false,
      })
      if (res.error) {
        return
      }
      if (agent === ALL) {
        const agentListObj = {}
        res.response.result.metadata.map(agent => (agentListObj[agent.agentId] = true))
        this.setState({
          agentList: Object.keys(agentListObj),
        })
      }
    })
  }

  onAgentChange = agent => {
    this.setState({ agent }, () => {
      this.loadData()
    })
  }

  handleRowClick = record => {
    const { currentRecord } = this.state
    if (currentRecord.agentId === record.agentId && currentRecord.spanId === record.spanId) {
      return
    }
    if (!currentRecord.agentId) {
      this.onDockSizeChange(DEFAULT_DOCK_SIZE)
    }
    this.setState({
      isVisible: true,
      currentRecord: record,
    })
    const { loadTransactionInfo, clusterID, apmID } = this.props
    const { agentId, spanId, traceId, collectorAcceptTime } = record
    const query = {
      agentId,
      spanId,
      traceId,
      focusTimestamp: collectorAcceptTime,
    }
    loadTransactionInfo(clusterID, apmID, query)
  }

  onDockSizeChange = size => {
    this.appDom.style.maxHeight = `${(1 - size - 0.01) * 100}%`
    this.appDom.style.overflow = 'auto'
  }

  render() {
    const { apps, transaction, transactionInfo } = this.props
    const {
      application,
      agent,
      rangeDateTime,
      loading,
      currentRecord,
      agentList,
    } = this.state
    const columns = [{
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Stat time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: text => formatDate(text),
    }, {
      title: 'Path',
      dataIndex: 'application',
      key: 'application',
    }, {
      title: 'Res.(ms)',
      dataIndex: 'elapsed',
      key: 'elapsed',
    }, {
      title: 'Exception',
      dataIndex: 'exception',
      key: 'exception',
      render: text => {
        if (text === ERROR) {
          return <Icon type="close-circle-o" className="error"/>
        }
        return
      },
    }, {
      title: 'Agent',
      dataIndex: 'agentId',
      key: 'agentId',
    }, {
      title: 'Client IP',
      dataIndex: 'remoteAddr',
      key: 'remoteAddr',
    }, {
      title: 'Transaction',
      dataIndex: 'traceId',
      key: 'traceId',
    }]

    const data = transaction[application] && transaction[application].metadata || []
    data.forEach((item, index) => {
      item.index = index
    })
    return (
      <div className="call-link-tracking">
        <div className="layout-content-btns">
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="选择微服务"
            optionFilterProp="children"
            value={application}
            onChange={application => this.setState({ application })}
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
          <ButtonGroup className="call-link-tracking-date">
            <Button icon="calendar" type="primary">
              自定义日期
            </Button>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={[ '开始日期', '结束日期' ]}
              value={rangeDateTime}
              onChange={rangeDateTime => { this.setState({ rangeDateTime }); console.log(rangeDateTime) }}
              onOk={this.loadData}
            />
            <Button icon="search" onClick={this.loadData} />
          </ButtonGroup>
          <Select
            className="float-right"
            showSearch
            style={{ width: 150 }}
            placeholder="选择一个实例"
            optionFilterProp="children"
            value={agent}
            onChange={this.onAgentChange}
          >
            <Option value={ALL}>{ALL}</Option>
            {
              agentList.map(agent => <Option key={agent}>{agent}</Option>)
            }
          </Select>
        </div>
        <div className="layout-content-body">
          <Card className="call-link-tracking-table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{
                size: 'small',
                pageSize: 50,
              }}
              rowKey={row => row.spanId}
              loading={loading}
              onRowClick={this.handleRowClick}
            />
          </Card>
        </div>
        <div className="call-stack-dock">
          <Dock
            position="bottom"
            isVisible={this.state.isVisible}
            dimMode="transparent"
            dimStyle={{ backgroundColor: 'transparent' }}
            defaultSize={DEFAULT_DOCK_SIZE}
            onSizeChange={this.onDockSizeChange}
          >
            <TransactionInspector
              dataSource={
                transactionInfo[currentRecord.agentId]
                && transactionInfo[currentRecord.agentId][currentRecord.spanId]
                || {}
              }
            />
          </Dock>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, queryApms, pinpoint, entities } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  // @Todo: not support other apm yet
  const apmID = queryApms[clusterID].ids[0]
  let { apps, queryTransaction, transactionInfo } = pinpoint
  const { ppApps } = entities
  const appIDs = apps[apmID] && apps[apmID].ids || []
  apps = appIDs.map(id => ppApps[id])
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    clusterID,
    apmID,
    apps,
    transaction: queryTransaction[apmID] || {},
    transactionInfo,
    location,
  }
}

export default connect(mapStateToProps, {
  loadPPApps,
  loadScatterData,
  loadTransactionMetadata,
  loadTransactionInfo,
})(CallLinkTracking)
