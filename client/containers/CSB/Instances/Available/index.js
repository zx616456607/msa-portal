/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Available instances component
 *
 * 2017-12-04
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { parse as parseQuerystring } from 'query-string'
import { Button, Input, Icon, Card, Table, Pagination, notification } from 'antd'
import confirm from '../../../../components/Modal/confirm'
import {
  getInstances,
  abandonInstance,
} from '../../../../actions/CSB/instance'
import {
  instancesSltMaker,
  getQueryAndFuncs,
} from '../../../../selectors/CSB/instance'
import {
  UNUSED_CLUSTER_ID,
  CSB_AVAILABLE_INSTANCES_FLAG,
} from '../../../../constants'
import {
  formatDate,
  renderInstanceRole,
  formatFilterConditions,
  formatRole,
  handleHistoryForLoadData,
} from '../../../../common/utils'
import './style/index.less'
import { renderCSBInstanceStatus } from '../../../../components/utils'

const Search = Input.Search
const avaInstancesSlt = instancesSltMaker(CSB_AVAILABLE_INSTANCES_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_AVAILABLE_INSTANCES_FLAG)

class AvailableInstances extends React.Component {
  state = {
    name: '',
    sortOrder: false,
    filteredValue: [],
  }

  componentDidMount() {
    const { location } = this.props
    const { query } = location
    const { name, sort, filter } = query
    const sortOrder = this.formatSortOrder(sort)
    const filteredValue = formatRole(filter)
    this.setState({
      name,
      sortOrder,
      filteredValue,
    }, () => this.loadData({}, true))
  }

  loadData = (query, isFirst) => {
    const { getInstances, location, history } = this.props
    const { name } = this.state
    query = Object.assign({}, location.query, { name }, query)
    if (query.page === 1) {
      delete query.page
    }
    handleHistoryForLoadData(history, query, location, isFirst)
    getInstances(UNUSED_CLUSTER_ID, mergeQuery(query))
  }

  formatSortOrder = sort => {
    if (!sort) {
      return false
    }
    const order = sort.substring(0, 1)
    switch (order) {
      case 'a':
        return 'ascend'
      case 'd':
        return 'descend'
      default:
        return false
    }
  }

  tableOnchange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    const { role } = filters
    const filter = formatFilterConditions(filters)
    this.setState({
      filteredValue: role,
    })
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
      page: 1,
      filter,
      sort: order ? `${order.substring(0, 1)},${columnKey}` : null,
    }
    this.loadData(query)
  }

  abandonInstance = row => {
    const { abandonInstance, currentUser } = this.props
    const { instance = {} } = row
    const { id, name } = instance
    const self = this
    confirm({
      modalTitle: '放弃使用 CSB 实例',
      title: '放弃使用后将不能在此实例中发布、订阅服务；已发布的服务将被注销，已订购的服务将被退订。',
      content: `确定是否放弃使用 ${name} 实例？`,
      onOk() {
        return new Promise((resolve, reject) => {
          const query = {
            userId: currentUser.userID,
          }
          abandonInstance(UNUSED_CLUSTER_ID, id, query).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: '放弃使用实例成功',
            })
            self.loadData({ name: '', page: 1 })
          })
        })
      },
    })
  }

  render() {
    const { availableInstances, history, location } = this.props
    const { isFetching, content, totalElements, size } = availableInstances
    const { query } = location
    const { sortOrder, name, filteredValue } = this.state
    const columns = [
      {
        title: '实例名称',
        dataIndex: 'name',
        width: '10%',
        render: (text, row) => <Link to={`/csb-instances-available/${row.instance.id}`}>
          {row.instance.name}
        </Link>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        // filters: [{
        //  text: '运行中',
        //  value: 'run',
        // }, {
        //  text: '正在启动',
        //  value: 'starting',
        // }, {
        //  text: '已停止',
        //  value: 'stop',
        // }],
        render: (text, row) => renderCSBInstanceStatus(row.instance.status),
      },
      {
        title: '部署集群',
        dataIndex: 'cluster',
        width: '10%',
        render: (text, row) => row.instance.cluster && row.instance.cluster.clusterName,
      },
      {
        title: '实例授权',
        dataIndex: 'role',
        width: '10%',
        filters: [{
          text: '仅发布服务',
          value: 2,
        }, {
          text: '仅订阅服务',
          value: 1,
        }, {
          text: '发布服务 & 订阅服务',
          value: 4,
        }],
        filteredValue,
        render: role => renderInstanceRole(role),
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '10%',
        render: (text, row) => row.instance.description,
      },
      {
        title: '申请时间',
        dataIndex: 'creationTime',
        width: '10%',
        sorter: true,
        sortOrder,
        render: (text, row) => formatDate(row.instance.creationTime),
      },
      {
        title: '操作',
        width: '20%',
        render: (text, row) => {
          return (
            <div>
              <Button
                type="primary"
                className="detailBtn"
                onClick={() => history.push(`/csb-instances-available/${row.instance.id}`)}
              >
              查看实例
              </Button>
              <Button onClick={this.abandonInstance.bind(this, row)}>
                放弃使用
              </Button>
            </div>
          )
        },
      },
    ]
    const paginationProps = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page, 10) || 1,
      onChange: page => this.loadData({ page }),
    }
    return (
      <QueueAnim className="available-instance">
        <div className="layout-content-btns" key="btns">
          <Button
            onClick={() => this.loadData()}
          >
            <Icon type="sync" />刷新
          </Button>
          <Search
            className="available-instance-search"
            placeholder="按实例名搜索"
            onChange={e => this.setState({ name: e.target.value })}
            onSearch={name => this.loadData({ name, page: 1 })}
            value={name}
          />
          {
            totalElements > 0 && <div className="page-box">
              <span className="total">共 {totalElements} 条</span>
              <Pagination {...paginationProps}/>
            </div>
          }
        </div>
        <div className="layout-content-body" key="body">
          <Card className="available-instance-table">
            <Table
              columns={columns}
              dataSource={content}
              pagination={false}
              loading={isFetching}
              rowKey={row => row.instance.id}
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
  const { location } = ownProps
  location.query = parseQuerystring(location.search)
  return {
    currentUser,
    location,
    availableInstances: avaInstancesSlt(state, ownProps),
  }
}

export default connect(mapStateToProps, {
  getInstances,
  abandonInstance,
})(AvailableInstances)
