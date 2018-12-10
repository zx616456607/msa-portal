/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * ServiceMesh container
 *
 * 2018-09-30
 * @author
 */

import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Content from '../../components/Content'
import { Route, Switch } from 'react-router-dom'
import * as meshAction from '../../actions/serviceMesh'
import { renderLoading } from '../../components/utils'
import serviceMesh from '../../assets/img/serviceMesh/serviceMeshEmpty.png'
import ServiceMeshGraph from './Graph'
import MeshGateway from './MeshGateway'
import ComponentManagement from './ComponentManagement'
import CreateComponent from './ComponentManagement/CreateComponent'
import ComponentDetail from './ComponentManagement/ComponentDetail'
import RoutesManagement from './RoutesManagement'
import RouteDetail from './RoutesManagement/RouteDetail'

const serviceMeshChildRoutes = [
  {
    path: '/service-mesh',
    exact: true,
    component: ServiceMeshGraph,
    key: 'index',
  },
  {
    path: '/service-mesh/component-management',
    exact: true,
    component: ComponentManagement,
    key: 'component-management',
  },
  {
    path: '/service-mesh/mesh-gateway',
    exact: true,
    component: MeshGateway,
    key: 'mesh-gateway',
  },
  {
    path: '/service-mesh/component-management/component/create',
    exact: true,
    component: CreateComponent,
    key: 'create-component',
  },
  {
    path: '/service-mesh/component-management/:id',
    component: CreateComponent,
    exact: true,
    key: 'update-component',
  },
  {
    path: '/service-mesh/component-management/component/detail',
    component: ComponentDetail,
    exact: true,
    key: 'component-detail',
  },
  {
    path: '/service-mesh/routes-management',
    exact: true,
    component: RoutesManagement,
    key: 'component-management',
  },
  {
    path: '/service-mesh/routes-management/route-detail/:name',
    exact: true,
    component: RouteDetail,
    key: 'route-detail',
  },
  {
    path: '/service-mesh/routes-management/route-detail',
    exact: true,
    component: RouteDetail,
    key: 'new-route',
  },
]

class ServiceMesh extends React.Component {
  state = {
    loading: true,
    projects: [],
    clusters: {},
  }

  async componentDidMount() {
    const { loadIstioEnabledProjects } = this.props
    const res = await loadIstioEnabledProjects()
    if (res.error) {
      this.setState({
        loading: false,
      })
      return
    }
    this.setState({
      loading: false,
      ...res.response.result,
    })
  }

  renderChildren = () => {
    const { children, clusterID, project } = this.props
    const { loading, projects } = this.state
    if (loading) {
      return renderLoading('加载服务网格配置中 ...')
    }
    // istioEnabledClusterIds
    let isIstioEnabled
    projects.forEach(({ name, istioEnabledClusterIds }) => {
      if (name === project && istioEnabledClusterIds.includes(clusterID)) {
        isIstioEnabled = true
      }
    })
    if (!isIstioEnabled) {
      return <div className="loading">
        <img alt="istio-not-enabled" src={serviceMesh}/>
        <div>该项目对应的集群没有开启服务网格</div>
        <div>请先在『项目详情』中开启服务网格</div>
      </div>
    }
    return [
      children,
      <Switch key="switch">
        {
          serviceMeshChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    // const { location } = this.props
    return (
      <Layout className="service-mesh">
        <Content>
          {this.renderChildren()}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { cluster, project } = state.current.config
  return {
    clusterID: cluster.id,
    project: project.namespace,
  }
}

export default connect(mapStateToProps, {
  loadIstioEnabledProjects: meshAction.loadIstioEnabledProjects,
})(ServiceMesh)
