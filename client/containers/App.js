/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * App container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout, Spin, Modal, notification } from 'antd'
import { parse } from 'query-string'
import Header from '../components/Header'
import { resetErrorMessage, getAuth, AUTH_FAILURE } from '../actions'
import {
  setCurrent,
  getCurrentUser,
  getUserProjects,
  getProjectClusters,
  getDefaultClusters,
} from '../actions/current'
import { JWT } from '../constants'
import { Route, Switch } from 'react-router-dom'
import { appChildRoutes } from '../RoutesDom'

const { Footer } = Layout

class App extends React.Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
  }

  componentWillMount() {
    const {
      getAuth,
      getCurrentUser,
      getUserProjects,
      location,
      history,
    } = this.props
    const { username, token } = parse(location.search)
    getAuth({ username, token }).then(res => {
      if (res.type === AUTH_FAILURE) {
        Modal.error({
          title: '认证失败',
          content: '请您刷新页面重试或点击确定返回',
          closable: false,
          onOk: () => history.goBack(),
        })
        return
      }
      const jwt = res.response.entities.auth[JWT]
      // Save jwt token to localStorage
      if (localStorage) {
        localStorage.setItem(JWT, jwt.token)
      }
      const { userID } = jwt
      // Get user detail info
      getCurrentUser(userID)
      // Get user projects
      getUserProjects(userID)
    })
  }

  renderErrorMessage = () => {
    const { errorMessage, resetErrorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    setTimeout(() => {
      notification.error({
        message: errorMessage,
        onClose: resetErrorMessage,
      })
    })
    setTimeout(() => resetErrorMessage(), 4500)
  }

  renderLoading = tip => (
    <div className="loading">
      <Spin size="large" tip={tip} />
    </div>
  )

  renderChildren = () => {
    const { current, children } = this.props
    const { config, user } = current
    if (!config.cluster || !config.cluster.id) {
      return this.renderLoading('加载基础配置中 ...')
    }
    if (!user || !user.info) {
      return this.renderLoading('加载用户信息中 ...')
    }
    return [
      children,
      <Switch key="switch">
        {
          appChildRoutes.map(routeProps => <Route {...routeProps} />)
        }
      </Switch>,
    ]
  }

  render() {
    const {
      auth,
      location,
      setCurrent,
      current,
      projects,
      projectClusters,
      getProjectClusters,
    } = this.props
    const jwt = auth[JWT] || {}
    if (!jwt.token) {
      return this.renderLoading('Loading...')
    }
    return (
      <Layout id="app">
        {this.renderErrorMessage()}
        <Header
          location={location}
          setCurrent={setCurrent}
          currentUser={current.user.info || {}}
          projects={projects}
          getProjectClusters={getProjectClusters}
          projectClusters={projectClusters}
        />
        { this.renderChildren() }
        <Footer style={{ textAlign: 'center' }}>
          Tenxcloud ©2017 Created by Tenxcloud UED
        </Footer>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { auth, projects, clusters } = entities
  const userProjects = current.projects && current.projects.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    errorMessage: state.errorMessage,
    auth,
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectClusters,
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  getAuth,
  setCurrent,
  getCurrentUser,
  getUserProjects,
  getProjectClusters,
  getDefaultClusters,
})(App)
