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
import { Checkbox, Icon, Select, DatePicker, Input, Tooltip, Button } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT } from '../../../constants/index'
import cloneDeep from 'lodash/cloneDeep'
import './style/index.less'

const { RangePicker } = DatePicker
const Option = Select.Option

class CallLinkTracking extends React.Component {

  state = {}

  render() {
    // const { currentConfig, currentUser } = this.props
    return (
      <QueueAnim className="msa-call-link-tracking">
        <div className="layout-content-btns call-link-tracking-btns" key="btns">
          <Select
            style={{ width: 200 }}
            placeholder="选择微服务"
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
        </div>
        <div className="layout-content-body" key="body">

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
  //
})(CallLinkTracking)
