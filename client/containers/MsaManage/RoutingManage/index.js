/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * RoutingManage
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
  Button, Input, Table, Dropdown, Menu, Card, notification,
  Pagination, Icon,
} from 'antd'
import RoutingRuleModal from './RoutingRuleModal'
import confirm from '../../../components/Modal/confirm'
import {
  getGatewayRoutes,
  delGatewayRoute,
  updateGatewayRoute,
} from '../../../actions/gateway'
import {
  gatewayRoutesListSlt,
} from '../../../selectors/gateway'
import './style/index.less'
import GlobalRuleModal from './GlobalRuleSetting'

const Search = Input.Search

class RoutingManage extends React.Component {
  state = {
    ruleModal: false,
    currentRoute: null,
    currentPage: 1, // component start on page 1
    routeid: '',
  }

  defaultQuery = {
    page: 0, // api start on page 0
    size: 10,
  }

  componentDidMount() {
    this.loadRoutesList()
  }

  addRoutingRule = () => {
    this.setState({
      ruleModal: true,
      currentRoute: null,
    })
  }

  updateRoute = record => {
    this.setState({
      ruleModal: true,
      currentRoute: record,
    })
  }

  handleMenuClick = (record, { key }) => {
    const { delGatewayRoute, updateGatewayRoute, clusterID } = this.props
    const self = this
    if (key === 'delete') {
      confirm({
        title: `确认将路由 ${record.routeId} 删除吗？`,
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            delGatewayRoute(clusterID, record.id).then(res => {
              if (res.error) {
                return reject()
              }
              resolve()
              notification.success({
                message: '删除路由成功',
              })
              self.loadRoutesList()
            })
          })
        },
      })
    } else if (key === 'disable' || key === 'enable') {
      const status = !record.status
      const statusText = record.status ? '停用' : '启用'
      confirm({
        title: `确认将路由 ${record.routeId} ${statusText}吗？`,
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            updateGatewayRoute(clusterID, record.id, { status }).then(res => {
              if (res.error) {
                return reject()
              }
              resolve()
              notification.success({
                message: `${statusText}路由成功`,
              })
              self.loadRoutesList()
            })
          })
        },
      })
    }
  }

  loadRoutesList = query => {
    const { getGatewayRoutes, clusterID } = this.props
    const { currentPage, routeid } = this.state
    query = Object.assign(
      {},
      this.defaultQuery,
      {
        page: currentPage - 1,
        routeid: encodeURIComponent(routeid),
      },
      query
    )
    if (!query.routeid) {
      delete query.routeid
    }
    getGatewayRoutes(clusterID, query)
  }

  onPageChange = currentPage => {
    this.setState({
      currentPage,
    }, this.loadRoutesList)
  }

  onSearch = routeid => {
    this.setState({
      routeid,
      currentPage: 1,
    }, this.loadRoutesList)
  }

  toggleGlobalVisible = () => {
    this.setState(preState =>
      ({ globalVisible: !preState.globalVisible }))
  }

  render() {
    const { isFetching, routesList, totalElements } = this.props
    const { ruleModal, currentRoute, currentPage, globalVisible } = this.state
    const columns = [{
      title: '路由名称',
      dataIndex: 'routeId',
    }, {
      title: '路由路径',
      dataIndex: 'path',
    }, {
      title: '路由状态',
      dataIndex: 'status',
      render: text => <span className={text ? 'success-status' : 'error-status'}>
        {text ? '开启' : '关闭'}
      </span>,
    }, {
      title: '目标服务类型',
      dataIndex: 'serviceID',
      render: (text, record) => (record.serviceId ? '微服务 ID' : '路由 URL'),
    }, {
      title: '目标服务地址',
      dataIndex: 'url',
      render: (text, record) => (record.serviceId || record.url || '-'),
    }, {
      title: '描述',
      dataIndex: 'description',
      render: desc => desc || '-',
    }, {
      title: '去掉路径前缀',
      dataIndex: 'stripPrefix',
      render: (text, record) => (record.stripPrefix ? '开启' : '关闭'),
    }, {
      title: '失败重试',
      dataIndex: 'retryable',
      render: (text, record) => (record.retryable ? '开启' : '关闭'),
    }, {
      title: '敏感 Header',
      dataIndex: 'headerFlag',
      render: text => (text === 'custom' ? '自定义' : '全局默认'),
    }, {
      title: '操作',
      render: (text, record) => {
        const menu = (
          <Menu onClick={this.handleMenuClick.bind(this, record)} style={{ width: 81 }}>
            {
              record.status
                ? <Menu.Item key="disable">停用</Menu.Item>
                : <Menu.Item key="enable">启用</Menu.Item>
            }
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        )
        return (
          <Dropdown.Button onClick={this.updateRoute.bind(this, record)} overlay={menu}>
            修改
          </Dropdown.Button>
        )
      },
    }]
    /* const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
      }),
    } */
    return (
      <QueueAnim className="router-manage">
        <div className="router-manage-btn-box layout-content-btns" key="btns">
          <Button type="primary" icon="plus" onClick={this.addRoutingRule}>
          添加路由
          </Button>
          <Button onClick={this.toggleGlobalVisible}>
            <Icon type="setting" /> 全局路由配置
          </Button>
          <Button icon="sync" onClick={this.loadRoutesList.bind(this, {})} loading={isFetching}>
          刷新
          </Button>
          {/* <Button><Icon type="delete"/>删除</Button> */}
          <Search
            placeholder="按路由名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ routeid: e.target.value })}
            onSearch={this.onSearch}
          />
          {
            totalElements > 0 && <div className="page">
              <span className="total">共 { totalElements } 条</span>
              <Pagination
                simple
                current={currentPage}
                total={totalElements}
                pageSize={this.defaultQuery.size}
                onChange={this.onPageChange}
              />
            </div>
          }
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              className="router-manage-table"
              pagination={false}
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={routesList}
              loading={isFetching}
              rowKey={record => record.id}
            />
          </Card>
          {
            ruleModal && <RoutingRuleModal
              visible={ruleModal}
              onCancel={() => this.setState({ ruleModal: false })}
              loadRoutesList={this.loadRoutesList}
              currentRoute={currentRoute}
            />
          }
        </div>
        {
          globalVisible &&
          <GlobalRuleModal
            visible={globalVisible}
            onCancel={this.toggleGlobalVisible}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { id } = current.config.cluster
  return {
    clusterID: id,
    ...gatewayRoutesListSlt(state),
  }
}

export default connect(mapStateToProps, {
  getGatewayRoutes,
  delGatewayRoute,
  updateGatewayRoute,
})(RoutingManage)
