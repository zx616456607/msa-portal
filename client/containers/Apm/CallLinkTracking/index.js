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
import { Select, Button, DatePicker, Card, Icon, Table } from 'antd'
import { connect } from 'react-redux'
import Dock from 'react-dock'
import { loadPPApps, loadScatterData } from '../../../actions/pinpoint'
import { PINPOINT_LIMIT, X_GROUP_UNIT, Y_GROUP_UNIT } from '../../../constants'
import './style/index.less'

const Option = Select.Option
const ButtonGroup = Button.Group
const { RangePicker } = DatePicker

class CallLinkTracking extends React.Component {
  state = {
    isVisible: false,
    currentRecord: {},
    application: null,
    agent: null,
    rangeDateTime: null,
  }

  componentWillMount() {
    const { loadPPApps, clusterID, apmID } = this.props
    loadPPApps(clusterID, apmID)
  }

  loadData = () => {
    const { loadScatterData, clusterID, apmID, apps } = this.props
    const { application, rangeDateTime } = this.state
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
    loadScatterData(clusterID, apmID, query)
  }

  render() {
    const { apps } = this.props
    const { application, agent, rangeDateTime } = this.state
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#">Action 一 {record.name}</a>
          <span className="ant-divider" />
          <a href="#">Delete</a>
          <span className="ant-divider" />
          <a href="#" className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a>
        </span>
      ),
    }]

    const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }]
    return (
      <div className="call-link-tracking">
        <div className="layout-content-btns">
          <Select
            showSearch
            style={{ width: 200 }}
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
          <Button icon="reload">
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
              onChange={rangeDateTime => this.setState({ rangeDateTime })}
            />
            <Button icon="search" onClick={this.loadData} />
          </ButtonGroup>
          <Select
            className="float-right"
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个实例"
            optionFilterProp="children"
            value={agent}
            onChange={agent => this.setState({ agent })}
          >
            <Option value="lalala456">lalala456</Option>
            <Option value="lalala123">lalala123</Option>
          </Select>
        </div>
        <div className="layout-content-body">
          <Card className="call-link-tracking-table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              onRowClick={record => this.setState({ isVisible: true, currentRecord: record })}
            />
          </Card>
        </div>
        <Dock
          position="bottom"
          isVisible={this.state.isVisible}
          dimMode="transparent"
          dimStyle={{ backgroundColor: 'transparent' }}
          defaultSize={0.5}
        >
          <h1 onClick={() => this.setState({ isVisible: false })}>
            哈哈哈，我是 inspector - {this.state.currentRecord.name}
          </h1>
        </Dock>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current, queryApms, pinpoint, entities } = state
  const { cluster } = current
  const clusterID = cluster.id
  // @Todo: not support other apm yet
  const apmID = queryApms[clusterID].ids[0]
  let { apps } = pinpoint
  const { ppApps } = entities
  const appIDs = apps[apmID] && apps[apmID].ids || []
  apps = appIDs.map(id => ppApps[id])
  return {
    clusterID,
    apmID,
    apps,
  }
}

export default connect(mapStateToProps, {
  loadPPApps,
  loadScatterData,
})(CallLinkTracking)
