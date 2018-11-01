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
import { serviceMeshChildRoutes } from '../../RoutesDom'
import * as meshAction from '../../actions/serviceMesh'
import { renderLoading } from '../../components/utils'
import spingCloud from '../../assets/img/apm/Sringcloud.png'

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
    console.warn('res', res)
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
        <img alt="istio-not-enabled" src={spingCloud}/>
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
