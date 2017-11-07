/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CallLinkTracking container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { Select, Button, Card, Table } from 'antd'
import QueueAnim from 'rc-queue-anim'
import ApmTimePicker from '../../components/ApmTimePicker'
import { formatDate } from '../../common/utils'
import {
  ALL,
  ERROR,
} from '../../constants'

const Option = Select.Option

export default class CallLinkTracking extends React.Component {
  render() {
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
    return (
      <QueueAnim className="call-link-tracking">
        <div className="layout-content-btns" key="btns">
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="选择微服务"
            optionFilterProp="children"
          >
            <Option value="test">test</Option>
          </Select>
          <Button icon="reload" onClick={this.loadData}>
            刷新
          </Button>
          <ApmTimePicker onOk={() => {}} />
          <Select
            className="float-right"
            showSearch
            style={{ width: 150 }}
            placeholder="选择一个实例"
            optionFilterProp="children"
          >
            <Option value={ALL}>{ALL}</Option>
          </Select>
        </div>
        <div className="layout-content-body" key="body">
          <Card className="call-link-tracking-table">
            <Table
              columns={columns}
              dataSource={[]}
              pagination={{
                size: 'small',
                pageSize: 50,
              }}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}
