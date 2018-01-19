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
  Table, notification,
} from 'antd'
import { formatDate, handleHistoryForLoadData } from '../../../common/utils'
import confirm from '../../../components/Modal/confirm'
import ExpandRowSteps from './ExpandRowSteps'
import { connect } from 'react-redux'
import { parse as parseQuerystring } from 'query-string'
import {
  getCascadingLinkRulesList,
  deleteCsbCascadingLinkRule,
} from '../../../actions/CSB/cascadingLinkRules'
import { cascadingLinkRuleSlt } from '../../../selectors/CSB/cascadingLinkRules'

const InputGroup = Input.Group
const Search = Input.Search
const Option = Select.Option

class CSBCascadingLinkRules extends React.Component {
  state = {
    flag: 1,
    name: '',
  }

  componentWillMount() {
    this.loadData({}, true)
  }

  createCascadingLink = () => {
    const { history } = this.props
    history.push('/msa-om/csb-cascading-link-rules/create')
  }

  deleteRules = record => {
    const { name, id } = record
    const { deleteCsbCascadingLinkRule } = this.props
    const self = this
    confirm({
      modalTitle: '删除级联链路规则',
      title: `你确定要删除级联链路规则 ${name} 吗？`,
      content: '删除规则后，已经基于此链路发布的级联服务将被注销，已订阅的服务将被退订',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteCsbCascadingLinkRule(id).then(res => {
            if (res.error) return reject()
            resolve()
            notification.success({ message: '删除级联链路规则成功' })
            self.loadData()
          })
        })
      },
    })
  }

  loadData = (query = {}, isFirst) => {
    const { getCascadingLinkRulesList, location, history } = this.props
    const { name, flag } = this.state
    query = Object.assign({}, location.query, { name, flag }, query)
    if (!name) delete query.flag
    if (query.page && query.page === 1) delete query.page
    handleHistoryForLoadData(history, query, location, isFirst)
    getCascadingLinkRulesList(query)
  }

  tableChange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    let sorterOrder = 'd'
    if (order === 'ascend') sorterOrder = 'a'
    this.loadData({
      page: 1,
      sort: `${sorterOrder},${columnKey}`,
    })
  }

  render() {
    const { flag, name } = this.state
    const { location, cascadingLinkRule } = this.props
    const { content, size, isFetching, totalElements } = cascadingLinkRule
    const { query = {} } = location
    const { page } = query
    const paginationProps = {
      simple: true,
      total: totalElements,
      size,
      current: parseInt(page) || 1,
      onChange: page => this.loadData({ page }),
    }
    const columns = [
      { title: '级联链路规则名称', dataIndex: 'name', width: '17%' },
      { title: '起点实例', dataIndex: 'instance.name', width: '17%' },
      { title: '目标实例', dataIndex: 'count', width: '16%' },
      { title: '创建人', dataIndex: 'creatorName', width: '16%' },
      {
        title: '创建时间', dataIndex: 'createdAt', width: '17%',
        sorter: true,
        render: text => formatDate(text),
      },
      {
        title: '操作', dataIndex: 'handler', width: '17%',
        render: (text, record) => (
          <Button onClick={this.deleteRules.bind(this, record)}>删除</Button>
        ),
      },
    ]
    return (
      <QueueAnim id="CSB-cascading-link-rules">
        <div className="layout-content-btns header" key="header">
          <Button type="primary" icon="plus" onClick={() => this.createCascadingLink()}>创建级联链路</Button>
          <Button icon="reload" onClick={() => this.loadData()}>刷新</Button>
          <InputGroup compact style={{ width: 335, display: 'inline-block' }}>
            <Select style={{ width: 150 }} value={flag}
              onChange={flag => this.setState({ flag, name: '' })}
            >
              <Option value={1}>级联链路规则名称</Option>
              <Option value={2}>起点实例名称</Option>
            </Select>
            <Search
              style={{ width: 180 }}
              placeholder={`请输入${flag === 'rules' ? '级联链路规则' : '起点实例'}名称搜索`}
              onChange={e => this.setState({ name: e.target.value })}
              value={name}
              onSearch={() => this.loadData({ name, page: 1, flag })}
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
              expandedRowRender={record => <ExpandRowSteps stepItem={record.instances}/>}
              onChange={this.tableChange}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { location } = props
  location.query = parseQuerystring(location.search)
  return {
    cascadingLinkRule: cascadingLinkRuleSlt(state, props),
  }
}

export default connect(mapStateToProps, {
  getCascadingLinkRulesList,
  deleteCsbCascadingLinkRule,
})(CSBCascadingLinkRules)
