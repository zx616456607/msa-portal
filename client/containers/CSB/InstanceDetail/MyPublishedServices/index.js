/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Services
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
  Radio, Row, Col, Card, Button, Input, Pagination,
} from 'antd'
import { parse as parseQuerystring } from 'query-string'
import ServicesTable from './ServicesTable'
import { handleHistoryForLoadData } from '../../../../common/utils'
import { CSB_RELEASE_INSTANCES_SERVICE_FLAG } from '../../../../constants'
import { getQueryAndFuncs, csbInstanceServiceSltMaker } from '../../../../selectors/CSB/instanceService'
import CreateServiceGroupModal from './Groups/CreateServiceGroupModal'
import { getInstanceService, getInstanceServiceOverview } from '../../../../actions/CSB/instanceService'
import ServiceOrGroupSwitch from './ServiceOrGroupSwitch'
import './style/MyPublishedServices.less'

const RadioGroup = Radio.Group
const Search = Input.Search
const { mergeQuery } = getQueryAndFuncs(CSB_RELEASE_INSTANCES_SERVICE_FLAG)
const publishedSlt = csbInstanceServiceSltMaker(CSB_RELEASE_INSTANCES_SERVICE_FLAG)

class MyPublishedServices extends React.Component {
  state = {
    includeDeleted: false,
    name: '',
    createServiceGroupModalVisible: false,
  }

  // 是否显示已注销服务
  logoutServiceChange = e => {
    const includeDeleted = e.target.value
    this.setState({
      includeDeleted,
    })
    this.loadData({ includeDeleted })
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { name } = query
    this.setState({
      name,
    }, () => {
      this.loadData({}, true)
    })
  }

  openCreateServiceGroupModal = () => {
    this.setState({
      createServiceGroupModalVisible: true,
    })
  }

  closeCreateServiceGroupModal = () => {
    this.setState({
      createServiceGroupModalVisible: false,
    })
  }

  getSearchQuery = (name, includeDeleted) => {
    name = name || this.state.name
    return {
      name: name || '',
      includeDeleted,
    }
  }

  // 加载数据
  loadData = (query, isFirst) => {
    const { getInstanceService, history, match, location } = this.props
    const { instanceID } = match.params
    const { name, includeDeleted } = this.state
    query = Object.assign({}, location.query, { name, includeDeleted }, query)
    if (query.page === 1) {
      delete query.page
    }
    if (query.includeDeleted === true) {
      query.status ? query.status :
        query.status = [ '1', '2', '4' ]
    }
    if (query.sort === '') {
      delete query.sort
    }
    if (query.filter === '') {
      delete query.filter
    }
    delete query.includeDeleted
    handleHistoryForLoadData(history, query, location, isFirst)

    getInstanceService(instanceID, mergeQuery(query))
  }

  // 发布服务
  goPublishService = () => {
    const { history, match } = this.props
    const { instanceID } = match.params
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  render() {
    const { myPublished, match, history, instanceID, location } = this.props
    const { content, size, isFetching, totalElements } = myPublished
    const { query } = location
    const { includeDeleted, name } = this.state
    const paginationProps = {
      simple: true,
      pageSize: size || 10,
      total: totalElements,
      current: parseInt(query.page) || 1,
      onChange: page => this.loadData({ page }),
    }
    const { createServiceGroupModalVisible } = this.state
    return (
      <QueueAnim id="my-published-services">
        <div key="type" className="showType">
          <Row>
            <Col span="10">
              <ServiceOrGroupSwitch
                defaultValue="all"
                instanceID={instanceID}
                history={history}
              />
            </Col>
            <Col span="12">
              <label>已注销服务：</label>
              <RadioGroup onChange={this.logoutServiceChange} defaultValue={false}>
                <Radio value={false}>不显示</Radio>
                <Radio value={true}>显示</Radio>
              </RadioGroup>
            </Col>
          </Row>
        </div>
        <div key="layout-content-btns" className="layout-content-btns">
          <Button onClick={this.goPublishService} type="primary">
            发布服务
          </Button>
          <Button icon="plus" onClick={this.openCreateServiceGroupModal}>
            创建服务组
          </Button>
          <Button icon="sync" onClick={this.loadData.bind(this, null)}>刷新</Button>
          <Search
            placeholder="按服务名称搜索"
            className="search-input"
            onChange={e => this.setState({ name: e.target.value })}
            onSearch={() => this.loadData({ name, page: 1 })}
            value={this.state.name}
          />
          {
            totalElements > 0 && <div className="page-box">
              <span className="total">共 {totalElements} 条</span>
              <Pagination {...paginationProps} />
            </div>
          }
        </div>
        <div key="data-box" className="layout-content-body">
          <Card>
            <ServicesTable
              check={includeDeleted}
              loadData={this.loadData}
              loading={isFetching}
              dataSource={content}
              history={history}
              match={match} />
          </Card>
        </div>
        <div key="modals">
          {
            createServiceGroupModalVisible && <CreateServiceGroupModal
              closeModalMethod={this.closeCreateServiceGroupModal}
              handle="create"
              instanceID={instanceID}
              history={history}
              from="services"
            />
          }
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { clusters } = entities
  const { location, match } = ownProps
  const { instanceID } = match.params
  location.query = parseQuerystring(location.search)
  return {
    clusters,
    instanceID,
    myPublished: publishedSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getInstanceService,
  getInstanceServiceOverview,
})(MyPublishedServices)
