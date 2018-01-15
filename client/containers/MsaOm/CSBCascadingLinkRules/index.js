/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CSB Cascading Link Rules Component
 *
 * 2018-1-11
 * @author zhangcz
 */


import React from 'react'
import QueueAnim from 'rc-queue-anim'
import './style/CSBCascadingLinkRules.less'
import {
  Button, Input, Select, Pagination, Card,
  Table,
} from 'antd'
import { formatDate } from '../../../common/utils'
import confirm from '../../../components/Modal/confirm'
import ExpandRowSteps from './ExpandRowSteps'

const InputGroup = Input.Group
const Search = Input.Search
const Option = Select.Option

export default class CSBCascadingLinkRules extends React.Component {
  state = {
    searchType: 'rules',
    name: '',
  }

  createCascadingLink = () => {
    const { history } = this.props
    history.push('/msa-om/csb-cascading-link-rules/create')
  }

  deleteRules = record => {
    const { rules } = record
    confirm({
      modalTitle: '删除级联链路规则',
      title: `你确定要退订服务 ${rules} 吗？`,
      content: '删除规则后，已经基于此链路发布的级联服务将被注销，已订阅的服务将被退订',
      onOk() {
        return new Promise((resolve, reject) => {
          reject()
        })
      },
    })
  }

  loadData = () => {}

  render() {
    const { searchType, name } = this.state
    const { location } = this.props
    const { query = {} } = location
    const { page } = query
    const totalElements = 10
    const isFetching = false
    const paginationProps = {
      simple: true,
      total: totalElements,
      size: 10,
      current: parseInt(page) || 1,
      onChange: page => this.loadData({ page }),
    }
    const columns = [
      { title: '级联链路规则名称', dataIndex: 'rules', width: '17%' },
      { title: '起点实例', dataIndex: 'start', width: '17%' },
      { title: '目标实例', dataIndex: 'target', width: '16%' },
      { title: '创建人', dataIndex: 'creator', width: '16%' },
      {
        title: '创建时间', dataIndex: 'createTime', width: '17%',
        render: text => formatDate(text),
      },
      { title: '操作', dataIndex: 'handler', width: '17%',
        render: (text, record) => (
          <Button onClick={this.deleteRules.bind(this, record)}>删除</Button>
        ),
      },
    ]
    const content = []
    for (let i = 0; i < 15; i++) {
      const steps = []
      for (let j = 0; j < i; j++) {
        steps.push(j)
      }
      const item = {
        id: i,
        rules: `rules${i}`,
        start: `hello${i}`,
        target: `target${i}`,
        creator: `creator${i}`,
        createTime: '2011-1-1',
        steps,
      }
      content.push(item)
    }
    return (
      <QueueAnim id="CSB-cascading-link-rules">
        <div className="layout-content-btns header" key="header">
          <Button type="primary" icon="plus" onClick={() => this.createCascadingLink()}>创建级联链路</Button>
          <Button icon="reload" onClick={() => this.loadData()}>刷新</Button>
          <InputGroup compact style={{ width: 335, display: 'inline-block' }}>
            <Select style={{ width: 150 }} value={searchType}
              onChange={searchType => this.setState({ searchType })}
            >
              <Option value="rules">级联链路规则名称</Option>
              <Option value="instances">起点实例名称</Option>
            </Select>
            <Search
              style={{ width: 180 }}
              placeholder={`请输入${searchType === 'rules' ? '级联链路规则' : '起点实例'}名称搜索`}
              onChange={e => this.setState({ name: e.target.value })}
              value={name}
              onSearch={() => this.loadData({ name, page: 1 })}
            />
          </InputGroup>
          {totalElements > 0 && <div className="page-box">
            <span className="total">共 {totalElements} 条</span>
            <Pagination {...paginationProps}/>
          </div>}
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              columns={columns}
              dataSource={content}
              pagination={false}
              loading={isFetching}
              rowKey={record => record.id}
              expandedRowRender={record => <ExpandRowSteps stepItem={record.steps}/>}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}
