/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * api group list
 *
 * 2019-03-04
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import { Button, Input, Icon, Card, Table, Pagination, notification } from 'antd'
import {
  getGatewayApiGroupList,
  delGatewayApiGroup,
} from '../../../actions/gateway'
import * as TenxModal from '@tenx-ui/modal'
import {
  formatDate,
} from '../../../common/utils'
import './style/index.less'
import TimeHover from '@tenx-ui/time-hover/lib'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'

const Search = Input.Search

class APIGroupList extends React.Component {
  state = {
    sortOrder: false,
    searchValue: '',
    filteredValue: [],
    apiGroupData: undefined,
    currentPage: 1,
    isFetching: false,
  }

  componentDidMount() {
    this.getApiGroups()
  }
  getApiGroups = () => {
    this.loadData()
  }

  loadData = table_query => {
    this.setState({
      isFetching: true,
    }, () => {
      const { getGatewayApiGroupList, clusterID } = this.props
      const { currentPage, searchValue } = this.state
      const { filter, sort } = table_query || {}
      const query = {
        page: currentPage - 1,
      }
      sort && (query.sort = sort)
      filter && (query.sort = sort)
      searchValue && (query.name = searchValue ? encodeURIComponent(searchValue) : '')
      getGatewayApiGroupList(clusterID, query).then(res => {
        if (getDeepValue(res, [ 'response', 'result', 'code' ]) === 200) {
          this.setState({
            apiGroupData: getDeepValue(res, [ 'response', 'result', 'data' ]),
          })
        }
        this.setState({
          isFetching: false,
        })
      })
    })
  }

  tableOnchange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    const filter = filters
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
      filter,
      sort: order ? `${order.substring(0, 1)},${columnKey}` : null,
    }
    this.loadData(query)
  }
  add = () => {
    const { history } = this.props
    history.push('/api-group/create')
  }
  handleDelete = record => {
    const { delGatewayApiGroup, clusterID, history } = this.props
    const loadData = this.loadData
    const modal = TenxModal.confirm({
      modalTitle: '删除 API 组',
      title: `确定删除该 API 组 ${record.name} 吗`,
      content: record.apis && record.apis.length ?
        <div> {record.name} 分组下有 {record.apis.length} 个 API ({record.apis.map(item => item.name).join(', ')}), 请先删除这些API, 再删除该 API 组.
          &nbsp;<a onClick={() => {
            modal.destroy()
            history.push(`/api-group/detail/${record.id}`)
          }}>去删除 API</a>
        </div>
        :
        '',
      okButtonProps: {
        disabled: record.apis && record.apis.length,
      },
      okText: '确定',
      onOk() {
        return new Promise((resolve, reject) => {
          delGatewayApiGroup(clusterID, record.id).then(res => {
            if (getDeepValue(res, [ 'response', 'result', 'code' ]) === 200) {
              notification.success({
                message: `删除 API 分组 ${record.name} 成功`,
              })
              loadData()
              resolve()
            } else {
              notification.warn({
                message: `删除 API 分组 ${record.name} 失败`,
              })
              reject()
            }
          })
        })
      },
      onCancel() {},
    })
  }
  render() {
    const { history } = this.props
    const { sortOrder, searchValue, filteredValue,
      apiGroupData, currentPage, isFetching } = this.state
    const { content: data, totalElements: total, pageable: { pageSize: size } }
      = apiGroupData || { pageable: { pageSize: 10 } }
    // const { query } = this.props.location
    const columns = [
      {
        title: 'API 组名称',
        dataIndex: 'name',
        width: '10%',
        render: (text, row) => {
          // if (row.status !== 1) {
          //   return <div>{text}</div>
          // }
          return <Link to={`/api-group/detail/${row.id}`}>{text}</Link>
        },
      },
      {
        title: '远程访问协议',
        dataIndex: 'protocol',
        width: 100,
      },
      {
        title: 'URL 前缀',
        dataIndex: 'path',
        width: '10%',
      },
      {
        title: '后端服务源',
        dataIndex: 'proxyType',
        width: 100,
        filters: [{
          text: '代理',
          value: 0,
        }, {
          text: '负载均衡',
          value: 1,
        }],
        filteredValue,
        render: text => {
          switch (text) {
            case 1:
              return '负载均衡'
            case 0:
            default:
              return '代理'
          }
        },
      },
      {
        title: 'API 数量',
        dataIndex: 'count',
        width: '10%',
        render: (t, record) => record.apis.length || 0,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '15%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '10%',
        sorter: true,
        sortOrder,
        render: (text, row) => <TimeHover time={formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss')} />,
      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          return (
            <div>
              <Button
                type="primary"
                className="detailBtn"
                onClick={() => history.push(`/api-group/update/${record.id}`)}
              >
                编辑
              </Button>
              <Button onClick={() => this.handleDelete(record)}>
                删除
              </Button>
            </div>
          )
        },
      },
    ]
    const paginationProps = {
      simple: true,
      total,
      pageSize: size,
      current: currentPage || 1,
      onChange: currentPage => this.setState({
        currentPage,
      }, () => {
        this.loadData()
      }),
    }
    return (
      <QueueAnim className="api-group-list">
        <div className="layout-content-btns" key="btns">
          <Button
            type="primary"
            onClick={() => this.add()}
          >
            <Icon type="plus" /> 创建 API 分组
          </Button>
          <Button
            onClick={() => this.loadData()}
          >
            <Icon type="sync" />刷新
          </Button>
          <Search
            className="api-group-list-search"
            placeholder="按 API 组名称搜索"
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={() => this.setState({
              currentPage: 1,
            }, () => {
              this.loadData()
            })}
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
              loading={isFetching}
              rowKey={row => row.id}
              onChange={this.tableOnchange}
            />
          </Card>
        </div>
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
  getGatewayApiGroupList,
  delGatewayApiGroup,
})(APIGroupList)
