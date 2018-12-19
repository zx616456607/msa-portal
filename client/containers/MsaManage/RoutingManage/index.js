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
import { withNamespaces } from 'react-i18next'

const Search = Input.Search


@withNamespaces('springCloudRouteManage')
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
    const { delGatewayRoute, updateGatewayRoute, clusterID, t } = this.props
    const self = this
    if (key === 'delete') {
      confirm({
        title: t('table.sureToDeleteRoute', {
          replace: { routeId: record.routeId },
        }),
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            delGatewayRoute(clusterID, record.id).then(res => {
              if (res.error) {
                return reject()
              }
              resolve()
              notification.success({
                message: t('table.deleteRouteSuccess'),
              })
              self.loadRoutesList()
            })
          })
        },
      })
    } else if (key === 'disable' || key === 'enable') {
      const status = !record.status
      const statusText = record.status ? t('table.stop') : t('table.start')
      confirm({
        title: t('table.sureToRoute', {
          replace: { routeId: record.routeId, statusText },
        }),
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            updateGatewayRoute(clusterID, record.id, { status }).then(res => {
              if (res.error) {
                return reject()
              }
              resolve()
              notification.success({
                message: t('table.routeSuccess', {
                  replace: { statusText },
                }),
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
    const { isFetching, routesList, totalElements, t } = this.props
    const { ruleModal, currentRoute, currentPage, globalVisible } = this.state
    const columns = [{
      title: t('table.name'),
      dataIndex: 'routeId',
    }, {
      title: t('table.path'),
      dataIndex: 'path',
    }, {
      title: t('table.status'),
      dataIndex: 'status',
      render: text => <span className={text ? 'success-status' : 'error-status'}>
        {text ? t('table.start') : t('table.stop')}
      </span>,
    }, {
      title: t('table.targetType'),
      dataIndex: 'serviceID',
      render: (text, record) => (record.serviceId ? t('table.microId') : t('table.url')),
    }, {
      title: t('table.targetUrl'),
      dataIndex: 'url',
      render: (text, record) => (record.serviceId || record.url || '-'),
    }, {
      title: t('table.desc'),
      dataIndex: 'description',
      render: desc => desc || '-',
    }, {
      title: t('table.noPrefix'),
      dataIndex: 'stripPrefix',
      render: (text, record) => (record.stripPrefix ? t('table.start') : t('table.stop')),
    }, {
      title: t('table.retry'),
      dataIndex: 'retryable',
      render: (text, record) => (record.retryable ? t('table.start') : t('table.stop')),
    }, {
      title: t('table.sensitive'),
      dataIndex: 'headerFlag',
      render: text => (text === 'custom' ? t('table.customize') : t('table.globalDefault')),
    }, {
      title: t('table.action'),
      render: (text, record) => {
        const menu = (
          <Menu onClick={this.handleMenuClick.bind(this, record)} style={{ width: 81 }}>
            {
              record.status
                ? <Menu.Item key="disable">{t('table.stop')}</Menu.Item>
                : <Menu.Item key="enable">{t('table.start')}</Menu.Item>
            }
            <Menu.Item key="delete">{t('table.delete')}</Menu.Item>
          </Menu>
        )
        return (
          <Dropdown.Button onClick={this.updateRoute.bind(this, record)} overlay={menu}>
            {t('table.modify')}
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
            {t('table.addRoute')}
          </Button>
          <Button onClick={this.toggleGlobalVisible}>
            <Icon type="setting" /> {t('table.globalRouteConf')}
          </Button>
          <Button icon="sync" onClick={this.loadRoutesList.bind(this, {})} loading={isFetching}>
            {t('table.refresh')}
          </Button>
          {/* <Button><Icon type="delete"/>删除</Button> */}
          <Search
            placeholder={t('table.searchByName')}
            style={{ width: 200 }}
            onChange={e => this.setState({ routeid: e.target.value })}
            onSearch={this.onSearch}
          />
          {
            totalElements > 0 && <div className="page">
              <span className="total">{
                t('table.totalElements', {
                  replace: { totalElements },
                })
              }</span>
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
