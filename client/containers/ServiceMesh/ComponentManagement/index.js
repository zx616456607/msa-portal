/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * ComponentManagement container
 *
 * 2018-09-30
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Link } from 'react-router-dom'
import { formatDate } from '../../../common/utils'
import confirm from '../../../components/Modal/confirm'
import { loadComponent, deleteComponent, fetchComponent } from '../../../actions/serviceMesh'
import { Button, Input, Table, Card, Pagination, notification } from 'antd'
import './style/index.less'
import AddressTip from './AddressTip';

const Search = Input.Search

class ComponentManagement extends React.Component {
  state = {
    name: '',
    searchList: [],
    isSearch: false,
    componentName: '',
  }

  componentDidMount() {
    this.load()
  }

  load = () => {
    const { namespace, clusterID, loadComponent } = this.props
    loadComponent(clusterID, namespace)
  }

  handleRefresh = () => {
    this.load()
  }

  onSearch = () => {
    // const { clusterID, namespace } = this.props
    const { componentName } = this.state
    let filterList = []
    if (componentName) {
      const dataList = this.filterData()
      filterList = dataList.filter(item => item.name === componentName)
      this.setState({
        isSearch: true,
        searchList: filterList,
      })
    } else {
      this.setState({
        searchList: [],
        isSearch: false,
      }, () => {
        this.load()
      })
    }
  }

  handleEdit = name => {
    this.props.history.push(`/service-mesh/component-management/${name}?isAdd=false`)
  }

  handleDelete = name => {
    const { clusterID, deleteComponent } = this.props
    confirm({
      modalTitle: '删除操作',
      title: '删除组件后，该组件关联的服务在路由规则中设置的规则和对外访问方式同时被删除',
      content: `确定是否删除该组件 ${name} ？`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteComponent(clusterID, name).then(res => {
            if (res.error) {
              notification.success({
                message: `删除组件 ${name} 失败`,
              })
              return reject()
            }
            resolve()
            notification.success({
              message: `删除组件 ${name} 成功`,
            })
            this.load()
          })
        })
      },
    })
  }

  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }

  filterData = () => {
    const { dataList } = this.props
    const { searchList, isSearch } = this.state
    const dataAry = []
    const dataSource = isSearch ? searchList : dataList
    if (dataSource.length > 0) {
      dataSource.forEach(item => {
        const column = {
          name: item.metadata.name,
          description: item.metadata.annotations.description,
          servicecount: item.spec.subsets.length,
          startTime: item.metadata.creationTimestamp,
        }
        dataAry.push(column)
      })
      return dataAry
    }
    return dataAry
  }

  render() {
    const { dataList, isFetching } = this.props
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    const columns = [{
      id: 'id',
      title: '组件名称',
      width: '15%',
      dataIndex: 'name',
      render: text =>
        <Link to={`/service-mesh/component-management/component/detail?name=${text}`}>{text}</Link>,
    }, {
      title: '关联服务数量',
      dataIndex: 'servicecount',
    }, {
      title: '描述',
      width: '25%',
      dataIndex: 'description',
      render: text => text ? text : <span>--</span>
    }, {
      title: '服务地址',
      dataIndex: 'address',
      render: (text, record) =>
        <div className="AddressTipWrape">
          <AddressTip dataList={dataList} componentName={record.name}
            parentNode={'AddressTipWrape'} />
        </div>,
    }, {
      title: '创建时间',
      dataIndex: 'startTime',
      render: text => formatDate(text),
    }, {
      title: '操作',
      render: record => <div>
        <Button type="primary" className="edit" onClick={() => this.handleEdit(record.name)}>编辑</Button>
        <Button onClick={() => this.handleDelete(record.name)}>删除</Button>
      </div>,
    }]
    return (
      <QueueAnim className="component-management">
        <div className="component-management-btn layout-content-btns" key="btn">
          <Button icon="plus" type="primary" onClick={() =>
            this.props.history.push('/service-mesh/component-management/component/create?isAdd=true')}>创建组件</Button>
          <Button icon="sync" onClick={() => this.handleRefresh()}> 刷新</Button>
          <Search
            placeholder="请输入组件名称搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ componentName: e.target.value })}
            onSearch={this.onSearch}
          />
          <div className="pages">
            <span className="total">共计 {this.filterData().length} 条</span>
            <Pagination {...pagination} />
          </div>
        </div>
        <Card>
          <Table
            pagination={false}
            loading={isFetching}
            dataSource={this.filterData()}
            columns={columns}
            rowKey={row => row.id}
          />
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, serviceMesh } = state
  const { config } = current
  const { cluster, project } = config
  const namespace = project.namespace
  const clusterID = cluster.id
  const { componentList } = serviceMesh
  const { data, isFetching } = componentList
  const dataAry = data || {}
  const dataList = []
  Object.keys(dataAry).forEach(key => {
    dataList.push(dataAry[key])
  })
  return {
    dataList,
    namespace,
    clusterID,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  loadComponent,
  deleteComponent,
  fetchComponent,
})(ComponentManagement)
