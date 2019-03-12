/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * api group detail server list
 *
 * 2019-03-04
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import { Button, Input, Icon, Card, Table, Pagination, notification } from 'antd'
import * as TenxModal from '@tenx-ui/modal'
import {
  formatDate,
} from '../../../common/utils'
import './style/index.less'
import { loadAllServices } from '../../../actions/serviceMesh'
import { getGatewayApiGroupTargets, removeGatewayApiGroupTarget } from '../../../actions/gateway'
import AddModal from './AddModal'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'

const Search = Input.Search

class ServiceList extends React.Component {
  state = {
    sortOrder: false,
    searchValue: '',
    page: 1,
    isShowAdd: false,
    targets: [],
    loading: false,
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = (query = {}) => {
    const { getGatewayApiGroupTargets, clusterID, apiGroupId } = this.props
    const { searchValue, page } = this.state
    searchValue && (query.name = encodeURIComponent(searchValue))
    query.page = page - 1
    query.size = 9999
    this.setState({
      loading: true,
    }, () => {
      getGatewayApiGroupTargets(clusterID, apiGroupId, query).then(res => {
        const result = getDeepValue(res, [ 'response', 'result' ]) || {}
        if (result.code === 200) {
          this.setState({
            targets: result.data || {},
          })
        }
        this.setState({
          loading: false,
        })
      })
    })
  }

  tableOnchange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    if (order) {
      this.setState({
        sortOrder: order,
      })
    } else {
      this.setState({
        sortOrder: false,
      })
    }
    const query = {
      sort: order ? `${order.substring(0, 1)},${columnKey}` : null,
    }
    this.loadData(query)
  }
  showAddModal = () => {
    this.setState({
      isShowAdd: true,
    })
  }
  handleDelete = record => {
    const { removeGatewayApiGroupTarget, clusterID, apiGroupId } = this.props
    const loadData = this.lodaData
    TenxModal.confirm({
      modalTitle: '解除绑定后端服务',
      title: `确定解除绑定服务 ${record.host} : ${record.port} 吗`,
      onOk() {
        return new Promise((resolve, reject) => {
          removeGatewayApiGroupTarget(clusterID, apiGroupId, record.id).then(res => {
            const result = getDeepValue(res, [ 'response', 'result' ]) || {}
            if (result.code === 200) {
              notification.success({
                message: `解除绑定服务 ${record.host} : ${record.port} 成功`,
              })
              loadData()
              return resolve()
            }
            notification.warn({
              message: `解除绑定服务 ${record.host} : ${record.port} 失败`,
            })
            reject()
          })
        })
      },
      onCancel() {},
    })
  }
  render() {
    const { location, proxyType, apiGroupId } = this.props
    const { sortOrder, searchValue, isShowAdd, targets, loading } = this.state
    const { totalElements: total, content: data } = targets || {}
    const { query } = location
    const columns = [
      {
        title: '后端服务地址',
        dataIndex: 'server',
        width: '40%',
        render: (text, record) => {
          return record.host + ':' + record.port
        },
      },
      {
        title: '权重',
        dataIndex: 'weight',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        width: '15%',
        sorter: true,
        sortOrder,
        render: (text, row) => formatDate(row.creationTime),
      },
      {
        title: '操作',
        width: '25%',
        render: (text, record) => {
          return (
            <div>
              <Button disabled={data.length === 1} onClick={() => this.handleDelete(record)}>
                <Icon type="delete" />
              </Button>
            </div>
          )
        },
      },
    ]
    const paginationProps = {
      simple: true,
      total,
      pageSize: 10,
      current: parseInt(query.page, 10) || 1,
      onChange: page => this.setState({ page }, () => {
        this.loadData()
      }),
    }
    return (
      <QueueAnim className="api-group-list">
        <div className="layout-content-btns" key="btns">
          <Button
            type="primary"
            onClick={() => this.showAddModal()}
            disabled={loading || proxyType === 0}
          >
            <Icon type="link" /> 关联后端服务
          </Button>
          <Button
            onClick={this.loadData}
          >
            <Icon type="sync" /> 刷新
          </Button>
          <Search
            className="api-group-list-search"
            placeholder="请输入关键字搜索"
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={searchValue => this.loadData({ searchValue, page: 1 })}
            value={searchValue}
          />
          {
            total > 0 && <div className="page-box">
              <span className="total">共 {total} 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div className="layout-content-body" key="body">
          <Card className="api-group-list-table">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={row => row.id}
              onChange={this.tableOnchange}
              loading={loading}
            />
          </Card>
        </div>
        {
          isShowAdd ?
            <AddModal
              targets={data}
              apiGroupId={apiGroupId}
              visible={isShowAdd}
              onCancel={() => this.setState({ isShowAdd: false })}
              onOk={this.loadData}
            />
            :
            null
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current } = state
  const currentUser = current.user.info
  const { cluster } = current.config
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    clusterID: cluster.id,
    currentUser,
    location,
  }
}

export default connect(mapStateToProps, {
  loadAllServices,
  getGatewayApiGroupTargets,
  removeGatewayApiGroupTarget,
})(ServiceList)
