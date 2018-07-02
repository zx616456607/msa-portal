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
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Checkbox, Icon, Select, DatePicker, Input, Tooltip, Button,
  Card, Table, Pagination, Badge,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, DEFAULT_PAGESIZE, DEFAULT_PAGE } from '../../../constants/index'
import {
  getZipkinServices,
} from '../../../actions/callLinkTrack'
import cloneDeep from 'lodash/cloneDeep'
import './style/index.less'
import { formatFromnow } from '../../../common/utils'

const { RangePicker } = DatePicker
const Option = Select.Option

class CallLinkTracking extends React.Component {

  state = {
    current: DEFAULT_PAGE,
  }

  render() {
    const { current, service } = this.state
    const { history } = this.props
    const pagination = {
      simple: true,
      total: 10 || 0,
      pageSize: DEFAULT_PAGESIZE,
      current,
      // onChange: current => this.setState({ current }),
    }

    const columns = [{
      title: 'Trace ID',
      dataIndex: 'traceId',
      width: '15%',
      render: id => <Link to={`/msa-manage/call-link-tracking/${id}`}>{id}</Link>,
    }, {
      title: '微服务名称',
      dataIndex: 'serviceName',
      width: '20%',
      render: () => service,
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'}/>
        {status ? '成功' : '失败'}
      </div>,
    }, {
      title: '总span数',
      dataIndex: 'span',
      width: '10%',
    }, {
      title: '总耗时数（ms）',
      width: '10%',
      dataIndex: 'duration',
    }, {
      title: '开始时间',
      width: '10%',
      dataIndex: 'timestamp',
      render: time => formatFromnow(time),
    }, {
      title: '操作',
      width: '10%',
      render: () => <Button
        type={'primary'}
        onClick={record => history.push(`/msa-manage/call-link-tracking/${record.id}`)}
      >
        查看详情
      </Button>,
    }]
    const data = [{
      traceId: 'service1',
      status: true,
      span: 2,
      duration: 80,
      timestamp: '2018-7-1',
    }]
    return (
      <QueueAnim className="msa-call-link-tracking">
        <div className="layout-content-btns call-link-tracking-btns" key="btns">
          <Select
            style={{ width: 200 }}
            placeholder="选择微服务"
            onSelect={service => this.setState({ service })}
            value={service}
          >
            <Option key={'server1'}>server1</Option>
            <Option key={'server2'}>server2</Option>
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="选择span"
          >
            <Option key={'all'}>all</Option>
            <Option key={'abc'}>abc</Option>
          </Select>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={[ '开始时间', '结束时间' ]}
            value={this.state.rangeDate}
            onChange={rangeDate => this.setState({ rangeDate })}
            onOk={rangeDate => this.setState({ rangeDate })}
          />
          <Input
            placeholder="耗时（ms）>="
            style={{ width: 200 }}
            value={this.state.timeConsuming}
            onChange={e => this.setState({ timeConsuming: e.target.value })}
          />
          <Input
            placeholder="返回条数"
            style={{ width: 200 }}
            value={this.state.count}
            onChange={e => this.setState({ count: e.target.value })}
          />
          <Input
            placeholder="Trace ID"
            style={{ width: 200 }}
            value={this.state.traceId}
            onChange={e => this.setState({ traceId: e.target.value })}
          />
          <Tooltip title="在使用TraceID搜索时，其他条件设置无效。">
            <Icon type="question-circle-o" />
          </Tooltip>
          <Checkbox
            checked={this.state.checked}
            onChange={e => this.setState({ checked: e.target.checked })}
          >
            只查失败
          </Checkbox>
          <Button type={'primary'} icon={'search'}>搜索</Button>
          <Button type={'primary'} icon={'rollback'}>重置</Button>
          <div className="page-box">
            <span className="total">共 10 条</span>
            <Pagination {...pagination}/>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              pagination={false}
              dataSource={data}
              columns={columns}
              rowKey={row => row.traceId}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const currentConfig = cloneDeep(current.config)
  const currentUser = current.user.info
  if (currentConfig.project.namespace === DEFAULT) {
    currentConfig.project.namespace = currentUser.namespace
  }
  return {
    currentConfig,
    currentUser,
  }
}

export default connect(mapStateToProps, {
  getZipkinServices,
})(CallLinkTracking)
