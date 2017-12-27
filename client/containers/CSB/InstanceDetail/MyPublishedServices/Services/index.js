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
import {
  Card, Button, Input, Pagination,
} from 'antd'
import isEqual from 'lodash/isEqual'
import '../style/MyPublishedServices.less'
import ServicesTable from './Table'
import { toQuerystring } from '../../../../../common/utils'
import { getInstanceService } from '../../../../../actions/CSB/instanceService'
import { CSB_RELEASE_INSTANCES_SERVICE_FLAG } from '../../../../../constants'
import { getQueryAndFuncs, csbInstanceServiceSltMaker } from '../../../../../selectors/CSB/instanceService'
import CreateServiceGroupModal from '../Groups/CreateServiceGroupModal'

const Search = Input.Search
const { mergeQuery } = getQueryAndFuncs(CSB_RELEASE_INSTANCES_SERVICE_FLAG)
const publishedSlt = csbInstanceServiceSltMaker(CSB_RELEASE_INSTANCES_SERVICE_FLAG)

class MyPublishedServices extends React.Component {
  state = {
    name: '',
    createServiceGroupModalVisible: false,
  }

  componentWillMount() {
    this.loadData()
  }

  componentWillReceiveProps(nextProps) {
    const { isOff } = this.props
    const nextOff = nextProps.isOff
    if (nextOff !== isOff) {
      this.loadData({ includeDeleted: nextProps.isOff })
    }
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

  // 加载数据
  loadData = query => {
    const { getInstanceService, history, match, isOff } = this.props
    const { instanceID } = match.params
    const { name } = this.state
    const includeDeleted = isOff
    query = Object.assign({}, location.query, { name, includeDeleted }, query)
    if (query.name === '') {
      delete query.name
    }
    if (query.page === 1) {
      delete query.page
    }
    if (query.includeDeleted === false) {
      delete query.includeDeleted
    }
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    getInstanceService(instanceID, mergeQuery(query))
  }

  // 发布服务
  goPublishService = () => {
    const { history, match } = this.props
    const { instanceID } = match.params
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  render() {
    const { myPublished, match, history, instanceID } = this.props
    const { content, size, isFetching, totalElements } = myPublished
    const paginationProps = {
      simple: true,
      pageSize: size || 10,
      total: totalElements,
      current: 1,
    }
    const { createServiceGroupModalVisible } = this.state
    return [
      <div className="layout-content-btns" key="layout-content-btns">
        <Button onClick={this.goPublishService} type="primary">
          发布服务
        </Button>
        <Button icon="plus" onClick={this.openCreateServiceGroupModal}>
        创建服务组
        </Button>
        <Button icon="sync" onClick={() => this.loadData()}>刷新</Button>
        <Search
          placeholder="按服务名称搜索"
          className="search-input"
          onChange={e => this.setState({ name: e.target.value })}
          onSearch={name => this.loadData({ name, page: 1 })}
          value={this.state.name}
        />
        {
          totalElements > 0 && <div className="page-box">
            <span className="total">共 {totalElements} 条</span>
            <Pagination {...paginationProps} />
          </div>
        }
      </div>,
      <div key="data-box" className="layout-content-body">
        <Card>
          <ServicesTable
            loadData={this.loadData}
            loading={isFetching}
            dataSource={content}
            history={history}
            match={match} />
        </Card>
      </div>,
      <div key="modals">
        {
          createServiceGroupModalVisible && <CreateServiceGroupModal
            closeModalMethod={this.closeCreateServiceGroupModal}
            handle="create"
            instanceID={instanceID}
          />
        }
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { clusters } = entities
  const { match } = ownProps
  const { instanceID } = match.params
  return {
    clusters,
    instanceID,
    myPublished: publishedSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getInstanceService,
})(MyPublishedServices)
