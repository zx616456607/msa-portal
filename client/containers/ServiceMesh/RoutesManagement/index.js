/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * RoutesManagement container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import { Button, Input, Table, Card, Pagination, Dropdown, Menu, notification,
  Tooltip, Icon } from 'antd'
import { loadVirtualServiceList, deleteVirtualService } from '../../../actions/meshRouteManagement'
import { loadComponent } from '../../../actions/serviceMesh'
import { formatDate } from '../../../common/utils'
import confirm from '../../../components/Modal/confirm'
import './style/index.less'

const Search = Input.Search

class RoutesManagement extends React.Component {
  state = {
    tempList: [],
    allList: [],
    searchValue: '',
    loading: false,
    currentPage: 1,
  }
  componentDidMount() {
    this.loadData()
  }
  loadData = () => {
    this.setState({
      loading: true,
    }, () => {
      const { loadVirtualServiceList, clusterId, namespace, loadComponent } = this.props
      loadComponent(clusterId, namespace)
      const query = {
        clusterId,
      }
      loadVirtualServiceList(query).then(res => {
        const temp = {
          loading: false,
        }
        if (res.response.result) {
          temp.tempList = Object.values(res.response.result)
          temp.allList = Object.values(res.response.result)
        }
        this.setState(temp)
      })
    })
  }
  filterData = () => {
    const { searchValue } = this.state
    const { allList } = this.state
    const tempList = []
    allList.map(item => {
      if (item.metadata.name.indexOf(searchValue) > -1) {
        tempList.push(item)
      }
      return item
    })
    this.setState({
      tempList,
    })
  }
  onClickUpdate = record => {
    this.props.history.push('/service-mesh/routes-management/route-detail/' + record.metadata.name)
  }
  onClickDelete = record => {
    const name = record.metadata.name
    const { deleteVirtualService, clusterId } = this.props
    confirm({
      modalTitle: '删除操作',
      title: '删除路由规则后，该路由规则关联的服务仅支持集群内访问，不可对外访问',
      content: `确定删除路由规则 ${name} 吗？`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteVirtualService(clusterId, name).then(res => {
            if (res.error) {
              notification.error({
                message: '删除失败',
              })
              return reject()
            }
            resolve()
            notification.success({
              message: '删除路由规则成功',
            })
            this.loadData()
          })
        })
      },
    })
  }
  render() {
    const columns = [
      {
        dataIndex: 'name',
        rowKey: 'name',
        title: '路由规则名称',
        width: '10%',
        render: (text, row) => row.metadata.name,
      },
      {
        dataIndex: 'visitType',
        rowKey: 'visitType',
        title: '访问方式',
        width: '10%',
        render: (text, row) => (row.spec.gateways ? '公网' : '仅集群内'),
      },
      {
        dataIndex: 'net',
        rowKey: 'net',
        title: '网关',
        render: (text, row) => (row.referencedGateways && row.referencedGateways.length ?
          (row.referencedGateways.map(item => <div>
            {item.metadata.name} {
              item.deleted === true && <Tooltip
                placement="right"
                className="warnIcon"
                title={`该路由规则关联的网关${item.metadata.name}已被删除，请编辑路由规则移除该网关或重新选择其他网关`}>
                <Icon type="info-circle-o" />
              </Tooltip>
            }
          </div>)) : '-'),
        // <Tooltip
        //   placement="right"
        //   className="warnIcon"
        //   title="该路由规则关联的网关有变动或某个网关已被删除，请知晓">
        //   <Icon type="info-circle-o" />
        // </Tooltip>
      },
      {
        dataIndex: 'type',
        rowKey: 'type',
        title: '路由类型',
        width: '15%',
        render: (text, row) => {
          let res = '-'
          if (row.spec.http && row.spec.http[0]) {
            if (row.spec.http[0].route) {
              res = '基于请求内容'
            } else if (row.spec.http[0].route[0].weight) {
              res = '基于流量比例'
            }
          }
          return res
        },
      },
      {
        dataIndex: 'plugins',
        rowKey: 'plugins',
        title: '组件',
        width: '10%',
        render: (text, record) => {
          const { components } = this.props
          const { host } = record.spec.http[0].route[0].destination
          const componentDel = components.findIndex(v => v.metadata.name === host)
          if (componentDel < 0) {
            return '-'
          }
          const existHost = []
          return record.spec.http.map(item => {
            if (!existHost.includes(item.route[0].destination.host)) {
              existHost.push(item.route[0].destination.host)
              return <div>
                {item.route[0].destination.host}
              </div>
            }
            return null
          })
        },
      },
      // {
      //   dataIndex: 'version',
      //   rowKey: 'version',
      //   title: '作用版本',
      //   render: (text, record) => {
      //     return record.spec.http.map(item => {
      //       return item.route[0].destination.subset
      //     }).join(' / ')
      //   },
      // },
      {
        dataIndex: 'creationTime',
        rowKey: 'creationTime',
        title: '创建时间',
        sorter: (a, b) =>
          new Date(a.metadata.creationTimestamp)
          <
          new Date(b.metadata.creationTimestamp),
        render: (text, row) => formatDate(row.metadata.creationTimestamp),
      },
      {
        dataIndex: 'operation',
        rowKey: 'operation',
        title: '操作',
        render: (text, record) => <div>
          <Dropdown.Button onClick={() => this.onClickUpdate(record)} overlay={
            <Menu onClick={() => this.onClickDelete(record)} style={{ width: 85 }}>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          }>编辑</Dropdown.Button>
        </div>,
      },
    ]
    const { tempList, searchValue, currentPage, loading } = this.state
    const pagination = {
      defaultCurrent: 1,
      total: tempList.length || 0,
      size: 10,
      current: currentPage,
      onChange: currentPage => this.setState({ currentPage }),
    }
    return <QueueAnim id="routes-management">
      <div className="options-wrapper" key="options-wrapper">
        <div className="left">
          <Button type="primary" icon="plus" onClick={() => this.props.history.push('/service-mesh/routes-management/route-detail/')}>创建路由规则</Button>
          <Button icon="sync" onClick={() => {
            this.setState({ searchValue: '' }); this.loadData()
          }}>刷新</Button>
          <Search
            placeholder="请输入路由名称搜索"
            style={{ width: 200 }}
            value={searchValue}
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={() => this.filterData()}
          />
        </div>
        <div className="page-box">
          <span className="total">共 {tempList.length} 条</span>
          <Pagination simple {...pagination} />
        </div>
      </div>
      <Card key="table-wrapper">
        <Table
          columns={columns}
          dataSource={tempList}
          loading={loading}
          pagination={false}
        />
      </Card>
    </QueueAnim>

  }
}

const mapStateToProps = state => {
  const { current, serviceMesh } = state
  const { config } = current
  const { project } = config
  const namespace = project.namespace
  const { componentList } = serviceMesh
  const { data } = componentList
  const dataAry = data || {}
  const components = []
  Object.keys(dataAry).forEach(key => {
    components.push(dataAry[key])
  })

  return {
    clusterId: current.config.cluster.id,
    namespace,
    components,
  }
}

export default connect(mapStateToProps, {
  loadComponent,
  loadVirtualServiceList,
  deleteVirtualService,
})(RoutesManagement)

