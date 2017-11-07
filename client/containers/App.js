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
import NamespaceSwitch from './NamespaceSwitch'
import { resetErrorMessage, getAuth, AUTH_FAILURE } from '../actions'
import {
  getCurrentUser,
} from '../actions/current'
import { scrollToTop } from '../common/utils'
import { JWT } from '../constants'
import { Route, Switch } from 'react-router-dom'
import { appChildRoutes } from '../RoutesDom'

const { Footer } = Layout
let errorMessageBefore
let errorMessageBeforeDateTime
const errorMessageCloseObj = {}

class App extends React.Component {
  state = {
    switchProjectOrCluster: false,
    switchProjectOrClusterText: null,
  }

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
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: newLocation,
      currentConfig: newCurrentConfig,
    } = nextProps
    const {
      location: oldLocation,
      currentConfig: oldCurrentConfig,
    } = this.props
    // Scroll to top when pathname change
    if (newLocation.pathname !== oldLocation.pathname) {
      document.body.scrollTop = 0
    }
    const { pathname: newPathname, search: newSearch } = newLocation
    const { pathname: oldPathname, search: oldSearch } = oldLocation
    const newPath = newPathname + newSearch
    const oldPath = oldPathname + oldSearch
    if (newPath !== oldPath) {
      scrollToTop()
    }
    // Show switch project/cluster
    const switchProjectOrClusterText = '切换项目/集群中 ...'
    const { project: newProject, cluster: newCluster } = newCurrentConfig
    const { project: oldProject, cluster: oldCluster } = oldCurrentConfig
    if (!newProject || !newCluster) {
      return
    }
    if (newProject.namespace !== oldProject.namespace
      || newCluster.id !== oldCluster.id
    ) {
      clearTimeout(this.switchProjectOrClusterTimeout)
      this.setState({
        switchProjectOrCluster: true,
        switchProjectOrClusterText,
      }, () => {
        this.switchProjectOrClusterTimeout = setTimeout(() => {
          this.setState({
            switchProjectOrCluster: false,
          })
        }, 200)
      })
    }
  }

  renderErrorMessage = () => {
    const { errorMessage, resetErrorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    if (!errorMessageCloseObj[errorMessageBeforeDateTime]
      && errorMessageBefore === errorMessage
      && (Date.now() - errorMessageBeforeDateTime) < 4500
    ) {
      return
    }
    errorMessageBefore = errorMessage
    errorMessageBeforeDateTime = Date.now()
    setTimeout(() => {
      notification.error({
        message: errorMessage,
        onClose: () => {
          resetErrorMessage()
          errorMessageCloseObj[errorMessageBeforeDateTime] = true
        },
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
    const { switchProjectOrCluster, switchProjectOrClusterText } = this.state
    const { config, user } = current
    if (!config.project || !config.project.namespace) {
      return this.renderLoading('加载基础配置中 ...')
    }
    if (!config.cluster || !config.cluster.id) {
      return this.renderLoading('加载集群配置中 ...')
    }
    if (!user || !user.info) {
      return this.renderLoading('加载用户信息中 ...')
    }
    if (switchProjectOrCluster) {
      return this.renderLoading(switchProjectOrClusterText)
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
      current,
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
          currentUser={current.user.info || {}}
        />
        <NamespaceSwitch userID={jwt.userID} />
        { this.renderChildren() }
        <Footer style={{ textAlign: 'center' }}>
          © 2017 北京云思畅想科技有限公司 | 时速云微服务治理平台 v1.0
        </Footer>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { entities } = state
  const { auth } = entities
  const current = state.current || {}
  return {
    errorMessage: state.errorMessage,
    auth,
    current,
    currentConfig: current.config || {},
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  getAuth,
  getCurrentUser,
})(App)
