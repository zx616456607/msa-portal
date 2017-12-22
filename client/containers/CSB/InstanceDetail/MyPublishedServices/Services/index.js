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

const Search = Input.Search
const { mergeQuery } = getQueryAndFuncs(CSB_RELEASE_INSTANCES_SERVICE_FLAG)
const publishedSlt = csbInstanceServiceSltMaker(CSB_RELEASE_INSTANCES_SERVICE_FLAG)

class MyPublishedServices extends React.Component {
  state = {
    name: '',
  }

  componentWillMount() {
    this.loadData()
  }

  // 加载数据
  loadData = query => {
    const { getInstanceService, history, match } = this.props
    const { instanceID } = match.params
    const { name } = this.state
    query = Object.assign({}, location.query, { name }, query)
    if (query.name === '') {
      delete query.name
    }
    if (query.page === 1) {
      delete query.page
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

  // 是否显示已注销服务
  logoutServiceChange = value => {
    console.log('value=', value)
  }

  render() {
    const { myPublished } = this.props
    const { content, size, isFetching, totalElements } = myPublished
    const paginationProps = {
      simple: true,
      pageSize: size || 10,
      total: totalElements,
      current: 1,
    }
    return [
      <div className="layout-content-btns" key="layout-content-btns">
        <Button onClick={this.goPublishService} type="primary">
          发布服务
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
          <ServicesTable loadData={this.loadData} loading={isFetching} dataSource={content} />
        </Card>
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entities } = state
  const { clusters } = entities
  return {
    clusters,
    myPublished: publishedSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getInstanceService,
})(MyPublishedServices)
