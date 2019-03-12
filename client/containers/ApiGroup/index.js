/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * API group-list
 * API 分组
 *
 * 2019-03-04
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { getAllClusters } from '../../actions/current'
import GroupList from './List'
import GroupDetail from './Detail'
import GroupListCreate from './List/Create'
// import LoadableWrapper from '../../../components/LoadableWrapper'

const apiGroupChildRoutes = [
  {
    path: '/api-group',
    exact: true,
    render: () => <Redirect to="/api-group/list" component={GroupList} />,
    key: 'index',
  },
  {
    path: '/api-group/list',
    component: GroupList,
    exact: true,
    key: 'list',
  },
  {
    path: '/api-group/detail/:apiGroupId',
    component: GroupDetail,
    exact: true,
    key: 'detail',
  },
  {
    path: '/api-group/create',
    component: GroupListCreate,
    exact: true,
    key: 'list-create',
  },
  {
    path: '/api-group/update/:apiGroupId',
    component: GroupListCreate,
    exact: true,
    key: 'list-create',
  },
  // {
  //   path: '/csb-instances/available/:instanceID',
  //   component: LoadableWrapper({
  //     path: 'CSB/InstanceDetail',
  //     loader: () => import('../InstanceDetail' /* webpackChunkName: "csb-instance-detail" */),
  //   }),
  //   key: 'csb-instances',
  // },
]

class APIGroup extends React.Component {
  componentDidMount() {
    const { getAllClusters } = this.props
    getAllClusters({ size: 100 })
  }

  renderChildren = () => {
    const { children } = this.props
    return [
      children,
      <Switch key="switch">
        {
          apiGroupChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    if (this.props.location.pathname.split('instances/available/')[1]) return this.renderChildren()
    return (
      <Layout className="api-group">
        <Content>
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps, {
  getAllClusters,
})(withRouter(APIGroup))
