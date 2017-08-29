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
import Dock from 'react-dock'
import './style/index.less'

const Option = Select.Option
const ButtonGroup = Button.Group
const { RangePicker } = DatePicker

export default class CallLinkTracking extends React.Component {
  state = {
    isVisible: false,
  }

  render() {
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
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个实例"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="all">All</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
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
            />
            <Button icon="search" />
          </ButtonGroup>
        </div>
        <div className="layout-content-body">
          <Card className="call-link-tracking-table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              onRowClick={() => this.setState({ isVisible: true })}
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
            哈哈哈，我是 inspector
          </h1>
        </Dock>
      </div>
    )
  }
}
