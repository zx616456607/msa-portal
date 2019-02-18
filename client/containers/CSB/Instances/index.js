/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instances
 * CSB 实例
 *
 * 2017-12-01
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
// import Sider from '../../../components/Sider'
import Content from '../../../components/Content'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { getAllClusters } from '../../../actions/current'
import AvailableInstances from './Available'
import PublicInstances from './Public'
import MyApplication from './MyApplication'
import LoadableWrapper from '../../../components/LoadableWrapper'

const csbInstancesChildRoutes = [
  {
    path: '/csb-instances',
    exact: true,
    render: () => <Redirect to="/csb-instances/available" component={AvailableInstances} />,
    key: 'index',
  },
  {
    path: '/csb-instances/available',
    component: AvailableInstances,
    exact: true,
    key: 'available',
  },
  {
    path: '/csb-instances/available/:instanceID',
    component: LoadableWrapper({
      path: 'CSB/InstanceDetail',
      loader: () => import('../InstanceDetail' /* webpackChunkName: "csb-instance-detail" */),
    }),
    key: 'csb-instances',
  },
  {
    path: '/csb-instances/public',
    component: PublicInstances,
    exact: true,
    key: 'public',
  },
  {
    path: '/csb-instances/my-application',
    component: MyApplication,
    exact: true,
    key: 'my-application',
  },
]

class CSBInstances extends React.Component {
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
          csbInstancesChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    // const title = (
    //   <div>
    //     CSB 实例
    //   </div>
    // )
    if (this.props.location.pathname.split('instances/available/')[1]) return this.renderChildren()
    return (
      <Layout className="csb-instances">
        {/* <Sider
          key="sider"
          extra={false}
          title={title}
          location={location}
          menu={{
            items: menus,
            defaultOpenKeys: [ 'mine-csb-instances', 'public-csb-instances' ],
          }}
        />*/}
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
})(withRouter(CSBInstances))
