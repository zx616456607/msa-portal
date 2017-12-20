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
import isEqual from 'lodash/isEqual'
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
  getInstanceRole,
  toQuerystring,
} from '../../../../common/utils'
import './style/index.less'

const Search = Input.Search
const avaInstancesSlt = instancesSltMaker(CSB_AVAILABLE_INSTANCES_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_AVAILABLE_INSTANCES_FLAG)

class AvailableInstances extends React.Component {
  state = {
    name: '',
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = query => {
    const { getInstances, currentUser, location, history } = this.props
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
    getInstances(UNUSED_CLUSTER_ID, mergeQuery(currentUser.userID, query))
  }

  abandonInstance = id => {
    const { abandonInstance, currentUser } = this.props
    const self = this
    confirm({
      modalTitle: '放弃使用实例',
      title: '是否确定放弃使用实例？',
      content: '',
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
        filters: [{
          text: '运行中',
          value: 'run',
        }, {
          text: '正在启动',
          value: 'starting',
        }, {
          text: '已停止',
          value: 'stop',
        }],
        render: () => '-',
      },
      {
        title: '部署集群',
        dataIndex: 'cluster',
        width: '10%',
        render: (text, row) => row.instance.clusterId,
      },
      {
        title: '可发布服务',
        dataIndex: 'publish',
        width: '10%',
        filters: [{
          text: '是',
          value: true,
        }, {
          text: '否',
          value: false,
        }],
        render: (text, row) => (getInstanceRole(row.role).publish ? '是' : '否'),
      },
      {
        title: '可订阅服务',
        dataIndex: 'subscribe',
        width: '10%',
        filters: [{
          text: '是',
          value: true,
        }, {
          text: '否',
          value: false,
        }],
        render: (text, row) => (getInstanceRole(row.role).subscribe ? '是' : '否'),
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
              <Button onClick={this.abandonInstance.bind(this, row.instance.id)}>
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
      current: parseInt(query.page) || 1,
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
            value={this.state.name}
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
